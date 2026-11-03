<?php

namespace App\Upload;

use Symfony\Component\HttpFoundation\File\UploadedFile;

/** Contrôle d'un fichier image envoyé par un client. */
final class VerificationImage
{
    private const TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    /** Renvoie un message d'erreur, ou null si le fichier est acceptable. */
    public static function erreur(mixed $fichier, int $maxOctets): ?string
    {
        if (!$fichier instanceof UploadedFile) {
            return 'Le fichier est obligatoire (champ "fichier").';
        }
        if (!$fichier->isValid()) {
            return "Le fichier n'a pas pu être envoyé (trop volumineux ?).";
        }
        if ($fichier->getSize() > $maxOctets) {
            return sprintf('Le fichier dépasse %d Mo.', intdiv($maxOctets, 1024 * 1024));
        }
        if (!in_array($fichier->getMimeType(), self::TYPES, true)) {
            return 'Format accepté : JPEG, PNG, WebP ou GIF.';
        }

        return null;
    }
}
