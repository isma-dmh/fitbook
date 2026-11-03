<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Avis;
use App\Entity\ProfilCoach;
use App\Entity\Reservation;
use App\Entity\Salle;
use App\Entity\Seance;
use App\Entity\Utilisateur;
use App\Service\NotificationReservation;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/**
 * Traitement commun avant enregistrement :
 * - rattache l'objet créé à l'utilisateur connecté (profil coach, réservation, avis via "utilisateur", salle via "gestionnaire") ;
 * - applique les règles métier des réservations, des avis et des séances.
 */
final class UtilisateurConnecteProcessor implements ProcessorInterface
{
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private readonly ProcessorInterface $persistProcessor,
        private readonly TokenStorageInterface $tokenStorage,
        private readonly NotificationReservation $notifications,
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        $user = $this->tokenStorage->getToken()?->getUser();
        if (!$user instanceof Utilisateur) {
            throw new AccessDeniedHttpException('Authentification requise.');
        }

        if ($data instanceof Salle) {
            $data->setGestionnaire($user);
        } elseif ($data instanceof ProfilCoach) {
            $data->setUtilisateur($user);
        } elseif ($data instanceof Reservation) {
            $this->verifierReservation($data, $user);
            $data->setUtilisateur($user);
            $data->setStatut('confirmee');
        } elseif ($data instanceof Avis) {
            $this->verifierAvis($data, $user);
            $data->setUtilisateur($user);
        } elseif ($data instanceof Seance) {
            $this->verifierSeance($data);
        }

        $resultat = $this->persistProcessor->process($data, $operation, $uriVariables, $context);

        if ($data instanceof Reservation) {
            $this->notifications->reservationCreee($data);
        }

        return $resultat;
    }

    private function verifierReservation(Reservation $reservation, Utilisateur $user): void
    {
        $seance = $reservation->getSeance();
        if (!$seance) {
            throw new UnprocessableEntityHttpException('La séance est obligatoire.');
        }
        if ('annulee' === $seance->getStatut()) {
            throw new ConflictHttpException('Cette séance est annulée.');
        }
        if ($this->debut($seance) < new \DateTimeImmutable()) {
            throw new ConflictHttpException('Cette séance est déjà passée.');
        }
        $actives = $this->reservationsActives($seance);
        foreach ($actives as $r) {
            if ($r->getUtilisateur() === $user) {
                throw new ConflictHttpException('Vous avez déjà réservé cette séance.');
            }
        }
        if (count($actives) >= (int) $seance->getCapacite()) {
            throw new ConflictHttpException('Cette séance est complète.');
        }
    }

    private function verifierAvis(Avis $avis, Utilisateur $user): void
    {
        $note = $avis->getNote();
        if (null === $note || $note < 1 || $note > 5) {
            throw new UnprocessableEntityHttpException('La note doit être comprise entre 1 et 5.');
        }
        $salle = $avis->getSalle();
        $coach = $avis->getProfilCoach();
        if (($salle && $coach) || (!$salle && !$coach)) {
            throw new UnprocessableEntityHttpException('Un avis concerne soit une salle, soit un coach.');
        }
        foreach ($user->getAvis() as $existant) {
            if (($salle && $existant->getSalle() === $salle) || ($coach && $existant->getProfilCoach() === $coach)) {
                throw new ConflictHttpException('Vous avez déjà donné un avis.');
            }
        }
        $maintenant = new \DateTimeImmutable();
        foreach ($user->getReservations() as $r) {
            $seance = $r->getSeance();
            if ('annulee' === $r->getStatut() || !$seance || $this->debut($seance) >= $maintenant) {
                continue;
            }
            if (($salle && $seance->getSalle() === $salle) || ($coach && $seance->getProfilCoach() === $coach)) {
                return;
            }
        }
        throw new UnprocessableEntityHttpException('Vous ne pouvez donner un avis qu\'après avoir suivi une séance.');
    }

    private function verifierSeance(Seance $seance): void
    {
        $capacite = $seance->getCapacite();
        if (null === $capacite || $capacite < 1) {
            throw new UnprocessableEntityHttpException('La capacité doit être d\'au moins 1.');
        }
        $max = $seance->getSalle()?->getCapaciteMax();
        if (null !== $max && $capacite > $max) {
            throw new UnprocessableEntityHttpException("La capacité ($capacite) dépasse celle de la salle ($max).");
        }
        if (null !== $seance->getId() && $capacite < count($this->reservationsActives($seance))) {
            throw new UnprocessableEntityHttpException('La capacité est inférieure au nombre de réservations existantes.');
        }
    }

    /** @return Reservation[] */
    private function reservationsActives(Seance $seance): array
    {
        return array_values(array_filter(
            $seance->getReservations()->toArray(),
            static fn (Reservation $r) => 'annulee' !== $r->getStatut(),
        ));
    }

    private function debut(Seance $seance): \DateTimeImmutable
    {
        return new \DateTimeImmutable($seance->getDateSeance()->format('Y-m-d') . ' ' . $seance->getHeureDebut()->format('H:i:s'));
    }
}
