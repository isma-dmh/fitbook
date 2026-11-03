import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/auth';

@Component({
  selector: 'app-connexion',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './connexion.html',
  styleUrl: './connexion.css',

})
export class Connexion {
  private fb = inject(FormBuilder).nonNullable;
  private auth = inject(Auth);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  session = this.route.snapshot.queryParamMap.get('session') === 'expiree';
  envoi = signal(false);
  erreur = signal('');
  nonConfirme = signal(false);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  invalide(champ: 'email' | 'password') {
    const c = this.form.controls[champ];
    return c.invalid && (c.touched || c.dirty);
  }

  envoyer() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.envoi.set(true);
    this.erreur.set('');
    const { email, password } = this.form.getRawValue();
    this.auth.connexion(email, password).subscribe({
      next: () => {
        const retour = this.route.snapshot.queryParamMap.get('retour');
        this.router.navigateByUrl(retour && retour.startsWith('/') ? retour : this.auth.accueilRole());
      },
      error: (e) => {
        this.envoi.set(false);
        const msg: string = e?.error?.message ?? '';
        this.nonConfirme.set(/confirm/i.test(msg));
        this.erreur.set(e?.status === 401 ? msg && !/invalid credentials/i.test(msg) ? msg : 'Email ou mot de passe incorrect.' : 'Connexion impossible pour le moment.');
      },
    });
  }
}
