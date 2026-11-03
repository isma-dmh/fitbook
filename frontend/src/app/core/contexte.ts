import { Injectable, inject, signal } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CHEMINS } from './api';
import { Auth } from './auth';
import { Donnees } from './donnees';
import { ProfilCoach, Salle } from './models';
import { idDe } from './utils';

const CLE_SALLE = 'fitbook_salle';

/** Données de l'espace professionnel : profil coach ou salles gérées par l'utilisateur connecté. */
@Injectable({ providedIn: 'root' })
export class Contexte {
  private auth = inject(Auth);
  private donnees = inject(Donnees);

  readonly sallesGerees = signal<Salle[]>([]);
  readonly salleCourante = signal<Salle | null>(null);
  readonly profilCoach = signal<ProfilCoach | null>(null);

  chargerCoach(): Observable<ProfilCoach | null> {
    return this.donnees.liste<ProfilCoach>(CHEMINS.coachs).pipe(
      map((liste) => {
        const moi = this.auth.profil()?.id;
        const p = (moi != null && liste.find((c) => idDe(c.utilisateur) === moi)) || null;
        this.profilCoach.set(p);
        return p;
      }),
    );
  }

  chargerSalles(): Observable<Salle[]> {
    return this.donnees.liste<Salle>(CHEMINS.salles).pipe(
      map((liste) => {
        const moi = this.auth.profil()?.id;
        const miennes = this.auth.role() === 'administrateur' ? liste : liste.filter((s) => moi != null && idDe(s.gestionnaire) === moi);
        this.sallesGerees.set(miennes);
        let choisie: Salle | undefined;
        try {
          const id = Number(localStorage.getItem(CLE_SALLE));
          choisie = miennes.find((s) => s.id === id);
        } catch {
          /* ignoré */
        }
        this.salleCourante.set(choisie ?? miennes[0] ?? null);
        return miennes;
      }),
    );
  }

  choisirSalle(id: number): void {
    const s = this.sallesGerees().find((x) => x.id === id) ?? null;
    this.salleCourante.set(s);
    try {
      localStorage.setItem(CLE_SALLE, String(id));
    } catch {
      /* ignoré */
    }
  }

  recharger(): void {
    this.donnees.invalider(CHEMINS.coachs, CHEMINS.salles);
    if (this.auth.role() === 'coach') this.chargerCoach().subscribe();
    else this.chargerSalles().subscribe();
  }
}
