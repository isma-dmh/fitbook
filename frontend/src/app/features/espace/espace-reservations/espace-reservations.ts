import { Component, computed, signal } from '@angular/core';
import { CHEMINS } from '../../../core/api';
import { Reservation } from '../../../core/models';
import { heure, iri, jourFr, messageErreur, nomComplet } from '../../../core/utils';
import { BaseEspace } from '../base-espace';

/** Réservations reçues sur les séances du coach ou de la salle (US-C9, US-G9). */
@Component({
  selector: 'app-espace-reservations',
  templateUrl: './espace-reservations.html',
  styleUrl: './espace-reservations.css',

})
export class EspaceReservations extends BaseEspace {
  jourFr = jourFr;
  heure = heure;
  nomComplet = nomComplet;
  reservations = signal<Reservation[] | null>(null);

  lignes = computed(() => {
    const v = this.vue();
    const c = this.cible();
    const rs = this.reservations();
    if (!v || !c || !rs) return [];
    return rs
      .map((r) => ({ ...r, seanceObj: v.seance(iri(r.seance)) }))
      .filter((r) => r.seanceObj && iri(this.espace === 'coach' ? r.seanceObj.profilCoach : r.seanceObj.salle) === c)
      .sort((a, b) => (b.seanceObj!.dateSeance + b.seanceObj!.heureDebut).localeCompare(a.seanceObj!.dateSeance + a.seanceObj!.heureDebut));
  });

  constructor() {
    super();
    this.recharger();
  }

  private recharger() {
    this.api.liste<Reservation>(CHEMINS.reservations).subscribe({
      next: (l) => this.reservations.set(l),
      error: () => this.reservations.set([]),
    });
  }

  annuler(r: Reservation) {
    if (!confirm('Annuler cette réservation ?')) return;
    this.message.set('');
    this.api.modifier(r['@id'] ?? `/api${CHEMINS.reservations}/${r.id}`, { statut: 'annulee' }).subscribe({
      next: () => this.recharger(),
      error: (e) => this.message.set(messageErreur(e, "L'annulation a échoué.")),
    });
  }
}
