import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Catalogue, Vue } from '../../../core/catalogue';
import { CarteCoach } from '../../../shared/carte-coach/carte-coach';
import { CarteSalle } from '../../../shared/carte-salle/carte-salle';

@Component({
  selector: 'app-home',
  imports: [FormsModule, RouterLink, CarteSalle, CarteCoach],
  templateUrl: './home.html',
  styleUrl: './home.css',

})
export class Home {
  private catalogue = inject(Catalogue);
  private router = inject(Router);

  q = '';
  vue = signal<Vue | null>(null);
  erreur = signal(false);

  salles = computed(() => {
    const v = this.vue();
    return v ? [...v.d.salles].sort((a, b) => (v.noteSalle(b) ?? 0) - (v.noteSalle(a) ?? 0)).slice(0, 4) : [];
  });
  coachs = computed(() => {
    const v = this.vue();
    return v ? [...v.d.coachs].sort((a, b) => (v.noteCoach(b) ?? 0) - (v.noteCoach(a) ?? 0)).slice(0, 3) : [];
  });

  constructor() {
    this.catalogue.tout().subscribe({
      next: (v) => this.vue.set(v),
      error: () => this.erreur.set(true),
    });
  }

  rechercher() {
    this.router.navigate(['/recherche'], { queryParams: this.q.trim() ? { q: this.q.trim() } : {} });
  }
}
