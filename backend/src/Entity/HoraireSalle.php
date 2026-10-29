<?php

namespace App\Entity;

use App\Repository\HoraireSalleRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: HoraireSalleRepository::class)]
class HoraireSalle
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $jourSemaine = null;

    #[ORM\Column(type: Types::TIME_IMMUTABLE)]
    private ?\DateTimeImmutable $heureOuverture = null;

    #[ORM\Column(type: Types::TIME_IMMUTABLE)]
    private ?\DateTimeImmutable $heureFermeture = null;

    #[ORM\ManyToOne(inversedBy: 'horaireSalles')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Salle $salle = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getJourSemaine(): ?int
    {
        return $this->jourSemaine;
    }

    public function setJourSemaine(int $jourSemaine): static
    {
        $this->jourSemaine = $jourSemaine;

        return $this;
    }

    public function getHeureOuverture(): ?\DateTimeImmutable
    {
        return $this->heureOuverture;
    }

    public function setHeureOuverture(\DateTimeImmutable $heureOuverture): static
    {
        $this->heureOuverture = $heureOuverture;

        return $this;
    }

    public function getHeureFermeture(): ?\DateTimeImmutable
    {
        return $this->heureFermeture;
    }

    public function setHeureFermeture(\DateTimeImmutable $heureFermeture): static
    {
        $this->heureFermeture = $heureFermeture;

        return $this;
    }

    public function getSalle(): ?Salle
    {
        return $this->salle;
    }

    public function setSalle(?Salle $salle): static
    {
        $this->salle = $salle;

        return $this;
    }
}
