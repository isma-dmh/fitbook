import { Component, computed, inject, signal } from '@angular/core';
import { Catalogue, Vue } from '../../../core/catalogue';
import { Favoris } from '../../../core/favoris';
import { CarteCoach } from '../../../shared/carte-coach/carte-coach';
import { CarteSalle } from '../../../shared/carte-salle/carte-salle';
import { LigneSeance } from '../../../shared/ligne-seance/ligne-seance';

/** Liste des favoris du sportif (US-S14). */
@Component({
  selector: 'app-favoris',
  imports: [CarteSalle, CarteCoach, LigneSeance],
  templateUrl: './favoris.html',
  styleUrl: './favoris.css',

})
export class FavorisPage {
  private favoris = inject(Favoris);
  private catalogue = inject(Catalogue);

  vue = signal<Vue | null>(null);
  erreur = signal(false);

  salles = computed(() => this.vue()?.d.salles.filter((s) => this.favoris.estFavori('salles', s['@id']!)) ?? []);
  coachs = computed(() => this.vue()?.d.coachs.filter((c) => this.favoris.estFavori('coachs', c['@id']!)) ?? []);
  seances = computed(() => this.vue()?.d.seances.filter((s) => this.favoris.estFavori('seances', s['@id']!)) ?? []);

  constructor() {
    this.catalogue.tout().subscribe({
      next: (v) => this.vue.set(v),
      error: () => this.erreur.set(true),
    });
  }
}
