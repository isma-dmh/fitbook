<?php

namespace App\Controller;

use App\Entity\ProfilCoach;
use App\Entity\Salle;
use App\Entity\Seance;
use App\Entity\Utilisateur;
use App\Upload\UrlImages;
use App\Upload\VerificationImage;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

final class MeController extends AbstractController
{
    /** Favoris : champ JSON => [classe, préfixe d'IRI, getter, adder, remover]. */
    private const FAVORIS = [
        'favorisSalles' => [Salle::class, '/api/salles/', 'getFavorisSalles', 'addFavorisSalle', 'removeFavorisSalle'],
        'favorisCoachs' => [ProfilCoach::class, '/api/profil_coaches/', 'getFavorisCoachs', 'addFavorisCoach', 'removeFavorisCoach'],
        'favorisSeances' => [Seance::class, '/api/seances/', 'getFavorisSeances', 'addFavorisSeance', 'removeFavorisSeance'],
    ];

    /** Profil de l'utilisateur connecté (GET) et modification de son compte et de ses favoris (PATCH). */
    #[Route('/api/me', name: 'api_me', methods: ['GET', 'PATCH'])]
    public function me(Request $request, EntityManagerInterface $em, UrlImages $urls): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof Utilisateur) {
            return new JsonResponse(['message' => 'Authentification requise.'], 401);
        }

        if ($request->isMethod('PATCH')) {
            $donnees = $request->toArray();

            foreach (['nom', 'prenom'] as $champ) {
                if (array_key_exists($champ, $donnees)) {
                    $valeur = is_string($donnees[$champ]) ? trim($donnees[$champ]) : '';
                    if ('' === $valeur) {
                        return new JsonResponse(['message' => "Le champ $champ est obligatoire."], 422);
                    }
                    $champ === 'nom' ? $user->setNom($valeur) : $user->setPrenom($valeur);
                }
            }
            foreach (['image' => 'setImage', 'objectifs' => 'setObjectifs', 'niveau' => 'setNiveau'] as $champ => $setter) {
                if (array_key_exists($champ, $donnees)) {
                    $valeur = $donnees[$champ];
                    $user->$setter(is_string($valeur) && '' !== trim($valeur) ? trim($valeur) : null);
                }
            }

            foreach (self::FAVORIS as $champ => [$classe, $prefixe, $getter, $adder, $remover]) {
                if (!array_key_exists($champ, $donnees)) {
                    continue;
                }
                if (!is_array($donnees[$champ])) {
                    return new JsonResponse(['message' => "Le champ $champ doit être une liste."], 422);
                }
                $voulus = [];
                foreach ($donnees[$champ] as $iri) {
                    if (!is_string($iri) || !preg_match('#^' . preg_quote($prefixe, '#') . '(\d+)$#', $iri, $m)) {
                        return new JsonResponse(['message' => "IRI invalide dans $champ."], 422);
                    }
                    $objet = $em->getRepository($classe)->find((int) $m[1]);
                    if (!$objet) {
                        return new JsonResponse(['message' => "Élément introuvable dans $champ."], 422);
                    }
                    $voulus[spl_object_id($objet)] = $objet;
                }
                foreach ($user->$getter()->toArray() as $existant) {
                    if (!isset($voulus[spl_object_id($existant)])) {
                        $user->$remover($existant);
                    }
                }
                foreach ($voulus as $objet) {
                    $user->$adder($objet);
                }
            }
            $em->flush();
        }

        return new JsonResponse($this->vers($user, $urls));
    }

    /** Envoie la photo de profil (multipart/form-data, champ "fichier"). */
    #[Route('/api/me/image', name: 'api_me_image', methods: ['POST'])]
    public function image(Request $request, EntityManagerInterface $em, UrlImages $urls): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof Utilisateur) {
            return new JsonResponse(['message' => 'Authentification requise.'], 401);
        }
        $fichier = $request->files->get('fichier');
        if ($erreur = VerificationImage::erreur($fichier, 2 * 1024 * 1024)) {
            return new JsonResponse(['message' => $erreur], 422);
        }
        $user->setImageFile($fichier);
        $user->setDateModification(new \DateTimeImmutable());
        $em->flush();

        return new JsonResponse($this->vers($user, $urls));
    }

    private function vers(Utilisateur $u, UrlImages $urls): array
    {
        $iris = static fn ($liste, string $prefixe): array => array_values(array_map(
            static fn ($o) => $prefixe . $o->getId(),
            $liste->toArray(),
        ));

        return [
            'id' => $u->getId(),
            'email' => $u->getEmail(),
            'nom' => $u->getNom(),
            'prenom' => $u->getPrenom(),
            'image' => $urls->resoudre($u, 'imageFile', $u->getImage()),
            'objectifs' => $u->getObjectifs(),
            'niveau' => $u->getNiveau(),
            'emailVerifie' => $u->isEmailVerifie(),
            'actif' => $u->isActif(),
            'roleLibelle' => $u->getRole()?->getLibelle(),
            'favorisSalles' => $iris($u->getFavorisSalles(), '/api/salles/'),
            'favorisCoachs' => $iris($u->getFavorisCoachs(), '/api/profil_coaches/'),
            'favorisSeances' => $iris($u->getFavorisSeances(), '/api/seances/'),
        ];
    }
}
