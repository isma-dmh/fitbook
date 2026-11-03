import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Auth } from '../../core/auth';
import { initiales } from '../../core/utils';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css',

})
export class PublicLayout {
  auth = inject(Auth);
  private router = inject(Router);
  menu = signal(false);
  lettres = computed(() => initiales(this.auth.nomAffiche()));

  deconnexion() {
    this.auth.deconnexion();
    this.router.navigateByUrl('/');
  }
}
