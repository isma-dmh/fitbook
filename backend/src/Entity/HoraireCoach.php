<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\HoraireCoachRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: HoraireCoachRepository::class)]
#[ApiResource(denormalizationContext: ['groups' => ['write']], operations: [
    new GetCollection(),
    new Get(),
    new Post(securityPostDenormalize: "is_granted('ROLE_ADMINISTRATEUR') or (object.getProfilCoach() != null and object.getProfilCoach().getUtilisateur() == user)"),
    new Put(security: "is_granted('ROLE_ADMINISTRATEUR') or (object.getProfilCoach() != null and object.getProfilCoach().getUtilisateur() == user)", securityPostDenormalize: "is_granted('ROLE_ADMINISTRATEUR') or (object.getProfilCoach() != null and object.getProfilCoach().getUtilisateur() == user)"),
    new Patch(security: "is_granted('ROLE_ADMINISTRATEUR') or (object.getProfilCoach() != null and object.getProfilCoach().getUtilisateur() == user)", securityPostDenormalize: "is_granted('ROLE_ADMINISTRATEUR') or (object.getProfilCoach() != null and object.getProfilCoach().getUtilisateur() == user)"),
    new Delete(security: "is_granted('ROLE_ADMINISTRATEUR') or (object.getProfilCoach() != null and object.getProfilCoach().getUtilisateur() == user)"),
])]
class HoraireCoach
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['write'])]
    private ?int $jourSemaine = null;

    #[ORM\Column(type: Types::TIME_IMMUTABLE)]
    #[Groups(['write'])]
    private ?\DateTimeImmutable $heureDebut = null;

    #[ORM\Column(type: Types::TIME_IMMUTABLE)]
    #[Groups(['write'])]
    private ?\DateTimeImmutable $heureFin = null;

    #[ORM\ManyToOne(inversedBy: 'horaireCoaches')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['write'])]
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
