<?php

namespace App\Entity;

use App\Entity\Traits\Timestampable;
use App\Repository\ProfilCoachRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
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

    /**
     * @var Collection<int, HoraireCoach>
     */
    #[ORM\OneToMany(targetEntity: HoraireCoach::class, mappedBy: 'profilCoach', orphanRemoval: true)]
    private Collection $horaireCoaches;

    /**
     * @var Collection<int, Salle>
     */
    #[ORM\ManyToMany(targetEntity: Salle::class, inversedBy: 'profilCoaches')]
    private Collection $salles;

    public function __construct()
    {
        $this->horaireCoaches = new ArrayCollection();
        $this->salles = new ArrayCollection();
    }

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

    /**
     * @return Collection<int, HoraireCoach>
     */
    public function getHoraireCoaches(): Collection
    {
        return $this->horaireCoaches;
    }

    public function addHoraireCoach(HoraireCoach $horaireCoach): static
    {
        if (!$this->horaireCoaches->contains($horaireCoach)) {
            $this->horaireCoaches->add($horaireCoach);
            $horaireCoach->setProfilCoach($this);
        }

        return $this;
    }

    public function removeHoraireCoach(HoraireCoach $horaireCoach): static
    {
        if ($this->horaireCoaches->removeElement($horaireCoach)) {
            // set the owning side to null (unless already changed)
            if ($horaireCoach->getProfilCoach() === $this) {
                $horaireCoach->setProfilCoach(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Salle>
     */
    public function getSalles(): Collection
    {
        return $this->salles;
    }

    public function addSalle(Salle $salle): static
    {
        if (!$this->salles->contains($salle)) {
            $this->salles->add($salle);
        }

        return $this;
    }

    public function removeSalle(Salle $salle): static
    {
        $this->salles->removeElement($salle);

        return $this;
    }
}
