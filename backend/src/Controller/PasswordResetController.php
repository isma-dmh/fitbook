<?php

namespace App\Controller;

use App\Repository\UtilisateurRepository;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use SymfonyCasts\Bundle\ResetPassword\Exception\ResetPasswordExceptionInterface;
use SymfonyCasts\Bundle\ResetPassword\ResetPasswordHelperInterface;
use Symfony\Component\Validator\Constraints as Assert;

#[Route('/api/auth')]
final class PasswordResetController extends AbstractController
{
    #[Route('/forgot-password', name: 'api_forgot_password', methods: ['POST'])]
    public function forgotPassword(
        Request $request,
        UtilisateurRepository $users,
        ResetPasswordHelperInterface $resetPasswordHelper,
        MailerInterface $mailer,
        LoggerInterface $logger,
        #[Autowire('%env(FRONTEND_URL)%')] string $frontendUrl,
    ): JsonResponse {
        $email = $request->toArray()['email'] ?? '';
        $user = $users->findOneBy(['email' => $email]);

        if ($user && $user->isActif()) {
            try {
                $resetToken = $resetPasswordHelper->generateResetToken($user);
                $lien = $frontendUrl . '/reinitialiser-mot-de-passe?token=' . $resetToken->getToken();
                $mailer->send((new Email())
                    ->from('no-reply@fitbook.local')->to($user->getEmail())
                    ->subject('Réinitialisation de ton mot de passe')
                    ->html('<p><a href="' . $lien . '">Choisir un nouveau mot de passe</a></p>'));
            } catch (ResetPasswordExceptionInterface | TransportExceptionInterface $e) {
                $logger->error('Échec de la demande de réinitialisation', ['erreur' => $e->getMessage()]);
            }
        }

        return $this->json(['message' => 'Si un compte existe, un email a été envoyé.'], 202);
    }

    #[Route('/reset-password', name: 'api_reset_password', methods: ['POST'])]
    public function resetPassword(
        Request $request,
        ValidatorInterface $validator,
        ResetPasswordHelperInterface $resetPasswordHelper,
        UserPasswordHasherInterface $hasher,
        EntityManagerInterface $em,
    ): JsonResponse {
        $data = $request->toArray();
        $violations = $validator->validate($data, new Assert\Collection(fields:[
            'token'    => [new Assert\Type('string'), new Assert\NotBlank()],
            'password' => [new Assert\Type('string'), new Assert\NotBlank(), new Assert\Length(min: 8)],
        ]));
        if (count($violations) > 0) {
            return $this->json(['error' => 'Données invalides'], 422);
        }

        try {
            $user = $resetPasswordHelper->validateTokenAndFetchUser($data['token']);
        } catch (ResetPasswordExceptionInterface) {
            return $this->json(['error' => 'Lien invalide ou expiré'], 400);
        }

        $resetPasswordHelper->removeResetRequest($data['token']);
        $user->setPassword($hasher->hashPassword($user, $data['password']));
        $em->flush();

        return $this->json(['message' => 'Mot de passe modifié.']);
    }
}
