import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Auth } from '../../core/auth';
import { Contexte } from '../../core/contexte';
import { initiales } from '../../core/utils';

interface Lien {
  chemin: string;
  libelle: string;
  exact?: boolean;
}

const MENUS: Record<string, Lien[]> = {
  coach: [
    { chemin: '/coach', libelle: 'Tableau', exact: true },
    { chemin: '/coach/profil', libelle: 'Mon profil' },
    { chemin: '/coach/seances', libelle: 'Séances' },
    { chemin: '/coach/horaires', libelle: 'Horaires' },
    { chemin: '/coach/disponibilites', libelle: 'Disponibilités' },
    { chemin: '/coach/reservations', libelle: 'Réservations' },
    { chemin: '/coach/calendrier', libelle: 'Calendrier' },
    { chemin: '/coach/avis', libelle: 'Avis' },
  ],
  salle: [
    { chemin: '/salle', libelle: 'Tableau', exact: true },
    { chemin: '/salle/ma-salle', libelle: 'Ma salle' },
    { chemin: '/salle/seances', libelle: 'Séances' },
    { chemin: '/salle/horaires', libelle: 'Horaires' },
    { chemin: '/salle/disponibilites', libelle: 'Disponibilités' },
    { chemin: '/salle/reservations', libelle: 'Réservations' },
    { chemin: '/salle/calendrier', libelle: 'Calendrier' },
    { chemin: '/salle/avis', libelle: 'Avis' },
  ],
  admin: [
    { chemin: '/admin', libelle: 'Utilisateurs', exact: true },
    { chemin: '/admin/salles', libelle: 'Salles' },
    { chemin: '/admin/coachs', libelle: 'Coachs' },
    { chemin: '/admin/activites', libelle: 'Activités' },
    { chemin: '/admin/equipements', libelle: 'Équipements' },
    { chemin: '/admin/reservations', libelle: 'Réservations' },
    { chemin: '/admin/avis', libelle: 'Avis' },
  ],
};

const TITRES: Record<string, string> = { coach: 'Espace coach', salle: 'Espace salle', admin: 'Administration' };

/** Mise en page des espaces professionnels : barre latérale + contenu (maquettes 12 à 18). */
@Component({
  selector: 'app-espace-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './espace-layout.html',
  styleUrl: './espace-layout.css',

})
export class EspaceLayout implements OnInit {
  auth = inject(Auth);
  ctx = inject(Contexte);
  private route = inject(ActivatedRoute);

  espace = signal('coach');
  pret = signal(false);
  liens = computed(() => MENUS[this.espace()] ?? []);
  titre = computed(() => TITRES[this.espace()] ?? '');
  lettres = computed(() => initiales(this.auth.nomAffiche()));

  ngOnInit() {
    this.espace.set(this.route.snapshot.data['espace'] ?? 'coach');
    const charger = () => {
      const fin = () => this.pret.set(true);
      if (this.espace() === 'coach') this.ctx.chargerCoach().subscribe({ next: fin, error: fin });
      else if (this.espace() === 'salle') this.ctx.chargerSalles().subscribe({ next: fin, error: fin });
      else fin();
    };
    if (this.auth.profil() || !this.auth.estConnecte()) charger();
    else this.auth.chargerProfil().subscribe(() => charger());
  }

  changerSalle(e: Event) {
    this.ctx.choisirSalle(Number((e.target as HTMLSelectElement).value));
  }
}
