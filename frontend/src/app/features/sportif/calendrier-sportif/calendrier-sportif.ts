import { Component, computed, inject, signal } from '@angular/core';
import { Api, CHEMINS } from '../../../core/api';
import { Catalogue, Vue } from '../../../core/catalogue';
import { Reservation } from '../../../core/models';
import { heure, iri, jour } from '../../../core/utils';
import { Calendrier, EvenementCal } from '../../../shared/calendrier/calendrier';

/** Calendrier des réservations du sportif (US-S17). */
@Component({
  selector: 'app-calendrier-sportif',
  imports: [Calendrier],
  templateUrl: './calendrier-sportif.html',
  styleUrl: './calendrier-sportif.css',

})
export class CalendrierSportif {
  private api = inject(Api);
  private catalogue = inject(Catalogue);

  vue = signal<Vue | null>(null);
  reservations = signal<Reservation[]>([]);
  pret = signal(false);
  erreur = signal(false);

  evenements = computed<EvenementCal[]>(() => {
    const v = this.vue();
    if (!v) return [];
    return this.reservations()
      .filter((r) => r.statut !== 'annulee')
      .flatMap((r) => {
        const s = v.seance(iri(r.seance));
        if (!s) return [];
        return [
          {
            date: jour(s.dateSeance),
            titre: `${heure(s.heureDebut)} ${v.nomActivite(s.activite)}`,
            sous: v.lieuSeance(s),
            lien: `/seances/${s.id}`,
            type: 'reservation' as const,
          },
        ];
      });
  });

  constructor() {
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
}
