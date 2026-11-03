import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Auth } from '../../../core/auth';
import { Catalogue, Vue } from '../../../core/catalogue';
import { Salle } from '../../../core/models';
import { heure, nomJour } from '../../../core/utils';
import { AvisListe } from '../../../shared/avis-liste/avis-liste';
import { LigneSeance } from '../../../shared/ligne-seance/ligne-seance';
import { Etoiles } from '../../../shared/etoiles/etoiles';
import { Favori } from '../../../shared/favori/favori';
import { Visuel } from '../../../shared/visuel/visuel';

/** Fiche détaillée d'une salle (US-S5) : photos, activités, horaires, équipements, séances et avis. */
@Component({
  selector: 'app-salle-detail',
  imports: [RouterLink, AvisListe, LigneSeance, Etoiles, Favori, Visuel],
  templateUrl: './salle-detail.html',
  styleUrl: './salle-detail.css',

})
export class SalleDetail {
  auth = inject(Auth);
  private route = inject(ActivatedRoute);
  private catalogue = inject(Catalogue);

  vue = signal<Vue | null>(null);
  erreur = signal(false);
  photo = signal<string | null>(null);

  jour = nomJour;
  heure = heure;

  salle = computed<Salle | undefined>(() => {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    return this.vue()?.d.salles.find((s) => s.id === id);
  });
  photos = computed(() => this.vue()?.photosSalle(this.salle()?.['@id']) ?? []);
  photoActive = computed(() => this.photo() ?? this.photos()[0]?.url ?? null);
  avis = computed(() => this.vue()?.avisSalle(this.salle()?.['@id']) ?? []);
  note = computed(() => (this.salle() ? (this.vue()?.noteSalle(this.salle()!) ?? null) : null));
  activites = computed(() => (this.salle() ? (this.vue()?.activitesSalle(this.salle()!) ?? []) : []));
  equipements = computed(() => (this.salle() ? (this.vue()?.equipementsSalle(this.salle()!) ?? []) : []));
  horaires = computed(() => this.vue()?.horairesSalle(this.salle()?.['@id']) ?? []);
  seances = computed(() => this.vue()?.seancesSalle(this.salle()?.['@id']).slice(0, 6) ?? []);

  constructor() {
    this.catalogue.tout().subscribe({
      next: (v) => {
        this.vue.set(v);
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (!v.d.salles.some((s) => s.id === id)) this.erreur.set(true);
      },
      error: () => this.erreur.set(true),
    });
  }
}
