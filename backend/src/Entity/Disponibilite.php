<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Entity\Traits\Timestampable;
use App\Repository\DisponibiliteRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: DisponibiliteRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(denormalizationContext: ['groups' => ['write']], operations: [
    new GetCollection(),
    new Get(),
    new Post(securityPostDenormalize: "is_granted('ROLE_ADMINISTRATEUR') or ((object.getProfilCoach() != null and object.getProfilCoach().getUtilisateur() == user) or (object.getProfilCoach() == null and object.getSalle() != null and object.getSalle().getGestionnaire() == user))"),
    new Put(security: "is_granted('ROLE_ADMINISTRATEUR') or ((object.getProfilCoach() != null and object.getProfilCoach().getUtilisateur() == user) or (object.getProfilCoach() == null and object.getSalle() != null and object.getSalle().getGestionnaire() == user))", securityPostDenormalize: "is_granted('ROLE_ADMINISTRATEUR') or ((object.getProfilCoach() != null and object.getProfilCoach().getUtilisateur() == user) or (object.getProfilCoach() == null and object.getSalle() != null and object.getSalle().getGestionnaire() == user))"),
    new Patch(security: "is_granted('ROLE_ADMINISTRATEUR') or ((object.getProfilCoach() != null and object.getProfilCoach().getUtilisateur() == user) or (object.getProfilCoach() == null and object.getSalle() != null and object.getSalle().getGestionnaire() == user))", securityPostDenormalize: "is_granted('ROLE_ADMINISTRATEUR') or ((object.getProfilCoach() != null and object.getProfilCoach().getUtilisateur() == user) or (object.getProfilCoach() == null and object.getSalle() != null and object.getSalle().getGestionnaire() == user))"),
    new Delete(security: "is_granted('ROLE_ADMINISTRATEUR') or ((object.getProfilCoach() != null and object.getProfilCoach().getUtilisateur() == user) or (object.getProfilCoach() == null and object.getSalle() != null and object.getSalle().getGestionnaire() == user))"),
])]
class Disponibilite
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATE_IMMUTABLE)]
    #[Groups(['write'])]
    private ?\DateTimeImmutable $dateDispo = null;

    #[ORM\Column(type: Types::TIME_IMMUTABLE)]
    #[Groups(['write'])]
    private ?\DateTimeImmutable $heureDebut = null;

    #[ORM\Column(type: Types::TIME_IMMUTABLE)]
    #[Groups(['write'])]
    private ?\DateTimeImmutable $heureFin = null;

    #[ORM\Column(length: 20)]
    #[Groups(['write'])]
    private ?string $type = null;

    #[ORM\ManyToOne(inversedBy: 'disponibilites')]
    #[Groups(['write'])]
    private ?ProfilCoach $profilCoach = null;

    #[ORM\ManyToOne(inversedBy: 'disponibilites')]
    #[Groups(['write'])]
    private ?Salle $salle = null;

    use Timestampable;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDateDispo(): ?\DateTimeImmutable
    {
        return $this->dateDispo;
    }

    public function setDateDispo(\DateTimeImmutable $dateDispo): static
    {
        $this->dateDispo = $dateDispo;

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

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;

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
