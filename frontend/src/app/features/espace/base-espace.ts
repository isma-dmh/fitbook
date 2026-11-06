import { computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Api } from '../../core/api';
import { Auth } from '../../core/auth';
import { Catalogue, Vue } from '../../core/catalogue';
import { Contexte } from '../../core/contexte';

/** Base commune aux pages des espaces coach et salle : mode, cible (profil coach ou salle) et données. */
export abstract class BaseEspace {
  protected api = inject(Api);
  protected auth = inject(Auth);
  protected ctx = inject(Contexte);
  protected catalogue = inject(Catalogue);

  readonly espace: 'coach' | 'salle' = inject(ActivatedRoute).snapshot.data['espace'];
  readonly vue = signal<Vue | null>(null);
  readonly erreur = signal('');
  readonly message = signal('');

  /** IRI du profil coach ou de la salle courante, selon l'espace. */
  readonly cible = computed<string | null>(() =>
    this.espace === 'coach' ? (this.ctx.profilCoach()?.['@id'] ?? null) : (this.ctx.salleCourante()?.['@id'] ?? null),
  );

  constructor() {
    this.charger();
  }

  protected charger(): void {
    this.catalogue.tout(true).subscribe({
      next: (v) => this.vue.set(v),
      error: () => this.erreur.set('Impossible de charger les données.'),
    });
  }

  protected rafraichir(): void {
    this.catalogue.invalider();
    this.charger();
  }
}
