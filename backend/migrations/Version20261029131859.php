<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20261029131859 extends AbstractMigration
{
    public function getDescription(): string
    {
        return "Ajout de seance et de disponibilite a la db";
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE disponibilite (id INT AUTO_INCREMENT NOT NULL, date_dispo DATE NOT NULL, heure_debut TIME NOT NULL, heure_fin TIME NOT NULL, type VARCHAR(20) NOT NULL, date_creation DATETIME NOT NULL, date_modification DATETIME NOT NULL, profil_coach_id INT DEFAULT NULL, salle_id INT DEFAULT NULL, INDEX IDX_2CBACE2F20F9233C (profil_coach_id), INDEX IDX_2CBACE2FDC304035 (salle_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE seance (id INT AUTO_INCREMENT NOT NULL, date_seance DATE NOT NULL, heure_debut TIME NOT NULL, duree_minutes INT NOT NULL, capacite INT NOT NULL, prix DOUBLE PRECISION NOT NULL, statut VARCHAR(30) NOT NULL, date_creation DATETIME NOT NULL, date_modification DATETIME NOT NULL, activite_id INT NOT NULL, profil_coach_id INT DEFAULT NULL, salle_id INT DEFAULT NULL, INDEX IDX_DF7DFD0E9B0F88B1 (activite_id), INDEX IDX_DF7DFD0E20F9233C (profil_coach_id), INDEX IDX_DF7DFD0EDC304035 (salle_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE disponibilite ADD CONSTRAINT FK_2CBACE2F20F9233C FOREIGN KEY (profil_coach_id) REFERENCES profil_coach (id)');
        $this->addSql('ALTER TABLE disponibilite ADD CONSTRAINT FK_2CBACE2FDC304035 FOREIGN KEY (salle_id) REFERENCES salle (id)');
        $this->addSql('ALTER TABLE seance ADD CONSTRAINT FK_DF7DFD0E9B0F88B1 FOREIGN KEY (activite_id) REFERENCES activite (id)');
        $this->addSql('ALTER TABLE seance ADD CONSTRAINT FK_DF7DFD0E20F9233C FOREIGN KEY (profil_coach_id) REFERENCES profil_coach (id)');
        $this->addSql('ALTER TABLE seance ADD CONSTRAINT FK_DF7DFD0EDC304035 FOREIGN KEY (salle_id) REFERENCES salle (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE disponibilite DROP FOREIGN KEY FK_2CBACE2F20F9233C');
        $this->addSql('ALTER TABLE disponibilite DROP FOREIGN KEY FK_2CBACE2FDC304035');
        $this->addSql('ALTER TABLE seance DROP FOREIGN KEY FK_DF7DFD0E9B0F88B1');
        $this->addSql('ALTER TABLE seance DROP FOREIGN KEY FK_DF7DFD0E20F9233C');
        $this->addSql('ALTER TABLE seance DROP FOREIGN KEY FK_DF7DFD0EDC304035');
        $this->addSql('DROP TABLE disponibilite');
        $this->addSql('DROP TABLE seance');
    }
}
