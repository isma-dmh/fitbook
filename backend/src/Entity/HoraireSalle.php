<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\HoraireSalleRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: HoraireSalleRepository::class)]
#[ApiResource(denormalizationContext: ['groups' => ['write']], operations: [
    new GetCollection(),
    new Get(),
    new Post(securityPostDenormalize: "is_granted('ROLE_ADMINISTRATEUR') or (object.getSalle() != null and object.getSalle().getGestionnaire() == user)"),
    new Put(security: "is_granted('ROLE_ADMINISTRATEUR') or (object.getSalle() != null and object.getSalle().getGestionnaire() == user)", securityPostDenormalize: "is_granted('ROLE_ADMINISTRATEUR') or (object.getSalle() != null and object.getSalle().getGestionnaire() == user)"),
    new Patch(security: "is_granted('ROLE_ADMINISTRATEUR') or (object.getSalle() != null and object.getSalle().getGestionnaire() == user)", securityPostDenormalize: "is_granted('ROLE_ADMINISTRATEUR') or (object.getSalle() != null and object.getSalle().getGestionnaire() == user)"),
    new Delete(security: "is_granted('ROLE_ADMINISTRATEUR') or (object.getSalle() != null and object.getSalle().getGestionnaire() == user)"),
])]
class HoraireSalle
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
    private ?\DateTimeImmutable $heureOuverture = null;

    #[ORM\Column(type: Types::TIME_IMMUTABLE)]
    #[Groups(['write'])]
    private ?\DateTimeImmutable $heureFermeture = null;

    #[ORM\ManyToOne(inversedBy: 'horaireSalles')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['write'])]
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
