<?php

namespace App\Serializer;

use App\Entity\PhotoSalle;
use App\Entity\Utilisateur;
use App\Upload\UrlImages;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

/** Remplace le nom de fichier stocké par l'URL publique de l'image dans les réponses de l'API. */
final class ImageUrlNormalizer implements NormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;

    private const DEJA = 'image_url_normalizer_deja';

    public function __construct(private readonly UrlImages $urls)
    {
    }

    public function normalize(mixed $data, ?string $format = null, array $context = []): array|string|int|float|bool|\ArrayObject|null
    {
        $context[self::DEJA][spl_object_id($data)] = true;
        $resultat = $this->normalizer->normalize($data, $format, $context);

        if (is_array($resultat)) {
            if ($data instanceof PhotoSalle && array_key_exists('url', $resultat)) {
                $resultat['url'] = $this->urls->resoudre($data, 'fichier', $data->getUrl());
            } elseif ($data instanceof Utilisateur && array_key_exists('image', $resultat)) {
                $resultat['image'] = $this->urls->resoudre($data, 'imageFile', $data->getImage());
            }
        }

        return $resultat;
    }

    public function supportsNormalization(mixed $data, ?string $format = null, array $context = []): bool
    {
        return ($data instanceof PhotoSalle || $data instanceof Utilisateur)
            && !isset($context[self::DEJA][spl_object_id($data)]);
    }

    public function getSupportedTypes(?string $format): array
    {
        return [PhotoSalle::class => false, Utilisateur::class => false];
    }
}
