<?php

namespace App\State;

use ApiPlatform\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use App\Entity\Reservation;
use App\Entity\Utilisateur;
use Doctrine\ORM\QueryBuilder;
use Symfony\Bundle\SecurityBundle\Security;

/**
 * Limite les réservations visibles : l'admin voit tout ; les autres voient les leurs,
 * celles de leurs séances (coach) ou celles des séances de leur salle (gestionnaire).
 */
final class ReservationExtension implements QueryCollectionExtensionInterface, QueryItemExtensionInterface
{
    public function __construct(private readonly Security $security)
    {
    }

    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, ?Operation $operation = null, array $context = []): void
    {
        $this->restreindre($queryBuilder, $resourceClass);
    }

    public function applyToItem(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, array $identifiers, ?Operation $operation = null, array $context = []): void
    {
        $this->restreindre($queryBuilder, $resourceClass);
    }

    private function restreindre(QueryBuilder $qb, string $resourceClass): void
    {
        if (Reservation::class !== $resourceClass || $this->security->isGranted('ROLE_ADMINISTRATEUR')) {
            return;
        }
        $user = $this->security->getUser();
        $racine = $qb->getRootAliases()[0];
        if (!$user instanceof Utilisateur) {
            $qb->andWhere('1 = 0');

            return;
        }
        $qb->innerJoin("$racine.seance", 'res_seance')
            ->leftJoin('res_seance.profilCoach', 'res_coach')
            ->leftJoin('res_seance.salle', 'res_salle')
            ->andWhere("$racine.utilisateur = :res_moi OR res_coach.utilisateur = :res_moi OR res_salle.gestionnaire = :res_moi")
            ->setParameter('res_moi', $user);
    }
}
