<?php

namespace App\Controller;

use App\Entity\Utilisateur;
use App\Repository\RoleRepository;
use App\Repository\UtilisateurRepository;
use Doctrine\DBAL\Exception\ForeignKeyConstraintViolationException;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

/** Gestion des comptes, réservée à l'administrateur. */
#[Route('/api/utilisateurs')]
#[IsGranted('ROLE_ADMINISTRATEUR')]
final class UtilisateurAdminController extends AbstractController
{
    #[Route('', name: 'api_utilisateurs_liste', methods: ['GET'])]
    public function liste(UtilisateurRepository $repo): JsonResponse
    {
        return new JsonResponse(array_map($this->vers(...), $repo->findBy([], ['id' => 'ASC'])));
    }

    #[Route('/{id<\d+>}', name: 'api_utilisateurs_detail', methods: ['GET'])]
    public function detail(Utilisateur $utilisateur): JsonResponse
    {
        return new JsonResponse($this->vers($utilisateur));
    }

    #[Route('/{id<\d+>}', name: 'api_utilisateurs_modifier', methods: ['PATCH'])]
    public function modifier(Utilisateur $utilisateur, Request $request, EntityManagerInterface $em, RoleRepository $roles): JsonResponse
    {
        $donnees = $request->toArray();
        if (array_key_exists('actif', $donnees)) {
            if (!is_bool($donnees['actif'])) {
                return new JsonResponse(['message' => 'Le champ actif doit être un booléen.'], 422);
            }
            if ($utilisateur === $this->getUser() && false === $donnees['actif']) {
                return new JsonResponse(['message' => 'Vous ne pouvez pas désactiver votre propre compte.'], 422);
            }
            $utilisateur->setActif($donnees['actif']);
        }
        foreach (['nom' => 'setNom', 'prenom' => 'setPrenom'] as $champ => $setter) {
            if (!array_key_exists($champ, $donnees)) {
                continue;
            }
            $valeur = is_string($donnees[$champ]) ? trim($donnees[$champ]) : '';
            if ('' === $valeur || mb_strlen($valeur) > 255) {
                return new JsonResponse(['message' => "Le champ $champ doit contenir entre 1 et 255 caractères."], 422);
            }
            $utilisateur->$setter($valeur);
        }
        if (array_key_exists('role', $donnees)) {
            $role = is_string($donnees['role']) ? $roles->findOneBy(['libelle' => $donnees['role']]) : null;
            if (!$role) {
                return new JsonResponse(['message' => 'Rôle inconnu (sportif, coach, salle ou administrateur).'], 422);
            }
            if ($utilisateur === $this->getUser() && $role !== $utilisateur->getRole()) {
                return new JsonResponse(['message' => 'Vous ne pouvez pas modifier votre propre rôle.'], 422);
            }
            $utilisateur->setRole($role);
        }
        $em->flush();

        return new JsonResponse($this->vers($utilisateur));
    }

    #[Route('/{id<\d+>}', name: 'api_utilisateurs_supprimer', methods: ['DELETE'])]
    public function supprimer(Utilisateur $utilisateur, EntityManagerInterface $em): Response
    {
        if ($utilisateur === $this->getUser()) {
            return new JsonResponse(['message' => 'Vous ne pouvez pas supprimer votre propre compte.'], 422);
        }
        try {
            $em->remove($utilisateur);
            $em->flush();
        } catch (ForeignKeyConstraintViolationException) {
            return new JsonResponse(['message' => "Ce compte est encore lié à d'autres données (salle, profil, réservations…)."], 409);
        }

        return new Response(null, 204);
    }

    private function vers(Utilisateur $u): array
    {
        return [
            '@id' => '/api/utilisateurs/' . $u->getId(),
            'id' => $u->getId(),
            'email' => $u->getEmail(),
            'nom' => $u->getNom(),
            'prenom' => $u->getPrenom(),
            'roleLibelle' => $u->getRole()?->getLibelle(),
            'actif' => $u->isActif(),
            'emailVerifie' => $u->isEmailVerifie(),
        ];
    }
}
