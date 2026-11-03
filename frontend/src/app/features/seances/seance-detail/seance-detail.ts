import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Api, CHEMINS } from '../../../core/api';
import { Auth } from '../../../core/auth';
import { Catalogue, Vue } from '../../../core/catalogue';
import { Reservation, Seance } from '../../../core/models';
import { estPassee, heure, iri, jourFr, messageErreur, prix } from '../../../core/utils';
import { Favori } from '../../../shared/favori/favori';

/** Détail d'une séance et réservation (US-S8, US-S9). */
@Component({
  selector: 'app-seance-detail',
  imports: [RouterLink, Favori],
  templateUrl: './seance-detail.html',
  styleUrl: './seance-detail.css',

})
export class SeanceDetail {
  auth = inject(Auth);
  private api = inject(Api);
  private route = inject(ActivatedRoute);
  private catalogue = inject(Catalogue);

  vue = signal<Vue | null>(null);
  erreur = signal(false);
  envoi = signal(false);
  message = signal('');
  reservee = signal(false);

  seance = computed<Seance | undefined>(() => {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    return this.vue()?.d.seances.find((s) => s.id === id);
  });
  salle = computed(() => this.vue()?.salle(iri(this.seance()?.salle)));
  coach = computed(() => this.vue()?.coach(iri(this.seance()?.profilCoach)));
  places = computed(() => (this.seance() ? (this.vue()?.places(this.seance()!) ?? 0) : 0));
  passee = computed(() => (this.seance() ? estPassee(this.seance()!) : false));
  jour = computed(() => jourFr(this.seance()?.dateSeance));
  heureDebut = computed(() => heure(this.seance()?.heureDebut));
  tarif = computed(() => prix(this.seance()?.prix));

  constructor() {
    this.charger();
  }

  private charger() {
    this.catalogue.tout().subscribe({
      next: (v) => {
        this.vue.set(v);
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (!v.d.seances.some((s) => s.id === id)) this.erreur.set(true);
      },
      error: () => this.erreur.set(true),
    });
  }

  reserver() {
    const s = this.seance();
    if (!s?.['@id']) return;
    this.envoi.set(true);
    this.message.set('');
    // Le serveur renseigne le sportif, le statut et contrôle la capacité.
    this.api.creer<Reservation>(CHEMINS.reservations, { seance: s['@id'] }).subscribe({
      next: () => {
        this.envoi.set(false);
        this.reservee.set(true);
        this.catalogue.invalider();
        this.charger();
      },
      error: (e) => {
        this.envoi.set(false);
        this.message.set(
          e.status === 409 ? (messageErreur(e) || 'Cette séance est complète ou déjà réservée.') : messageErreur(e, 'La réservation a échoué.'),
        );
      },
    });
  }
}
