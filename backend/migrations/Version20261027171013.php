<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20261027171013 extends AbstractMigration
{
    public function getDescription(): string
    {
        return "Ajout des entites Salle,PhotoSalle,HoraireSalle et HoraireCoach a la db";
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE horaire_coach (id INT AUTO_INCREMENT NOT NULL, jour_semaine INT NOT NULL, heure_debut TIME NOT NULL, heure_fin TIME NOT NULL, profil_coach_id INT NOT NULL, INDEX IDX_5AB1DA1720F9233C (profil_coach_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE horaire_salle (id INT AUTO_INCREMENT NOT NULL, jour_semaine INT NOT NULL, heure_ouverture TIME NOT NULL, heure_fermeture TIME NOT NULL, salle_id INT NOT NULL, INDEX IDX_2B7FC987DC304035 (salle_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE photo_salle (id INT AUTO_INCREMENT NOT NULL, url VARCHAR(255) NOT NULL, date_creation DATETIME NOT NULL, salle_id INT NOT NULL, INDEX IDX_F4C679EBDC304035 (salle_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE profil_coach_salle (profil_coach_id INT NOT NULL, salle_id INT NOT NULL, INDEX IDX_2B043620F9233C (profil_coach_id), INDEX IDX_2B0436DC304035 (salle_id), PRIMARY KEY (profil_coach_id, salle_id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE salle (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(255) NOT NULL, adresse VARCHAR(255) NOT NULL, ville VARCHAR(255) NOT NULL, description LONGTEXT NOT NULL, capacite_max INT NOT NULL, date_creation DATETIME NOT NULL, date_modification DATETIME NOT NULL, gestionnaire_id INT NOT NULL, INDEX IDX_4E977E5C6885AC1B (gestionnaire_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE salle_equipement (salle_id INT NOT NULL, equipement_id INT NOT NULL, INDEX IDX_D338336BDC304035 (salle_id), INDEX IDX_D338336B806F0F5C (equipement_id), PRIMARY KEY (salle_id, equipement_id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE salle_activite (salle_id INT NOT NULL, activite_id INT NOT NULL, INDEX IDX_A434021BDC304035 (salle_id), INDEX IDX_A434021B9B0F88B1 (activite_id), PRIMARY KEY (salle_id, activite_id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE horaire_coach ADD CONSTRAINT FK_5AB1DA1720F9233C FOREIGN KEY (profil_coach_id) REFERENCES profil_coach (id)');
        $this->addSql('ALTER TABLE horaire_salle ADD CONSTRAINT FK_2B7FC987DC304035 FOREIGN KEY (salle_id) REFERENCES salle (id)');
        $this->addSql('ALTER TABLE photo_salle ADD CONSTRAINT FK_F4C679EBDC304035 FOREIGN KEY (salle_id) REFERENCES salle (id)');
        $this->addSql('ALTER TABLE profil_coach_salle ADD CONSTRAINT FK_2B043620F9233C FOREIGN KEY (profil_coach_id) REFERENCES profil_coach (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE profil_coach_salle ADD CONSTRAINT FK_2B0436DC304035 FOREIGN KEY (salle_id) REFERENCES salle (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE salle ADD CONSTRAINT FK_4E977E5C6885AC1B FOREIGN KEY (gestionnaire_id) REFERENCES utilisateur (id)');
        $this->addSql('ALTER TABLE salle_equipement ADD CONSTRAINT FK_D338336BDC304035 FOREIGN KEY (salle_id) REFERENCES salle (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE salle_equipement ADD CONSTRAINT FK_D338336B806F0F5C FOREIGN KEY (equipement_id) REFERENCES equipement (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE salle_activite ADD CONSTRAINT FK_A434021BDC304035 FOREIGN KEY (salle_id) REFERENCES salle (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE salle_activite ADD CONSTRAINT FK_A434021B9B0F88B1 FOREIGN KEY (activite_id) REFERENCES activite (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE horaire_coach DROP FOREIGN KEY FK_5AB1DA1720F9233C');
        $this->addSql('ALTER TABLE horaire_salle DROP FOREIGN KEY FK_2B7FC987DC304035');
        $this->addSql('ALTER TABLE photo_salle DROP FOREIGN KEY FK_F4C679EBDC304035');
        $this->addSql('ALTER TABLE profil_coach_salle DROP FOREIGN KEY FK_2B043620F9233C');
        $this->addSql('ALTER TABLE profil_coach_salle DROP FOREIGN KEY FK_2B0436DC304035');
        $this->addSql('ALTER TABLE salle DROP FOREIGN KEY FK_4E977E5C6885AC1B');
        $this->addSql('ALTER TABLE salle_equipement DROP FOREIGN KEY FK_D338336BDC304035');
        $this->addSql('ALTER TABLE salle_equipement DROP FOREIGN KEY FK_D338336B806F0F5C');
        $this->addSql('ALTER TABLE salle_activite DROP FOREIGN KEY FK_A434021BDC304035');
        $this->addSql('ALTER TABLE salle_activite DROP FOREIGN KEY FK_A434021B9B0F88B1');
        $this->addSql('DROP TABLE horaire_coach');
        $this->addSql('DROP TABLE horaire_salle');
        $this->addSql('DROP TABLE photo_salle');
        $this->addSql('DROP TABLE profil_coach_salle');
        $this->addSql('DROP TABLE salle');
        $this->addSql('DROP TABLE salle_equipement');
        $this->addSql('DROP TABLE salle_activite');
    }
}
