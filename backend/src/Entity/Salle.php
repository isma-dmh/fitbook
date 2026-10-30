<?php

namespace App\Entity;

use App\Entity\Traits\Timestampable;
use App\Repository\SalleRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ORM\Entity(repositoryClass: SalleRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ApiResource]
class Salle
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $nom = null;

    #[ORM\Column(length: 255)]
    private ?string $adresse = null;

    #[ORM\Column(length: 255)]
    private ?string $ville = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $description = null;

    #[ORM\Column]
    private ?int $capaciteMax = null;

    #[ORM\ManyToOne(inversedBy: 'salles')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Utilisateur $gestionnaire = null;

    /**
     * @var Collection<int, Equipement>
     */
    #[ORM\ManyToMany(targetEntity: Equipement::class, inversedBy: 'salles')]
    private Collection $equipements;

    /**
     * @var Collection<int, Activite>
     */
    #[ORM\ManyToMany(targetEntity: Activite::class, inversedBy: 'salles')]
    private Collection $activites;

    /**
     * @var Collection<int, HoraireSalle>
     */
    #[ORM\OneToMany(targetEntity: HoraireSalle::class, mappedBy: 'salle', orphanRemoval: true)]
    private Collection $horaireSalles;

    /**
     * @var Collection<int, PhotoSalle>
     */
    #[ORM\OneToMany(targetEntity: PhotoSalle::class, mappedBy: 'salle', orphanRemoval: true)]
    private Collection $photoSalles;

    /**
     * @var Collection<int, ProfilCoach>
     */
    #[ORM\ManyToMany(targetEntity: ProfilCoach::class, mappedBy: 'salles')]
    private Collection $profilCoaches;

    /**
     * @var Collection<int, Seance>
     */
    #[ORM\OneToMany(targetEntity: Seance::class, mappedBy: 'salle')]
    private Collection $seances;

    /**
     * @var Collection<int, Disponibilite>
     */
    #[ORM\OneToMany(targetEntity: Disponibilite::class, mappedBy: 'salle')]
    private Collection $disponibilites;

    /**
     * @var Collection<int, Avis>
     */
    #[ORM\OneToMany(targetEntity: Avis::class, mappedBy: 'salle')]
    private Collection $avis;

    /**
     * @var Collection<int, Utilisateur>
     */
    #[ORM\ManyToMany(targetEntity: Utilisateur::class, mappedBy: 'favorisSalles')]
    private Collection $utilisateurs;

    public function __construct()
    {
        $this->equipements = new ArrayCollection();
        $this->activites = new ArrayCollection();
        $this->horaireSalles = new ArrayCollection();
        $this->photoSalles = new ArrayCollection();
        $this->profilCoaches = new ArrayCollection();
        $this->seances = new ArrayCollection();
        $this->disponibilites = new ArrayCollection();
        $this->avis = new ArrayCollection();
        $this->utilisateurs = new ArrayCollection();
    }

    use Timestampable;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;

        return $this;
    }

    public function getAdresse(): ?string
    {
        return $this->adresse;
    }

    public function setAdresse(string $adresse): static
    {
        $this->adresse = $adresse;

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

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getCapaciteMax(): ?int
    {
        return $this->capaciteMax;
    }

    public function setCapaciteMax(int $capaciteMax): static
    {
        $this->capaciteMax = $capaciteMax;

        return $this;
    }

    public function getGestionnaire(): ?Utilisateur
    {
        return $this->gestionnaire;
    }

    public function setGestionnaire(?Utilisateur $gestionnaire): static
    {
        $this->gestionnaire = $gestionnaire;

        return $this;
    }

    /**
     * @return Collection<int, Equipement>
     */
    public function getEquipements(): Collection
    {
        return $this->equipements;
    }

    public function addEquipement(Equipement $equipement): static
    {
        if (!$this->equipements->contains($equipement)) {
            $this->equipements->add($equipement);
        }

        return $this;
    }

    public function removeEquipement(Equipement $equipement): static
    {
        $this->equipements->removeElement($equipement);

        return $this;
    }

    /**
     * @return Collection<int, Activite>
     */
    public function getActivites(): Collection
    {
        return $this->activites;
    }

    public function addActivite(Activite $activite): static
    {
        if (!$this->activites->contains($activite)) {
            $this->activites->add($activite);
        }

        return $this;
    }

    public function removeActivite(Activite $activite): static
    {
        $this->activites->removeElement($activite);

        return $this;
    }

    /**
     * @return Collection<int, HoraireSalle>
     */
    public function getHoraireSalles(): Collection
    {
        return $this->horaireSalles;
    }

    public function addHoraireSalle(HoraireSalle $horaireSalle): static
    {
        if (!$this->horaireSalles->contains($horaireSalle)) {
            $this->horaireSalles->add($horaireSalle);
            $horaireSalle->setSalle($this);
        }

        return $this;
    }

    public function removeHoraireSalle(HoraireSalle $horaireSalle): static
    {
        if ($this->horaireSalles->removeElement($horaireSalle)) {
            // set the owning side to null (unless already changed)
            if ($horaireSalle->getSalle() === $this) {
                $horaireSalle->setSalle(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, PhotoSalle>
     */
    public function getPhotoSalles(): Collection
    {
        return $this->photoSalles;
    }

    public function addPhotoSalle(PhotoSalle $photoSalle): static
    {
        if (!$this->photoSalles->contains($photoSalle)) {
            $this->photoSalles->add($photoSalle);
            $photoSalle->setSalle($this);
        }

        return $this;
    }

    public function removePhotoSalle(PhotoSalle $photoSalle): static
    {
        if ($this->photoSalles->removeElement($photoSalle)) {
            // set the owning side to null (unless already changed)
            if ($photoSalle->getSalle() === $this) {
                $photoSalle->setSalle(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, ProfilCoach>
     */
    public function getProfilCoaches(): Collection
    {
        return $this->profilCoaches;
    }

    public function addProfilCoach(ProfilCoach $profilCoach): static
    {
        if (!$this->profilCoaches->contains($profilCoach)) {
            $this->profilCoaches->add($profilCoach);
            $profilCoach->addSalle($this);
        }

        return $this;
    }

    public function removeProfilCoach(ProfilCoach $profilCoach): static
    {
        if ($this->profilCoaches->removeElement($profilCoach)) {
            $profilCoach->removeSalle($this);
        }

        return $this;
    }

    /**
     * @return Collection<int, Seance>
     */
    public function getSeances(): Collection
    {
        return $this->seances;
    }

    public function addSeance(Seance $seance): static
    {
        if (!$this->seances->contains($seance)) {
            $this->seances->add($seance);
            $seance->setSalle($this);
        }

        return $this;
    }

    public function removeSeance(Seance $seance): static
    {
        if ($this->seances->removeElement($seance)) {
            // set the owning side to null (unless already changed)
            if ($seance->getSalle() === $this) {
                $seance->setSalle(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Disponibilite>
     */
    public function getDisponibilites(): Collection
    {
        return $this->disponibilites;
    }

    public function addDisponibilite(Disponibilite $disponibilite): static
    {
        if (!$this->disponibilites->contains($disponibilite)) {
            $this->disponibilites->add($disponibilite);
            $disponibilite->setSalle($this);
        }

        return $this;
    }

    public function removeDisponibilite(Disponibilite $disponibilite): static
    {
        if ($this->disponibilites->removeElement($disponibilite)) {
            // set the owning side to null (unless already changed)
            if ($disponibilite->getSalle() === $this) {
                $disponibilite->setSalle(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Avis>
     */
    public function getAvis(): Collection
    {
        return $this->avis;
    }

    public function addAvi(Avis $avi): static
    {
        if (!$this->avis->contains($avi)) {
            $this->avis->add($avi);
            $avi->setSalle($this);
        }

        return $this;
    }

    public function removeAvi(Avis $avi): static
    {
        if ($this->avis->removeElement($avi)) {
            // set the owning side to null (unless already changed)
            if ($avi->getSalle() === $this) {
                $avi->setSalle(null);
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
            $utilisateur->addFavorisSalle($this);
        }

        return $this;
    }

    public function removeUtilisateur(Utilisateur $utilisateur): static
    {
        if ($this->utilisateurs->removeElement($utilisateur)) {
            $utilisateur->removeFavorisSalle($this);
        }

        return $this;
    }
}
