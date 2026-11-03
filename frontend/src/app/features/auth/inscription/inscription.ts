import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Auth, DonneesInscription } from '../../../core/auth';
import { messageErreur } from '../../../core/utils';

@Component({
  selector: 'app-inscription',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './inscription.html',
  styleUrl: './inscription.css',

})
export class Inscription {
  private fb = inject(FormBuilder).nonNullable;
  private auth = inject(Auth);

  roles: { valeur: DonneesInscription['role']; libelle: string }[] = [
    { valeur: 'sportif', libelle: 'Sportif' },
    { valeur: 'coach', libelle: 'Coach' },
    { valeur: 'salle', libelle: 'Gestionnaire de salle' },
  ];

  envoi = signal(false);
  erreur = signal('');
  reussi = signal('');

  form = this.fb.group({
    role: this.fb.control<DonneesInscription['role']>('sportif'),
    prenom: ['', Validators.required],
    nom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  invalide(champ: 'prenom' | 'nom' | 'email' | 'password') {
    const c = this.form.controls[champ];
    return c.invalid && (c.touched || c.dirty);
  }

  envoyer() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.envoi.set(true);
    this.erreur.set('');
    this.auth.inscription(this.form.getRawValue()).subscribe({
      next: (r) => {
        this.envoi.set(false);
        this.reussi.set(r.message ?? 'Compte créé, vérifiez votre boîte mail.');
      },
      error: (e) => {
        this.envoi.set(false);
        this.erreur.set(e?.status === 409 ? 'Cette adresse email est déjà utilisée.' : messageErreur(e, "L'inscription a échoué."));
      },
    });
  }
}
