<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\State\UtilisateurConnecteProcessor;
use App\Entity\Traits\Timestampable;
use App\Repository\AvisRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: AvisRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(denormalizationContext: ['groups' => ['write']], normalizationContext: ['groups' => ['public:read']], operations: [
    new GetCollection(),
    new Get(),
    new Post(denormalizationContext: ['groups' => ['write', 'create']], security: "is_granted('ROLE_SPORTIF')", processor: UtilisateurConnecteProcessor::class),
    new Put(security: "is_granted('ROLE_ADMINISTRATEUR') or (object.getUtilisateur() == user)", securityPostDenormalize: "is_granted('ROLE_ADMINISTRATEUR') or (object.getUtilisateur() == user)"),
    new Patch(security: "is_granted('ROLE_ADMINISTRATEUR') or (object.getUtilisateur() == user)", securityPostDenormalize: "is_granted('ROLE_ADMINISTRATEUR') or (object.getUtilisateur() == user)"),
    new Delete(security: "is_granted('ROLE_ADMINISTRATEUR') or (object.getUtilisateur() == user)"),
])]
class Avis
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['public:read'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['public:read', 'write'])]
    private ?int $note = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['public:read', 'write'])]
    private ?string $commentaire = null;

    #[ORM\ManyToOne(inversedBy: 'avis')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['public:read'])]
    private ?Utilisateur $utilisateur = null;

    #[ORM\ManyToOne(inversedBy: 'avis')]
    #[Groups(['public:read', 'create'])]
    private ?Salle $salle = null;

    #[ORM\ManyToOne(inversedBy: 'avis')]
    #[Groups(['public:read', 'create'])]
    private ?ProfilCoach $profilCoach = null;

    use Timestampable;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNote(): ?int
    {
        return $this->note;
    }

    public function setNote(int $note): static
    {
        $this->note = $note;

        return $this;
    }

    public function getCommentaire(): ?string
    {
        return $this->commentaire;
    }

    public function setCommentaire(?string $commentaire): static
    {
        $this->commentaire = $commentaire;

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

    public function getSalle(): ?Salle
    {
        return $this->salle;
    }

    public function setSalle(?Salle $salle): static
    {
        $this->salle = $salle;

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
