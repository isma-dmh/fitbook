import { Component, computed } from '@angular/core';
import { AvisListe } from '../../../shared/avis-liste/avis-liste';
import { iri } from '../../../core/utils';
import { BaseEspace } from '../base-espace';

/** Avis reçus par le coach ou la salle (US-C10, US-G10). */
@Component({
  selector: 'app-espace-avis',
  imports: [AvisListe],
  templateUrl: './espace-avis.html',
  styleUrl: './espace-avis.css',

})
export class EspaceAvis extends BaseEspace {
  avis = computed(() => {
    const v = this.vue();
    const c = this.cible();
    if (!v || !c) return [];
    return this.espace === 'coach' ? v.avisCoach(c) : v.avisSalle(c);
  });
  note = computed(() => {
    const a = this.avis();
    return a.length ? a.reduce((t, x) => t + x.note, 0) / a.length : null;
  });
}
