<?php

namespace App\Controller;

use App\Entity\Utilisateur;
use App\Repository\RoleRepository;
use App\Repository\UtilisateurRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Psr\Log\LoggerInterface;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use SymfonyCasts\Bundle\VerifyEmail\VerifyEmailHelperInterface;
use Symfony\Component\Validator\Constraints as Assert;
use SymfonyCasts\Bundle\VerifyEmail\Exception\VerifyEmailExceptionInterface;

#[Route('/api/auth')]
final class RegistrationController extends AbstractController
{
    #[Route('/register', name: 'api_register', methods: ['POST'])]
    public function register(
        Request $request,
        ValidatorInterface $validator,
        UtilisateurRepository $users,
        RoleRepository $roles,
        UserPasswordHasherInterface $hasher,
        EntityManagerInterface $em,
        VerifyEmailHelperInterface $verifyEmailHelper,
        MailerInterface $mailer,
        LoggerInterface $logger,
    ): JsonResponse {
        $data = $request->toArray();

        $violations = $validator->validate($data, new Assert\Collection(fields:[
            'email'    => [new Assert\Type('string'), new Assert\NotBlank(), new Assert\Email()],
            'password' => [new Assert\Type('string'), new Assert\NotBlank(), new Assert\Length(min: 8)],
            'nom'      => [new Assert\Type('string'), new Assert\NotBlank()],
            'prenom'   => [new Assert\Type('string'), new Assert\NotBlank()],
            'role'     => [new Assert\Type('string'), new Assert\Choice(choices: ['sportif', 'coach', 'salle'])],
        ]));
        if (count($violations) > 0) {
            $errors = [];
            foreach ($violations as $v) {
                $errors[$v->getPropertyPath()] = $v->getMessage();
            }
            return $this->json(['errors' => $errors], 422);
        }

        if ($users->findOneBy(['email' => $data['email']])) {
            return $this->json(['error' => 'Email déjà utilisé'], 409);
        }

        $role = $roles->findOneBy(['libelle' => $data['role']]);
        if (!$role) {
            return $this->json(['error' => 'Rôle introuvable'], 500);
        }

        $user = new Utilisateur();
        $user->setEmail($data['email'])->setNom($data['nom'])->setPrenom($data['prenom'])
            ->setRole($role)->setEmailVerifie(false)->setActif(true);
        $user->setPassword($hasher->hashPassword($user, $data['password']));

        $em->persist($user);
        $em->flush();

        try {
            $this->sendVerificationEmail($user, $verifyEmailHelper, $mailer);
        } catch (TransportExceptionInterface $e) {
            // Le compte est créé mais l'email n'est pas parti : on le journalise
            // et l'utilisateur pourra demander un nouvel envoi (US-T4).
            $logger->error('Échec de l\'envoi de l\'email de confirmation', [
                'userId' => $user->getId(),
                'erreur' => $e->getMessage(),
            ]);

            return $this->json([
                'message' => 'Compte créé, mais l\'email de confirmation n\'a pas pu être envoyé. Demande un nouvel envoi.',
                'emailEnvoye' => false,
            ], 201);
        }

        return $this->json(['message' => 'Compte créé, vérifie ta boîte mail.', 'emailEnvoye' => true], 201);
    }

    #[Route('/verify-email', name: 'api_verify_email', methods: ['GET'])]
    public function verifyEmail(
        Request $request,
        UtilisateurRepository $users,
        VerifyEmailHelperInterface $verifyEmailHelper,
        EntityManagerInterface $em,
        #[Autowire('%env(FRONTEND_URL)%')] string $frontendUrl,
    ): RedirectResponse {
        $user = $users->find($request->query->getInt('id'));
        if (!$user) {
            return $this->redirect($frontendUrl . '/email-verifie?statut=invalide');
        }
        try {
            $verifyEmailHelper->validateEmailConfirmationFromRequest(
                $request,
                (string) $user->getId(),
                $user->getEmail()
            );
        } catch (VerifyEmailExceptionInterface) {
            return $this->redirect($frontendUrl . '/email-verifie?statut=expire');
        }
        $user->setEmailVerifie(true);
        $em->flush();

        return $this->redirect($frontendUrl . '/email-verifie?statut=ok');
    }

    #[Route('/resend-verification', name: 'api_resend_verification', methods: ['POST'])]
    public function resendVerification(
        Request $request,
        ValidatorInterface $validator,
        UtilisateurRepository $users,
        VerifyEmailHelperInterface $verifyEmailHelper,
        MailerInterface $mailer,
        LoggerInterface $logger,
    ): JsonResponse {
        $data = $request->toArray();

        $violations = $validator->validate($data, new Assert\Collection(fields:[
            'email' => [new Assert\Type('string'), new Assert\NotBlank(), new Assert\Email()],
        ]));
        if (count($violations) > 0) {
            return $this->json(['error' => 'Email invalide'], 422);
        }

        $user = $users->findOneBy(['email' => $data['email']]);
        if ($user && $user->isActif() && !$user->isEmailVerifie()) {
            try {
                $this->sendVerificationEmail($user, $verifyEmailHelper, $mailer);
            } catch (TransportExceptionInterface $e) {
                $logger->error('Échec du renvoi de l\'email de confirmation', [
                    'userId' => $user->getId(),
                    'erreur' => $e->getMessage(),
                ]);
            }
        }

        return $this->json([
            'message' => 'Si un compte non confirmé existe pour cette adresse, un nouvel email a été envoyé.',
        ], 202);
    }

    private function sendVerificationEmail(
        Utilisateur $user,
        VerifyEmailHelperInterface $verifyEmailHelper,
        MailerInterface $mailer,
    ): void {
        $signature = $verifyEmailHelper->generateSignature(
            'api_verify_email',
            (string) $user->getId(),
            $user->getEmail(),
            ['id' => $user->getId()]
        );

        $mailer->send((new Email())
            ->from('no-reply@fitbook.local')->to($user->getEmail())
            ->subject('Confirme ton adresse email')
            ->html('<p>Bienvenue sur FitBook !</p><p><a href="' . $signature->getSignedUrl() . '">Confirmer mon email</a></p>'));
    }
}
