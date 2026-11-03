<?php

namespace App\Service;

use App\Entity\Reservation;
use Psr\Log\LoggerInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

/**
 * Envoie les e-mails liés à une réservation :
 * - confirmation au sportif ;
 * - information au coach de la séance (s'il y en a un).
 * Un échec d'envoi n'empêche jamais la réservation.
 */
final class NotificationReservation
{
    private const EXPEDITEUR = 'no-reply@fitbook.local';

    public function __construct(
        private readonly MailerInterface $mailer,
        private readonly LoggerInterface $logger,
    ) {
    }

    public function reservationCreee(Reservation $reservation): void
    {
        $seance = $reservation->getSeance();
        $sportif = $reservation->getUtilisateur();
        if (!$seance || !$sportif) {
            return;
        }

        $activite = htmlspecialchars((string) $seance->getActivite()?->getNom());
        $salle = $seance->getSalle();
        $lieu = $salle ? htmlspecialchars($salle->getNom() . ', ' . $salle->getVille()) : 'à définir';
        $quand = $seance->getDateSeance()->format('d/m/Y') . ' à ' . $seance->getHeureDebut()->format('H:i');

        $this->envoyer(
            $sportif->getEmail(),
            'Réservation confirmée',
            '<p>Bonjour ' . htmlspecialchars((string) $sportif->getPrenom()) . ',</p>'
            . "<p>Votre réservation est confirmée : <strong>$activite</strong>, le $quand ($lieu).</p>",
        );

        $coach = $seance->getProfilCoach()?->getUtilisateur();
        if ($coach && $coach->getEmail()) {
            $this->envoyer(
                $coach->getEmail(),
                'Nouvelle réservation',
                '<p>' . htmlspecialchars($sportif->getPrenom() . ' ' . $sportif->getNom())
                . " a réservé votre séance <strong>$activite</strong> du $quand.</p>",
            );
        }
    }

    private function envoyer(?string $destinataire, string $sujet, string $html): void
    {
        if (!$destinataire) {
            return;
        }
        try {
            $this->mailer->send((new Email())
                ->from(self::EXPEDITEUR)->to($destinataire)
                ->subject($sujet)->html($html));
        } catch (\Throwable $e) {
            $this->logger->warning('Envoi d\'e-mail impossible : ' . $e->getMessage());
        }
    }
}
