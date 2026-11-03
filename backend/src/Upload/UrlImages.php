<?php

namespace App\Upload;

use Symfony\Component\HttpFoundation\RequestStack;
use Vich\UploaderBundle\Storage\StorageInterface;

/** Transforme un nom de fichier stocké en URL publique absolue (les anciennes URLs complètes restent telles quelles). */
final class UrlImages
{
    public function __construct(
        private readonly StorageInterface $storage,
        private readonly RequestStack $requestStack,
    ) {
    }

    public function resoudre(object $objet, string $champFichier, ?string $valeur): ?string
    {
        if (!$valeur || preg_match('#^https?://#i', $valeur)) {
            return $valeur;
        }
        $uri = $this->storage->resolveUri($objet, $champFichier);
        if (!$uri) {
            return $valeur;
        }
        $requete = $this->requestStack->getCurrentRequest();

        return $requete ? $requete->getSchemeAndHttpHost() . $uri : $uri;
    }
}
