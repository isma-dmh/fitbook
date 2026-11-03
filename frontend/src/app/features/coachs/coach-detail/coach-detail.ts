import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Auth } from '../../../core/auth';
import { Catalogue, Vue } from '../../../core/catalogue';
import { ProfilCoach } from '../../../core/models';
import { heure, iri, nomJour, prix } from '../../../core/utils';
import { AvisListe } from '../../../shared/avis-liste/avis-liste';
import { LigneSeance } from '../../../shared/ligne-seance/ligne-seance';
import { Etoiles } from '../../../shared/etoiles/etoiles';
import { Favori } from '../../../shared/favori/favori';
import { Visuel } from '../../../shared/visuel/visuel';

/** Fiche d'un coach (US-S6) : spécialités, tarif, horaires, séances et avis. */
@Component({
  selector: 'app-coach-detail',
  imports: [RouterLink, AvisListe, LigneSeance, Etoiles, Favori, Visuel],
  templateUrl: './coach-detail.html',
  styleUrl: './coach-detail.css',

})
export class CoachDetail {
  auth = inject(Auth);
  private route = inject(ActivatedRoute);
  private catalogue = inject(Catalogue);

  vue = signal<Vue | null>(null);
  erreur = signal(false);

  jour = nomJour;
  heure = heure;

  coach = computed<ProfilCoach | undefined>(() => {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    return this.vue()?.d.coachs.find((c) => c.id === id);
  });
  nom = computed(() => this.vue()?.nomCoach(this.coach()) ?? '');
  tarif = computed(() => prix(this.coach()?.tarifHoraire));
  avis = computed(() => this.vue()?.avisCoach(this.coach()?.['@id']) ?? []);
  note = computed(() => (this.coach() ? (this.vue()?.noteCoach(this.coach()!) ?? null) : null));
  horaires = computed(() => this.vue()?.horairesCoach(this.coach()?.['@id']) ?? []);
  seances = computed(() => this.vue()?.seancesCoach(this.coach()?.['@id']).slice(0, 6) ?? []);
  salles = computed(() => (this.coach()?.salles ?? []).map((i) => this.vue()?.salle(iri(i))).filter((s) => !!s));

  constructor() {
    this.catalogue.tout().subscribe({
      next: (v) => {
        this.vue.set(v);
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (!v.d.coachs.some((c) => c.id === id)) this.erreur.set(true);
      },
      error: () => this.erreur.set(true),
    });
  }
}
