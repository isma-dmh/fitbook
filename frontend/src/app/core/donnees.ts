import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { Api } from './api';

/** Collections complètes de l'API, mises en cache pour éviter les appels répétés. */
@Injectable({ providedIn: 'root' })
export class Donnees {
  private api = inject(Api);
  private cache = new Map<string, Observable<any[]>>();

  liste<T>(chemin: string): Observable<T[]> {
    let obs = this.cache.get(chemin);
    if (!obs) {
      obs = this.api.liste<T>(chemin).pipe(shareReplay({ bufferSize: 1, refCount: false }));
      this.cache.set(chemin, obs);
    }
    return obs as Observable<T[]>;
  }

  /** À appeler après une création, une modification ou une suppression. */
  invalider(...chemins: string[]): void {
    if (!chemins.length) this.cache.clear();
    else chemins.forEach((c) => this.cache.delete(c));
  }
}
