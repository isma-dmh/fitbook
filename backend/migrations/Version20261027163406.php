<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20261027163406 extends AbstractMigration
{
    public function getDescription(): string
    {
        return "Ajout des entites Activite Equipement et ProfilCoach a la db";
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE activite (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, date_creation DATETIME NOT NULL, date_modification DATETIME NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE equipement (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(255) NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE profil_coach (id INT AUTO_INCREMENT NOT NULL, presentation LONGTEXT NOT NULL, specialites VARCHAR(255) NOT NULL, tarif_horaire DOUBLE PRECISION NOT NULL, ville VARCHAR(255) NOT NULL, date_creation DATETIME NOT NULL, date_modification DATETIME NOT NULL, utilisateur_id INT NOT NULL, UNIQUE INDEX UNIQ_7155B688FB88E14F (utilisateur_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE profil_coach ADD CONSTRAINT FK_7155B688FB88E14F FOREIGN KEY (utilisateur_id) REFERENCES utilisateur (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE profil_coach DROP FOREIGN KEY FK_7155B688FB88E14F');
        $this->addSql('DROP TABLE activite');
        $this->addSql('DROP TABLE equipement');
        $this->addSql('DROP TABLE profil_coach');
    }
}
