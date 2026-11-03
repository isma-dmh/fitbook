<?php

namespace App\Entity;

use App\Entity\Traits\Timestampable;
use App\Repository\ReservationRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\State\UtilisateurConnecteProcessor;

#[ORM\Entity(repositoryClass: ReservationRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(denormalizationContext: ['groups' => ['write']], normalizationContext: ['groups' => ['public:read']], operations: [
    new GetCollection(),
    new Get(),
    new Post(denormalizationContext: ['groups' => ['write', 'create']], security: "is_granted('ROLE_SPORTIF')", processor: UtilisateurConnecteProcessor::class),
    new Put(security: "is_granted('ROLE_ADMINISTRATEUR') or (object.getUtilisateur() == user) or (object.getSeance().getProfilCoach() != null and object.getSeance().getProfilCoach().getUtilisateur() == user) or (object.getSeance().getSalle() != null and object.getSeance().getSalle().getGestionnaire() == user)", securityPostDenormalize: "is_granted('ROLE_ADMINISTRATEUR') or (object.getUtilisateur() == user) or (object.getSeance().getProfilCoach() != null and object.getSeance().getProfilCoach().getUtilisateur() == user) or (object.getSeance().getSalle() != null and object.getSeance().getSalle().getGestionnaire() == user)"),
    new Patch(security: "is_granted('ROLE_ADMINISTRATEUR') or (object.getUtilisateur() == user) or (object.getSeance().getProfilCoach() != null and object.getSeance().getProfilCoach().getUtilisateur() == user) or (object.getSeance().getSalle() != null and object.getSeance().getSalle().getGestionnaire() == user)", securityPostDenormalize: "is_granted('ROLE_ADMINISTRATEUR') or (object.getUtilisateur() == user) or (object.getSeance().getProfilCoach() != null and object.getSeance().getProfilCoach().getUtilisateur() == user) or (object.getSeance().getSalle() != null and object.getSeance().getSalle().getGestionnaire() == user)"),
    new Delete(security: "is_granted('ROLE_ADMINISTRATEUR') or (object.getUtilisateur() == user)"),
])]
class Reservation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['public:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 30)]
    #[Groups(['public:read', 'write'])]
    private ?string $statut = null;

    #[ORM\ManyToOne(inversedBy: 'reservations')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['public:read'])]
    private ?Utilisateur $utilisateur = null;

    #[ORM\ManyToOne(inversedBy: 'reservations')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['public:read', 'create'])]
    private ?Seance $seance = null;

    use Timestampable;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStatut(): ?string
    {
        return $this->statut;
    }

    public function setStatut(string $statut): static
    {
        $this->statut = $statut;

        return $this;
    }

    public function getUtilisateur(): ?Utilisateur
    {
        return $this->utilisateur;
    }

    public function setUtilisateur(?Utilisateur $utilisateur): static
    {
        $this->utilisateur = $utilisateur;

        return $this;
    }

    public function getSeance(): ?Seance
    {
        return $this->seance;
    }

    public function setSeance(?Seance $seance): static
    {
        $this->seance = $seance;

        return $this;
    }
}
