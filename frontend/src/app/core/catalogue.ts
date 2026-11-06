import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map, of } from 'rxjs';
import { CHEMINS } from './api';
import { Donnees } from './donnees';
import { Activite, Avis, Disponibilite, Equipement, HoraireCoach, HoraireSalle, PhotoSalle, ProfilCoach, Salle, Seance } from './models';
import { debutSeance, estPassee, iri, moyenne, nomComplet } from './utils';

export interface Tout {
  salles: Salle[];
  activites: Activite[];
  equipements: Equipement[];
  coachs: ProfilCoach[];
  seances: Seance[];
  avis: Avis[];
  photos: PhotoSalle[];
  horairesSalle: HoraireSalle[];
  horairesCoach: HoraireCoach[];
  disponibilites: Disponibilite[];
}

/** S'assure que chaque élément porte son IRI, même si l'API ne l'a pas renvoyée. */
function avecIri<T extends { '@id'?: string; id: number }>(chemin: string, liste: T[]): T[] {
  return liste.map((e) => (e['@id'] ? e : { ...e, '@id': `/api${chemin}/${e.id}` }));
}

/** Vue en lecture seule sur les données publiques, avec les jointures utiles aux pages. */
export class Vue {
  private index = new Map<string, any>();

  constructor(readonly d: Tout) {
    for (const liste of [d.salles, d.activites, d.equipements, d.coachs, d.seances, d.avis, d.photos]) {
      for (const e of liste as { '@id'?: string }[]) if (e['@id']) this.index.set(e['@id'], e);
    }
  }

  salle(i: string | null | undefined): Salle | undefined {
    return i ? this.index.get(i) : undefined;
  }
  coach(i: string | null | undefined): ProfilCoach | undefined {
    return i ? this.index.get(i) : undefined;
  }
  activite(i: string | null | undefined): Activite | undefined {
    return i ? this.index.get(i) : undefined;
  }
  seance(i: string | null | undefined): Seance | undefined {
    return i ? this.index.get(i) : undefined;
  }
  equipement(i: string | null | undefined): Equipement | undefined {
    return i ? this.index.get(i) : undefined;
  }

  nomActivite(i: string | null | undefined): string {
    return this.activite(i)?.nom ?? '';
  }

  activitesSalle(s: Salle): string[] {
    return (s.activites ?? []).map((a) => this.nomActivite(iri(a))).filter(Boolean);
  }

  equipementsSalle(s: Salle): string[] {
    return (s.equipements ?? []).map((e) => this.equipement(iri(e))?.nom ?? '').filter(Boolean);
  }

  nomCoach(c: ProfilCoach | undefined | null): string {
    return (c && nomComplet(c.utilisateur)) || (c ? `Coach n°${c.id}` : '');
  }

  imageCoach(c: ProfilCoach | undefined | null): string | null {
    const u = c?.utilisateur;
    return u && typeof u !== 'string' ? (u.image ?? null) : null;
  }

  photosSalle(salleIri: string | undefined): PhotoSalle[] {
    return this.d.photos.filter((p) => iri(p.salle) === salleIri);
  }

  imageSalle(s: Salle): string | null {
    return this.photosSalle(s['@id'])[0]?.url ?? null;
  }

  avisSalle(salleIri: string | undefined): Avis[] {
    return this.d.avis.filter((a) => iri(a.salle) === salleIri);
  }
  avisCoach(coachIri: string | undefined): Avis[] {
    return this.d.avis.filter((a) => iri(a.profilCoach) === coachIri);
  }
  noteSalle(s: Salle): number | null {
    return moyenne(this.avisSalle(s['@id']).map((a) => a.note));
  }
  noteCoach(c: ProfilCoach): number | null {
    return moyenne(this.avisCoach(c['@id']).map((a) => a.note));
  }

  horairesSalle(salleIri: string | undefined): HoraireSalle[] {
    return this.d.horairesSalle.filter((h) => iri(h.salle) === salleIri).sort((a, b) => a.jourSemaine - b.jourSemaine);
  }
  horairesCoach(coachIri: string | undefined): HoraireCoach[] {
    return this.d.horairesCoach.filter((h) => iri(h.profilCoach) === coachIri).sort((a, b) => a.jourSemaine - b.jourSemaine);
  }

  /** Séances à venir et non annulées, de la plus proche à la plus lointaine. */
  seancesAVenir(filtre: (s: Seance) => boolean = () => true): Seance[] {
    return this.d.seances
      .filter((s) => s.statut !== 'annulee' && !estPassee(s) && filtre(s))
      .sort((a, b) => debutSeance(a).getTime() - debutSeance(b).getTime());
  }
  seancesSalle(salleIri: string | undefined): Seance[] {
    return this.seancesAVenir((s) => iri(s.salle) === salleIri);
  }
  seancesCoach(coachIri: string | undefined): Seance[] {
    return this.seancesAVenir((s) => iri(s.profilCoach) === coachIri);
  }

  places(s: Seance): number {
    return s.placesRestantes ?? Math.max(0, s.capacite - (s.reservations?.length ?? 0));
  }

  /** Ville de la séance : celle de la salle, sinon celle du coach. */
  villeSeance(s: Seance): string {
    return this.salle(iri(s.salle))?.ville ?? this.coach(iri(s.profilCoach))?.ville ?? '';
  }

  /** Lieu et intervenant d'une séance, pour l'affichage. */
  lieuSeance(s: Seance): string {
    const salle = this.salle(iri(s.salle));
    const coach = this.coach(iri(s.profilCoach));
    return [salle?.nom, coach ? this.nomCoach(coach) : ''].filter(Boolean).join(' · ');
  }
}

@Injectable({ providedIn: 'root' })
export class Catalogue {
  private donnees = inject(Donnees);

  /**
   * Charge les collections du catalogue. Les horaires et disponibilités ne servent qu'aux fiches détaillées
   * et aux espaces de gestion : on ne les demande (`complet`) que là, pour accélérer les autres pages.
   */
  tout(complet = false): Observable<Vue> {
    const d = this.donnees;
    return forkJoin({
      salles: d.liste<Salle>(CHEMINS.salles),
      activites: d.liste<Activite>(CHEMINS.activites),
      equipements: d.liste<Equipement>(CHEMINS.equipements),
      coachs: d.liste<ProfilCoach>(CHEMINS.coachs),
      seances: d.liste<Seance>(CHEMINS.seances),
      avis: d.liste<Avis>(CHEMINS.avis),
      photos: d.liste<PhotoSalle>(CHEMINS.photosSalle),
      horairesSalle: complet ? d.liste<HoraireSalle>(CHEMINS.horairesSalle) : of([] as HoraireSalle[]),
      horairesCoach: complet ? d.liste<HoraireCoach>(CHEMINS.horairesCoach) : of([] as HoraireCoach[]),
      disponibilites: complet ? d.liste<Disponibilite>(CHEMINS.disponibilites) : of([] as Disponibilite[]),
    }).pipe(
      map(
        (r) =>
          new Vue({
            salles: avecIri(CHEMINS.salles, r.salles),
            activites: avecIri(CHEMINS.activites, r.activites),
            equipements: avecIri(CHEMINS.equipements, r.equipements),
            coachs: avecIri(CHEMINS.coachs, r.coachs),
            seances: avecIri(CHEMINS.seances, r.seances),
            avis: avecIri(CHEMINS.avis, r.avis),
            photos: avecIri(CHEMINS.photosSalle, r.photos),
            horairesSalle: avecIri(CHEMINS.horairesSalle, r.horairesSalle),
            horairesCoach: avecIri(CHEMINS.horairesCoach, r.horairesCoach),
            disponibilites: avecIri(CHEMINS.disponibilites, r.disponibilites),
          }),
      ),
    );
  }

  invalider(...chemins: string[]) {
    this.donnees.invalider(...chemins);
  }
}
