<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\PhotoSalleRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Serializer\Attribute\Groups;
use Vich\UploaderBundle\Mapping\Attribute as Vich;

#[ORM\Entity(repositoryClass: PhotoSalleRepository::class)]
#[Vich\Uploadable]
#[ApiResource(denormalizationContext: ['groups' => ['write']], operations: [
    new GetCollection(),
    new Get(),
    new Put(security: "is_granted('ROLE_ADMINISTRATEUR') or (object.getSalle() != null and object.getSalle().getGestionnaire() == user)", securityPostDenormalize: "is_granted('ROLE_ADMINISTRATEUR') or (object.getSalle() != null and object.getSalle().getGestionnaire() == user)"),
    new Patch(security: "is_granted('ROLE_ADMINISTRATEUR') or (object.getSalle() != null and object.getSalle().getGestionnaire() == user)", securityPostDenormalize: "is_granted('ROLE_ADMINISTRATEUR') or (object.getSalle() != null and object.getSalle().getGestionnaire() == user)"),
    new Delete(security: "is_granted('ROLE_ADMINISTRATEUR') or (object.getSalle() != null and object.getSalle().getGestionnaire() == user)"),
])]
class PhotoSalle
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['public:read'])]
    private ?string $url = null;

    #[Vich\UploadableField(mapping: 'photo_salle', fileNameProperty: 'url')]
    private ?File $fichier = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $dateCreation = null;

    #[ORM\ManyToOne(inversedBy: 'photoSalles')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['write'])]
    private ?Salle $salle = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setFichier(?File $fichier): void
    {
        $this->fichier = $fichier;
    }

    public function getFichier(): ?File
    {
        return $this->fichier;
    }

    public function getUrl(): ?string
    {
        return $this->url;
    }

    public function setUrl(string $url): static
    {
        $this->url = $url;

        return $this;
    }

    public function getDateCreation(): ?\DateTimeImmutable
    {
        return $this->dateCreation;
    }

    public function setDateCreation(\DateTimeImmutable $dateCreation): static
    {
        $this->dateCreation = $dateCreation;

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

    public function __construct()
{
    $this->dateCreation = new \DateTimeImmutable();
}

}
