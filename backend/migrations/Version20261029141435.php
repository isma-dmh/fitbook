<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20261029141435 extends AbstractMigration
{
    public function getDescription(): string
    {
        return "Ajout de reservation et avis en db";
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE avis (id INT AUTO_INCREMENT NOT NULL, note INT NOT NULL, commentaire LONGTEXT DEFAULT NULL, date_creation DATETIME NOT NULL, date_modification DATETIME NOT NULL, utilisateur_id INT NOT NULL, salle_id INT DEFAULT NULL, profil_coach_id INT DEFAULT NULL, INDEX IDX_8F91ABF0FB88E14F (utilisateur_id), INDEX IDX_8F91ABF0DC304035 (salle_id), INDEX IDX_8F91ABF020F9233C (profil_coach_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE reservation (id INT AUTO_INCREMENT NOT NULL, statut VARCHAR(30) NOT NULL, date_creation DATETIME NOT NULL, date_modification DATETIME NOT NULL, utilisateur_id INT NOT NULL, seance_id INT NOT NULL, INDEX IDX_42C84955FB88E14F (utilisateur_id), INDEX IDX_42C84955E3797A94 (seance_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE utilisateur_salle (utilisateur_id INT NOT NULL, salle_id INT NOT NULL, INDEX IDX_88522682FB88E14F (utilisateur_id), INDEX IDX_88522682DC304035 (salle_id), PRIMARY KEY (utilisateur_id, salle_id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE utilisateur_profil_coach (utilisateur_id INT NOT NULL, profil_coach_id INT NOT NULL, INDEX IDX_18A7927BFB88E14F (utilisateur_id), INDEX IDX_18A7927B20F9233C (profil_coach_id), PRIMARY KEY (utilisateur_id, profil_coach_id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE utilisateur_seance (utilisateur_id INT NOT NULL, seance_id INT NOT NULL, INDEX IDX_BED0C785FB88E14F (utilisateur_id), INDEX IDX_BED0C785E3797A94 (seance_id), PRIMARY KEY (utilisateur_id, seance_id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE avis ADD CONSTRAINT FK_8F91ABF0FB88E14F FOREIGN KEY (utilisateur_id) REFERENCES utilisateur (id)');
        $this->addSql('ALTER TABLE avis ADD CONSTRAINT FK_8F91ABF0DC304035 FOREIGN KEY (salle_id) REFERENCES salle (id)');
        $this->addSql('ALTER TABLE avis ADD CONSTRAINT FK_8F91ABF020F9233C FOREIGN KEY (profil_coach_id) REFERENCES profil_coach (id)');
        $this->addSql('ALTER TABLE reservation ADD CONSTRAINT FK_42C84955FB88E14F FOREIGN KEY (utilisateur_id) REFERENCES utilisateur (id)');
        $this->addSql('ALTER TABLE reservation ADD CONSTRAINT FK_42C84955E3797A94 FOREIGN KEY (seance_id) REFERENCES seance (id)');
        $this->addSql('ALTER TABLE utilisateur_salle ADD CONSTRAINT FK_88522682FB88E14F FOREIGN KEY (utilisateur_id) REFERENCES utilisateur (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE utilisateur_salle ADD CONSTRAINT FK_88522682DC304035 FOREIGN KEY (salle_id) REFERENCES salle (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE utilisateur_profil_coach ADD CONSTRAINT FK_18A7927BFB88E14F FOREIGN KEY (utilisateur_id) REFERENCES utilisateur (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE utilisateur_profil_coach ADD CONSTRAINT FK_18A7927B20F9233C FOREIGN KEY (profil_coach_id) REFERENCES profil_coach (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE utilisateur_seance ADD CONSTRAINT FK_BED0C785FB88E14F FOREIGN KEY (utilisateur_id) REFERENCES utilisateur (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE utilisateur_seance ADD CONSTRAINT FK_BED0C785E3797A94 FOREIGN KEY (seance_id) REFERENCES seance (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE avis DROP FOREIGN KEY FK_8F91ABF0FB88E14F');
        $this->addSql('ALTER TABLE avis DROP FOREIGN KEY FK_8F91ABF0DC304035');
        $this->addSql('ALTER TABLE avis DROP FOREIGN KEY FK_8F91ABF020F9233C');
        $this->addSql('ALTER TABLE reservation DROP FOREIGN KEY FK_42C84955FB88E14F');
        $this->addSql('ALTER TABLE reservation DROP FOREIGN KEY FK_42C84955E3797A94');
        $this->addSql('ALTER TABLE utilisateur_salle DROP FOREIGN KEY FK_88522682FB88E14F');
        $this->addSql('ALTER TABLE utilisateur_salle DROP FOREIGN KEY FK_88522682DC304035');
        $this->addSql('ALTER TABLE utilisateur_profil_coach DROP FOREIGN KEY FK_18A7927BFB88E14F');
        $this->addSql('ALTER TABLE utilisateur_profil_coach DROP FOREIGN KEY FK_18A7927B20F9233C');
        $this->addSql('ALTER TABLE utilisateur_seance DROP FOREIGN KEY FK_BED0C785FB88E14F');
        $this->addSql('ALTER TABLE utilisateur_seance DROP FOREIGN KEY FK_BED0C785E3797A94');
        $this->addSql('DROP TABLE avis');
        $this->addSql('DROP TABLE reservation');
        $this->addSql('DROP TABLE utilisateur_salle');
        $this->addSql('DROP TABLE utilisateur_profil_coach');
        $this->addSql('DROP TABLE utilisateur_seance');
    }
}
