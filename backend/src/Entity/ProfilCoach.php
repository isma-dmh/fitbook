<?php

namespace App\Entity;

use App\Entity\Traits\Timestampable;
use App\Repository\ProfilCoachRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProfilCoachRepository::class)]
#[ORM\HasLifecycleCallbacks]
class ProfilCoach
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $presentation = null;

    #[ORM\Column(length: 255)]
    private ?string $specialites = null;

    #[ORM\Column]
    private ?float $tarifHoraire = null;

    #[ORM\Column(length: 255)]
    private ?string $ville = null;

    #[ORM\OneToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Utilisateur $utilisateur = null;

    use Timestampable;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPresentation(): ?string
    {
        return $this->presentation;
    }

    public function setPresentation(string $presentation): static
    {
        $this->presentation = $presentation;

        return $this;
    }

    public function getSpecialites(): ?string
    {
        return $this->specialites;
    }

    public function setSpecialites(string $specialites): static
    {
        $this->specialites = $specialites;

        return $this;
    }

    public function getTarifHoraire(): ?float
    {
        return $this->tarifHoraire;
    }

    public function setTarifHoraire(float $tarifHoraire): static
    {
        $this->tarifHoraire = $tarifHoraire;

        return $this;
    }

    public function getVille(): ?string
    {
        return $this->ville;
    }

    public function setVille(string $ville): static
    {
        $this->ville = $ville;

        return $this;
    }

    public function getUtilisateur(): ?Utilisateur
    {
        return $this->utilisateur;
    }

    public function setUtilisateur(Utilisateur $utilisateur): static
    {
        $this->utilisateur = $utilisateur;

        return $this;
    }
}
