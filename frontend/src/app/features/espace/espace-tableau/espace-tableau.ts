import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CHEMINS } from '../../../core/api';
import { Reservation } from '../../../core/models';
import { heure, iri, jourCourt, moyenne } from '../../../core/utils';
import { BaseEspace } from '../base-espace';

/** Tableau de bord du coach ou de la salle (maquettes 12 et 14). */
@Component({
  selector: 'app-espace-tableau',
  imports: [RouterLink],
  templateUrl: './espace-tableau.html',
  styleUrl: './espace-tableau.css',

})
export class EspaceTableau extends BaseEspace {
  jour = jourCourt;
  heure = heure;
  private reservations = signal<Reservation[]>([]);

  base = computed(() => (this.espace === 'coach' ? '/coach' : '/salle'));

  prochaines = computed(() => {
    const v = this.vue();
    const c = this.cible();
    if (!v || !c) return [];
    return v.seancesAVenir((s) => iri(this.espace === 'coach' ? s.profilCoach : s.salle) === c);
  });

  inscrits = computed(() => {
    const v = this.vue();
    const c = this.cible();
    if (!v || !c) return 0;
    return this.reservations().filter((r) => {
      const s = v.seance(iri(r.seance));
      return r.statut !== 'annulee' && !!s && iri(this.espace === 'coach' ? s.profilCoach : s.salle) === c;
    }).length;
  });

  noteTexte = computed(() => {
    const v = this.vue();
    const c = this.cible();
    if (!v || !c) return '—';
    const avis = this.espace === 'coach' ? v.avisCoach(c) : v.avisSalle(c);
    const m = moyenne(avis.map((a) => a.note));
    return m === null ? '—' : String(m).replace('.', ',');
  });

  constructor() {
    super();
    this.api.liste<Reservation>(CHEMINS.reservations).subscribe({ next: (l) => this.reservations.set(l), error: () => undefined });
  }
}
