import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EMPTY, Observable, expand, map, reduce } from 'rxjs';
import { environment } from '../../environments/environment';
import { Page } from './models';

const LD = 'application/ld+json';

/** Chemins des ressources de l'API (à ajuster ici si /api les nomme autrement). */
export const CHEMINS = {
  activites: '/activites',
  equipements: '/equipements',
  salles: '/salles',
  horairesSalle: '/horaire_salles',
  photosSalle: '/photo_salles',
  coachs: '/profil_coaches',
  horairesCoach: '/horaire_coaches',
  seances: '/seances',
  disponibilites: '/disponibilites',
  reservations: '/reservations',
  avis: '/avis',
  utilisateurs: '/utilisateurs',
  moi: '/me',
} as const;

@Injectable({ providedIn: 'root' })
export class Api {
  private http = inject(HttpClient);
  readonly base = environment.apiUrl;
  private origine = new URL(environment.apiUrl).origin;

  /** Accepte un chemin ("/salles") ou une IRI renvoyée par l'API ("/api/salles/3"). */
  private url(cible: string): string {
    return cible.startsWith('/api/') ? this.origine + cible : this.base + cible;
  }

  get<T>(cible: string): Observable<T> {
    return this.http.get<T>(this.url(cible), { headers: { Accept: LD } });
  }

  /** Récupère toutes les pages d'une collection. */
  liste<T>(cible: string): Observable<T[]> {
    return this.page<T>(cible, 1).pipe(
      expand((p, i) => (p.suivante ? this.page<T>(cible, i + 2) : EMPTY)),
      reduce((tous, p) => tous.concat(p.items), [] as T[]),
    );
  }

  creer<T>(cible: string, corps: object): Observable<T> {
    return this.http.post<T>(this.url(cible), corps, {
      headers: { Accept: LD, 'Content-Type': LD },
    });
  }

  /** Envoi de fichiers (multipart/form-data) : le navigateur fixe lui-même le Content-Type. */
  envoyer<T>(cible: string, corps: FormData): Observable<T> {
    return this.http.post<T>(this.url(cible), corps, { headers: { Accept: LD } });
  }

  modifier<T>(cible: string, corps: object): Observable<T> {
    return this.http.patch<T>(this.url(cible), corps, {
      headers: { Accept: LD, 'Content-Type': 'application/merge-patch+json' },
    });
  }

  supprimer(cible: string): Observable<void> {
    return this.http.delete<void>(this.url(cible), { headers: { Accept: LD } });
  }

  private page<T>(cible: string, n: number): Observable<Page<T>> {
    const sep = cible.includes('?') ? '&' : '?';
    return this.http
      .get<any>(`${this.url(cible)}${sep}page=${n}`, { headers: { Accept: LD } })
      .pipe(
        map((r) => {
          const items: T[] = Array.isArray(r) ? r : (r.member ?? r['hydra:member'] ?? []);
          const vue = Array.isArray(r) ? null : (r.view ?? r['hydra:view']);
          return { items, suivante: !!vue?.next };
        }),
      );
  }
}
