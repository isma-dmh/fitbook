import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Api, CHEMINS } from '../../../core/api';
import { Catalogue, Vue } from '../../../core/catalogue';
import { Reservation, Seance } from '../../../core/models';
import { debutSeance, estPassee, heure, iri, jourFr, messageErreur } from '../../../core/utils';

/** Historique et annulation des réservations (US-S10, US-S11). */
@Component({
  selector: 'app-mes-reservations',
  imports: [RouterLink],
  templateUrl: './mes-reservations.html',
  styleUrl: './mes-reservations.css',

})
export class MesReservations {
  private api = inject(Api);
  private catalogue = inject(Catalogue);

  reservations = signal<Reservation[]>([]);
  vue = signal<Vue | null>(null);
  pret = signal(false);
  erreur = signal(false);
  message = signal('');
  onglet = signal<'avenir' | 'historique'>('avenir');

  jourFr = jourFr;
  heure = heure;

  private triees = computed(() =>
    this.reservations()
      .map((r) => ({ r, s: this.seance(r) }))
      .sort((a, b) => (a.s ? debutSeance(a.s).getTime() : 0) - (b.s ? debutSeance(b.s).getTime() : 0)),
  );
  avenir = computed(() => this.triees().filter((x) => x.r.statut !== 'annulee' && x.s && !estPassee(x.s)).map((x) => x.r));
  historique = computed(() =>
    this.triees().filter((x) => !(x.r.statut !== 'annulee' && x.s && !estPassee(x.s))).map((x) => x.r).reverse(),
  );
  affichees = computed(() => (this.onglet() === 'avenir' ? this.avenir() : this.historique()));

  constructor() {
    this.charger();
  }

  private charger() {
    this.catalogue.tout().subscribe({
      next: (v) => {
        this.vue.set(v);
        this.api.liste<Reservation>(CHEMINS.reservations).subscribe({
          next: (l) => {
            this.reservations.set(l);
            this.pret.set(true);
          },
          error: () => this.erreur.set(true),
        });
      },
      error: () => this.erreur.set(true),
    });
  }

  seance(r: Reservation): Seance | undefined {
    return this.vue()?.seance(iri(r.seance));
  }
  titre(r: Reservation) {
    return this.vue()?.nomActivite(this.seance(r)?.activite) ?? '';
  }
  lieu(r: Reservation) {
    const s = this.seance(r);
    return s ? (this.vue()?.lieuSeance(s) ?? '') : '';
  }
  passee(r: Reservation) {
    const s = this.seance(r);
    return !!s && estPassee(s);
  }
  salleId(r: Reservation): number | null {
    return this.vue()?.salle(iri(this.seance(r)?.salle))?.id ?? null;
  }
  peutAnnuler(r: Reservation) {
    return r.statut !== 'annulee' && !this.passee(r);
  }

  annuler(r: Reservation) {
    if (!confirm('Annuler cette réservation ?')) return;
    this.message.set('');
    this.api.modifier<Reservation>(r['@id'] ?? `/api${CHEMINS.reservations}/${r.id}`, { statut: 'annulee' }).subscribe({
      next: () => {
        this.catalogue.invalider();
        this.charger();
      },
      error: (e) => this.message.set(messageErreur(e, "L'annulation a échoué.")),
    });
  }
}
