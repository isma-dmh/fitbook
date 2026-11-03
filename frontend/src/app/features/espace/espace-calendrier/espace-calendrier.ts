import { Component, computed } from '@angular/core';
import { Calendrier, EvenementCal } from '../../../shared/calendrier/calendrier';
import { debutSeance, heure, iri, jour } from '../../../core/utils';
import { BaseEspace } from '../base-espace';

/** Calendrier des séances et disponibilités (US-C8, US-G8). */
@Component({
  selector: 'app-espace-calendrier',
  imports: [Calendrier],
  templateUrl: './espace-calendrier.html',
  styleUrl: './espace-calendrier.css',

})
export class EspaceCalendrier extends BaseEspace {
  evenements = computed<EvenementCal[]>(() => {
    const v = this.vue();
    const c = this.cible();
    if (!v || !c) return [];
    const de = (x: { profilCoach?: string | null; salle?: string | null }) => iri(this.espace === 'coach' ? x.profilCoach : x.salle) === c;
    const seances: EvenementCal[] = v.d.seances
      .filter(de)
      .sort((a, b) => debutSeance(a).getTime() - debutSeance(b).getTime())
      .map((s) => ({
        date: jour(s.dateSeance),
        titre: `${heure(s.heureDebut)} ${v.nomActivite(s.activite)}`,
        sous: `${s.statut === 'annulee' ? 'Annulée · ' : ''}${s.capacite - v.places(s)}/${s.capacite} inscrits`,
        type: 'seance',
      }));
    const dispos: EvenementCal[] = v.d.disponibilites.filter(de).map((d) => ({
      date: jour(d.dateDispo),
      titre: `${heure(d.heureDebut)}-${heure(d.heureFin)} ${d.type === 'bloque' ? 'Bloqué' : 'Dispo'}`,
      type: d.type === 'bloque' ? 'blocage' : 'dispo',
    }));
    return [...seances, ...dispos];
  });
}
