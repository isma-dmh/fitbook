<?php

namespace App\State;

use ApiPlatform\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use App\Entity\Avis;
use App\Entity\Seance;
use Doctrine\ORM\QueryBuilder;

/**
 * Charge en une seule requête les relations affichées dans les listes publiques
 * (avis et séances), pour éviter une requête SQL par ligne.
 */
final class PrechargementExtension implements QueryCollectionExtensionInterface
{
    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, ?Operation $operation = null, array $context = []): void
    {
        $r = $queryBuilder->getRootAliases()[0];
        if (Avis::class === $resourceClass) {
            $queryBuilder
                ->leftJoin("$r.utilisateur", 'pre_u')->addSelect('pre_u')
                ->leftJoin("$r.salle", 'pre_s')->addSelect('pre_s')
                ->leftJoin('pre_s.gestionnaire', 'pre_g')->addSelect('pre_g')
                ->leftJoin("$r.profilCoach", 'pre_c')->addSelect('pre_c')
                ->leftJoin('pre_c.utilisateur', 'pre_cu')->addSelect('pre_cu');
        } elseif (Seance::class === $resourceClass) {
            $queryBuilder
                ->leftJoin("$r.reservations", 'pre_r')->addSelect('pre_r')
                ->leftJoin("$r.activite", 'pre_a')->addSelect('pre_a')
                ->leftJoin("$r.salle", 'pre_s')->addSelect('pre_s')
                ->leftJoin("$r.profilCoach", 'pre_c')->addSelect('pre_c');
        }
    }
}
