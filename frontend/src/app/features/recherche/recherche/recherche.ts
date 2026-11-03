import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Catalogue, Vue } from '../../../core/catalogue';
import { ProfilCoach, Salle, Seance } from '../../../core/models';
import { iri, jour, norm } from '../../../core/utils';
import { CarteCoach } from '../../../shared/carte-coach/carte-coach';
import { CarteSalle } from '../../../shared/carte-salle/carte-salle';
import { LigneSeance } from '../../../shared/ligne-seance/ligne-seance';

type Type = 'salles' | 'coachs' | 'seances';

/** Recherche et filtres (US-S3, US-S4, US-S7, US-T1) : sert aussi de liste des salles, des coachs et des séances. */
@Component({
  selector: 'app-recherche',
  imports: [FormsModule, CarteSalle, CarteCoach, LigneSeance],
  templateUrl: './recherche.html',
  styleUrl: './recherche.css',

})
export class Recherche {
  private catalogue = inject(Catalogue);
  private route = inject(ActivatedRoute);

  type = signal<Type>((this.route.snapshot.data['type'] ?? this.route.snapshot.queryParamMap.get('type') ?? 'salles') as Type);
  q = signal(this.route.snapshot.queryParamMap.get('q') ?? '');
  ville = signal('');
  activite = signal('');
  noteMin = signal(0);
  prixMax = signal<number | null>(null);
  date = signal('');
  placesSeules = signal(false);

  vue = signal<Vue | null>(null);
  erreur = signal(false);

  titre = computed(() => ({ salles: 'Salles', coachs: 'Coachs', seances: 'Séances' })[this.type()]);

  salles = computed<Salle[]>(() => {
    const v = this.vue();
    if (!v) return [];
    const q = norm(this.q());
    return v.d.salles.filter((s) => {
      const activites = v.activitesSalle(s);
      if (q && ![s.nom, s.ville, s.adresse, ...activites].some((t) => norm(t).includes(q))) return false;
      if (this.ville() && !norm(s.ville).includes(norm(this.ville()))) return false;
      if (this.activite() && !(s.activites ?? []).some((a) => iri(a) === this.activite())) return false;
      if (this.noteMin() && (v.noteSalle(s) ?? 0) < this.noteMin()) return false;
      return true;
    });
  });

  coachs = computed<ProfilCoach[]>(() => {
    const v = this.vue();
    if (!v) return [];
    const q = norm(this.q());
    const nomActivite = norm(v.nomActivite(this.activite()));
    return v.d.coachs.filter((c) => {
      if (q && ![v.nomCoach(c), c.specialites, c.ville].some((t) => norm(t).includes(q))) return false;
      if (this.ville() && !norm(c.ville).includes(norm(this.ville()))) return false;
      if (this.activite() && !norm(c.specialites).includes(nomActivite)) return false;
      if (this.noteMin() && (v.noteCoach(c) ?? 0) < this.noteMin()) return false;
      if (this.prixMax() != null && c.tarifHoraire > this.prixMax()!) return false;
      return true;
    });
  });

  seances = computed<Seance[]>(() => {
    const v = this.vue();
    if (!v) return [];
    const q = norm(this.q());
    return v.seancesAVenir((s) => {
      const salle = v.salle(iri(s.salle));
      const coach = v.coach(iri(s.profilCoach));
      if (q && ![v.nomActivite(s.activite), salle?.nom, salle?.ville, v.nomCoach(coach), coach?.ville].some((t) => norm(t).includes(q))) return false;
      if (this.ville() && !norm(v.villeSeance(s)).includes(norm(this.ville()))) return false;
      if (this.activite() && s.activite !== this.activite()) return false;
      if (this.prixMax() != null && s.prix > this.prixMax()!) return false;
      if (this.date() && jour(s.dateSeance) !== this.date()) return false;
      if (this.placesSeules() && v.places(s) <= 0) return false;
      if (this.noteMin()) {
        const note = salle ? v.noteSalle(salle) : coach ? v.noteCoach(coach) : null;
        if ((note ?? 0) < this.noteMin()) return false;
      }
      return true;
    });
  });

  nombre = computed(() => ({ salles: this.salles, coachs: this.coachs, seances: this.seances })[this.type()]().length);

  constructor() {
    this.catalogue.tout().subscribe({
      next: (v) => this.vue.set(v),
      error: () => this.erreur.set(true),
    });
  }

  reinitialiser() {
    this.q.set('');
    this.ville.set('');
    this.activite.set('');
    this.noteMin.set(0);
    this.prixMax.set(null);
    this.date.set('');
    this.placesSeules.set(false);
  }
}
