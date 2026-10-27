<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20261027155341 extends AbstractMigration
{
    public function getDescription(): string
    {
        return "Ajout des entites Role et Utilisateurs a la db";
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE role (id INT AUTO_INCREMENT NOT NULL, libelle VARCHAR(255) NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE utilisateur (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, mot_de_passe VARCHAR(255) NOT NULL, nom VARCHAR(255) NOT NULL, prenom VARCHAR(255) NOT NULL, image VARCHAR(255) DEFAULT NULL, objectifs LONGTEXT DEFAULT NULL, niveau VARCHAR(50) DEFAULT NULL, email_verifie TINYINT NOT NULL, actif TINYINT NOT NULL, date_creation DATETIME NOT NULL, date_modification DATETIME NOT NULL, role_id INT NOT NULL, UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL (email), INDEX IDX_1D1C63B3D60322AC (role_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE utilisateur ADD CONSTRAINT FK_1D1C63B3D60322AC FOREIGN KEY (role_id) REFERENCES role (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE utilisateur DROP FOREIGN KEY FK_1D1C63B3D60322AC');
        $this->addSql('DROP TABLE role');
        $this->addSql('DROP TABLE utilisateur');
    }
}
