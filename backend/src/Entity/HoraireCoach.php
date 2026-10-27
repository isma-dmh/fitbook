<?php

namespace App\Entity;

use App\Repository\HoraireCoachRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: HoraireCoachRepository::class)]
class HoraireCoach
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $jourSemaine = null;

    #[ORM\Column(type: Types::TIME_IMMUTABLE)]
    private ?\DateTimeImmutable $heureDebut = null;

    #[ORM\Column(type: Types::TIME_IMMUTABLE)]
    private ?\DateTimeImmutable $heureFin = null;

    #[ORM\ManyToOne(inversedBy: 'horaireCoaches')]
    #[ORM\JoinColumn(nullable: false)]
    private ?ProfilCoach $profilCoach = null;

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

    public function getHeureDebut(): ?\DateTimeImmutable
    {
        return $this->heureDebut;
    }

    public function setHeureDebut(\DateTimeImmutable $heureDebut): static
    {
        $this->heureDebut = $heureDebut;

        return $this;
    }

    public function getHeureFin(): ?\DateTimeImmutable
    {
        return $this->heureFin;
    }

    public function setHeureFin(\DateTimeImmutable $heureFin): static
    {
        $this->heureFin = $heureFin;

        return $this;
    }

    public function getProfilCoach(): ?ProfilCoach
    {
        return $this->profilCoach;
    }

    public function setProfilCoach(?ProfilCoach $profilCoach): static
    {
        $this->profilCoach = $profilCoach;

        return $this;
    }
}
