<?php

namespace App\Entity;

use App\Entity\Traits\Timestampable;
use App\Repository\SeanceRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Metadata\ApiResource;
use App\State\UtilisateurConnecteProcessor;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;

#[ORM\Entity(repositoryClass: SeanceRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(denormalizationContext: ['groups' => ['write']], normalizationContext: ['groups' => ['seance:read']], operations: [
    new GetCollection(),
    new Get(),
    new Post(processor: UtilisateurConnecteProcessor::class, securityPostDenormalize: "is_granted('ROLE_ADMINISTRATEUR') or ((object.getProfilCoach() != null and object.getProfilCoach().getUtilisateur() == user) or (object.getProfilCoach() == null and object.getSalle() != null and object.getSalle().getGestionnaire() == user))"),
    new Put(processor: UtilisateurConnecteProcessor::class, security: "is_granted('ROLE_ADMINISTRATEUR') or ((object.getProfilCoach() != null and object.getProfilCoach().getUtilisateur() == user) or (object.getProfilCoach() == null and object.getSalle() != null and object.getSalle().getGestionnaire() == user))", securityPostDenormalize: "is_granted('ROLE_ADMINISTRATEUR') or ((object.getProfilCoach() != null and object.getProfilCoach().getUtilisateur() == user) or (object.getProfilCoach() == null and object.getSalle() != null and object.getSalle().getGestionnaire() == user))"),
    new Patch(processor: UtilisateurConnecteProcessor::class, security: "is_granted('ROLE_ADMINISTRATEUR') or ((object.getProfilCoach() != null and object.getProfilCoach().getUtilisateur() == user) or (object.getProfilCoach() == null and object.getSalle() != null and object.getSalle().getGestionnaire() == user))", securityPostDenormalize: "is_granted('ROLE_ADMINISTRATEUR') or ((object.getProfilCoach() != null and object.getProfilCoach().getUtilisateur() == user) or (object.getProfilCoach() == null and object.getSalle() != null and object.getSalle().getGestionnaire() == user))"),
    new Delete(security: "is_granted('ROLE_ADMINISTRATEUR') or ((object.getProfilCoach() != null and object.getProfilCoach().getUtilisateur() == user) or (object.getProfilCoach() == null and object.getSalle() != null and object.getSalle().getGestionnaire() == user))"),
])]
class Seance
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['seance:read'])]
    private ?int $id = null;

    #[ORM\Column(type:Types::DATE_IMMUTABLE)]
    #[Groups(['write', 'seance:read'])]
    #[Assert\NotNull(message: 'Ce champ est obligatoire.')]
    private ?\DateTimeImmutable $dateSeance = null;

    #[ORM\Column(type: Types::TIME_IMMUTABLE)]
    #[Groups(['write', 'seance:read'])]
    #[Assert\NotNull(message: 'Ce champ est obligatoire.')]
    private ?\DateTimeImmutable $heureDebut = null;

    #[ORM\Column]
    #[Groups(['write', 'seance:read'])]
    #[Assert\NotNull(message: 'Ce champ est obligatoire.')]
    private ?int $dureeMinutes = null;

    #[ORM\Column]
    #[Groups(['write', 'seance:read'])]
    #[Assert\NotNull(message: 'Ce champ est obligatoire.')]
    private ?int $capacite = null;

    #[ORM\Column]
    #[Groups(['write', 'seance:read'])]
    #[Assert\NotNull(message: 'Ce champ est obligatoire.')]
    private ?float $prix = null;

    #[ORM\Column(length: 30)]
    #[Groups(['write', 'seance:read'])]
    #[Assert\NotNull(message: 'Ce champ est obligatoire.')]
    private ?string $statut = null;

    #[ORM\ManyToOne(inversedBy: 'seances')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['write', 'seance:read'])]
    #[Assert\NotNull(message: 'Ce champ est obligatoire.')]
    private ?Activite $activite = null;

    #[ORM\ManyToOne(inversedBy: 'seances')]
    #[Groups(['write', 'seance:read'])]
    private ?ProfilCoach $profilCoach = null;

    #[ORM\ManyToOne(inversedBy: 'seances')]
    #[Groups(['write', 'seance:read'])]
    private ?Salle $salle = null;

    /**
     * @var Collection<int, Reservation>
     */
    #[ORM\OneToMany(targetEntity: Reservation::class, mappedBy: 'seance')]
    private Collection $reservations;

    /**
     * @var Collection<int, Utilisateur>
     */
    #[ORM\ManyToMany(targetEntity: Utilisateur::class, mappedBy: 'favorisSeances')]
    private Collection $utilisateurs;

    public function __construct()
    {
        $this->reservations = new ArrayCollection();
        $this->utilisateurs = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    use Timestampable;

    public function getDateSeance(): ?\DateTimeImmutable
    {
        return $this->dateSeance;
    }

    public function setDateSeance(\DateTimeImmutable $dateSeance): static
    {
        $this->dateSeance = $dateSeance;

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

    public function getDureeMinutes(): ?int
    {
        return $this->dureeMinutes;
    }

    public function setDureeMinutes(int $dureeMinutes): static
    {
        $this->dureeMinutes = $dureeMinutes;

        return $this;
    }

    public function getCapacite(): ?int
    {
        return $this->capacite;
    }

    public function setCapacite(int $capacite): static
    {
        $this->capacite = $capacite;

        return $this;
    }

    public function getPrix(): ?float
    {
        return $this->prix;
    }

    public function setPrix(float $prix): static
    {
        $this->prix = $prix;

        return $this;
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

    public function getActivite(): ?Activite
    {
        return $this->activite;
    }

    public function setActivite(?Activite $activite): static
    {
        $this->activite = $activite;

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

    /** Places encore disponibles (capacité moins les réservations non annulées). */
    #[Groups(['seance:read'])]
    public function getPlacesRestantes(): int
    {
        $actives = $this->reservations->filter(static fn (Reservation $r) => 'annulee' !== $r->getStatut())->count();

        return max(0, (int) $this->capacite - $actives);
    }

    /**
     * @return Collection<int, Reservation>
     */
    public function getReservations(): Collection
    {
        return $this->reservations;
    }

    public function addReservation(Reservation $reservation): static
    {
        if (!$this->reservations->contains($reservation)) {
            $this->reservations->add($reservation);
            $reservation->setSeance($this);
        }

        return $this;
    }

    public function removeReservation(Reservation $reservation): static
    {
        if ($this->reservations->removeElement($reservation)) {
            // set the owning side to null (unless already changed)
            if ($reservation->getSeance() === $this) {
                $reservation->setSeance(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Utilisateur>
     */
    public function getUtilisateurs(): Collection
    {
        return $this->utilisateurs;
    }

    public function addUtilisateur(Utilisateur $utilisateur): static
    {
        if (!$this->utilisateurs->contains($utilisateur)) {
            $this->utilisateurs->add($utilisateur);
            $utilisateur->addFavorisSeance($this);
        }

        return $this;
    }

    public function removeUtilisateur(Utilisateur $utilisateur): static
    {
        if ($this->utilisateurs->removeElement($utilisateur)) {
            $utilisateur->removeFavorisSeance($this);
        }

        return $this;
    }
}
