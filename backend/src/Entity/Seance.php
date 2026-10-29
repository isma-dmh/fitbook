<?php

namespace App\Entity;

use App\Entity\Traits\Timestampable;
use App\Repository\SeanceRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SeanceRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Seance
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type:Types::DATE_IMMUTABLE)]
    private ?\DateTimeImmutable $dateSeance = null;

    #[ORM\Column(type: Types::TIME_IMMUTABLE)]
    private ?\DateTimeImmutable $heureDebut = null;

    #[ORM\Column]
    private ?int $dureeMinutes = null;

    #[ORM\Column]
    private ?int $capacite = null;

    #[ORM\Column]
    private ?float $prix = null;

    #[ORM\Column(length: 30)]
    private ?string $statut = null;

    #[ORM\ManyToOne(inversedBy: 'seances')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Activite $activite = null;

    #[ORM\ManyToOne(inversedBy: 'seances')]
    private ?ProfilCoach $profilCoach = null;

    #[ORM\ManyToOne(inversedBy: 'seances')]
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
