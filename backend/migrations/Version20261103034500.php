<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20261103034500 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Ajout de 3 procedures stockees MySQL (places restantes, reservation, note moyenne)';
    }

    public function up(Schema $schema): void
    {
        // 1. Places restantes d'une seance : capacite - reservations non annulees
        $this->addSql(<<<'SQL'
CREATE PROCEDURE sp_places_restantes(IN p_seance_id INT)
BEGIN
    SELECT s.id AS seance_id,
           s.capacite,
           COUNT(r.id) AS reservations,
           s.capacite - COUNT(r.id) AS places_restantes
    FROM seance s
    LEFT JOIN reservation r ON r.seance_id = s.id AND r.statut <> 'annulee'
    WHERE s.id = p_seance_id
    GROUP BY s.id, s.capacite;
END
SQL);

        // 2. Reservation d'une seance avec controles, dans une transaction
        $this->addSql(<<<'SQL'
CREATE PROCEDURE sp_reserver_seance(IN p_utilisateur_id INT, IN p_seance_id INT)
BEGIN
    DECLARE v_capacite INT;
    DECLARE v_statut VARCHAR(30);
    DECLARE v_debut DATETIME;
    DECLARE v_actives INT;
    DECLARE v_deja INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    SELECT capacite, statut, TIMESTAMP(date_seance, heure_debut)
      INTO v_capacite, v_statut, v_debut
      FROM seance
     WHERE id = p_seance_id
       FOR UPDATE;

    IF v_capacite IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Seance introuvable.';
    END IF;
    IF v_statut = 'annulee' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cette seance est annulee.';
    END IF;
    IF v_debut < NOW() THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cette seance est deja passee.';
    END IF;

    SELECT COUNT(*) INTO v_deja
      FROM reservation
     WHERE seance_id = p_seance_id AND utilisateur_id = p_utilisateur_id AND statut <> 'annulee';
    IF v_deja > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Vous avez deja reserve cette seance.';
    END IF;

    SELECT COUNT(*) INTO v_actives
      FROM reservation
     WHERE seance_id = p_seance_id AND statut <> 'annulee';
    IF v_actives >= v_capacite THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cette seance est complete.';
    END IF;

    INSERT INTO reservation (statut, date_creation, date_modification, utilisateur_id, seance_id)
    VALUES ('confirmee', NOW(), NOW(), p_utilisateur_id, p_seance_id);

    COMMIT;

    SELECT LAST_INSERT_ID() AS reservation_id;
END
SQL);

        // 3. Note moyenne et nombre d'avis d'une salle ou d'un coach
        $this->addSql(<<<'SQL'
CREATE PROCEDURE sp_note_moyenne(IN p_type VARCHAR(10), IN p_id INT)
BEGIN
    IF p_type = 'salle' THEN
        SELECT ROUND(AVG(note), 2) AS moyenne, COUNT(*) AS nb_avis
          FROM avis WHERE salle_id = p_id;
    ELSEIF p_type = 'coach' THEN
        SELECT ROUND(AVG(note), 2) AS moyenne, COUNT(*) AS nb_avis
          FROM avis WHERE profil_coach_id = p_id;
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Type invalide : utiliser salle ou coach.';
    END IF;
END
SQL);
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP PROCEDURE IF EXISTS sp_places_restantes');
        $this->addSql('DROP PROCEDURE IF EXISTS sp_reserver_seance');
        $this->addSql('DROP PROCEDURE IF EXISTS sp_note_moyenne');
    }
}
