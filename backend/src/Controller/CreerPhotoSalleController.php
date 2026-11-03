<?php

namespace App\Controller;

use App\Entity\PhotoSalle;
use App\Entity\Salle;
use App\Upload\UrlImages;
use App\Upload\VerificationImage;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

final class CreerPhotoSalleController extends AbstractController
{
    /** POST /api/photo_salles (multipart/form-data) : champs "fichier" (image) et "salle" (IRI). */
    #[Route('/api/photo_salles', name: 'api_photo_salles_creer', methods: ['POST'])]
    public function __invoke(Request $request, EntityManagerInterface $em, UrlImages $urls): JsonResponse
    {
        if (!$this->isGranted('ROLE_SALLE') && !$this->isGranted('ROLE_ADMINISTRATEUR')) {
            return new JsonResponse(['message' => 'Accès refusé.'], 403);
        }
        $fichier = $request->files->get('fichier');
        if ($erreur = VerificationImage::erreur($fichier, 5 * 1024 * 1024)) {
            return new JsonResponse(['message' => $erreur], 422);
        }
        if (!preg_match('#^/api/salles/(\d+)$#', (string) $request->request->get('salle'), $m)) {
            return new JsonResponse(['message' => 'La salle est obligatoire (IRI /api/salles/{id}).'], 422);
        }
        $salle = $em->getRepository(Salle::class)->find((int) $m[1]);
        if (!$salle) {
            return new JsonResponse(['message' => 'Salle introuvable.'], 422);
        }
        if (!$this->isGranted('ROLE_ADMINISTRATEUR') && $salle->getGestionnaire() !== $this->getUser()) {
            return new JsonResponse(['message' => 'Cette salle ne vous appartient pas.'], 403);
        }

        $photo = (new PhotoSalle())->setSalle($salle);
        $photo->setFichier($fichier);
        $em->persist($photo);
        $em->flush();

        return new JsonResponse([
            '@id' => '/api/photo_salles/' . $photo->getId(),
            'id' => $photo->getId(),
            'url' => $urls->resoudre($photo, 'fichier', $photo->getUrl()),
            'salle' => '/api/salles/' . $salle->getId(),
        ], 201);
    }
}
