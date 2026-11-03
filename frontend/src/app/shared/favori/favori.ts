import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../core/auth';
import { Favoris, TypeFavori } from '../../core/favoris';

/** Bouton cœur pour ajouter ou retirer un favori (US-S13). */
@Component({
  selector: 'app-favori',
  templateUrl: './favori.html',
  styleUrl: './favori.css',

})
export class Favori {
  private favoris = inject(Favoris);
  private auth = inject(Auth);
  private router = inject(Router);

  type = input.required<TypeFavori>();
  cible = input.required<string | undefined>();

  /** Les favoris sont réservés aux sportifs ; les visiteurs sont invités à se connecter. */
  visible = computed(() => !this.auth.estConnecte() || this.auth.role() === 'sportif');
  actif = computed(() => {
    const c = this.cible();
    return !!c && this.favoris.estFavori(this.type(), c);
  });

  cliquer(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    const c = this.cible();
    if (!c) return;
    if (!this.auth.estConnecte()) {
      this.router.navigate(['/connexion'], { queryParams: { retour: this.router.url } });
      return;
    }
    this.favoris.basculer(this.type(), c);
  }
}
