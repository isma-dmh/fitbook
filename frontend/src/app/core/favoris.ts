import { Injectable, computed, inject } from '@angular/core';
import { Api, CHEMINS } from './api';
import { Auth } from './auth';

export type TypeFavori = 'salles' | 'coachs' | 'seances';

const CHAMP = {
  salles: 'favorisSalles',
  coachs: 'favorisCoachs',
  seances: 'favorisSeances',
} as const;

/** Favoris du sportif connecté (US-S13, US-S14), stockés dans son profil (/me). */
@Injectable({ providedIn: 'root' })
export class Favoris {
  private api = inject(Api);
  private auth = inject(Auth);

  readonly disponible = computed(() => this.auth.role() === 'sportif' && this.auth.profil() !== null);

  liste(type: TypeFavori): string[] {
    return this.auth.profil()?.[CHAMP[type]] ?? [];
  }

  estFavori(type: TypeFavori, iri: string): boolean {
    return this.liste(type).includes(iri);
  }

  basculer(type: TypeFavori, iri: string): void {
    const profil = this.auth.profil();
    if (!profil) return;
    const actuels = this.liste(type);
    const nouveaux = actuels.includes(iri) ? actuels.filter((i) => i !== iri) : [...actuels, iri];
    this.auth.profil.set({ ...profil, [CHAMP[type]]: nouveaux });
    this.api.modifier(CHEMINS.moi, { [CHAMP[type]]: nouveaux }).subscribe({
      error: () => this.auth.profil.set(profil),
    });
  }
}
