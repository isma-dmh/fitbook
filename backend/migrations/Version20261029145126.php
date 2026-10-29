<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20261029145126 extends AbstractMigration
{
    public function getDescription(): string
    {
        return "Ajout manuel des roles sportif, coach, salle et administrateur a la table role";
    }

    public function up(Schema $schema): void
    {
        $this->addSql("INSERT INTO role (libelle) VALUES ('sportif'), ('coach'), ('salle'), ('administrateur')");
    }

    public function down(Schema $schema): void
    {
        $this->addSql("DELETE FROM role WHERE libelle IN ('sportif', 'coach', 'salle', 'administrateur')");
    }
}
