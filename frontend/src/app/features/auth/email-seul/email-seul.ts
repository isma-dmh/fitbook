import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Auth } from '../../../core/auth';
import { messageErreur } from '../../../core/utils';

/** Formulaire à un seul champ email : renvoi du lien de confirmation (US-T4) ou mot de passe oublié (US-T7). */
@Component({
  selector: 'app-email-seul',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './email-seul.html',
  styleUrl: './email-seul.css',

})
export class EmailSeul {
  private fb = inject(FormBuilder).nonNullable;
  private auth = inject(Auth);
  private mode = inject(ActivatedRoute).snapshot.data['mode'] as 'confirmation' | 'motdepasse';

  titre = this.mode === 'confirmation' ? "Renvoyer l'email de confirmation" : 'Mot de passe oublié';
  intro =
    this.mode === 'confirmation'
      ? 'Saisissez votre adresse : nous vous envoyons un nouveau lien de confirmation.'
      : 'Saisissez votre adresse : nous vous envoyons un lien pour choisir un nouveau mot de passe.';
  confirmation = 'Si un compte correspond à cette adresse, un email vient d\'être envoyé.';

  envoi = signal(false);
  envoye = signal(false);
  erreur = signal('');
  form = this.fb.group({ email: ['', [Validators.required, Validators.email]] });

  envoyer() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.envoi.set(true);
    this.erreur.set('');
    const { email } = this.form.getRawValue();
    const appel = this.mode === 'confirmation' ? this.auth.renvoyerConfirmation(email) : this.auth.motDePasseOublie(email);
    appel.subscribe({
      next: () => {
        this.envoi.set(false);
        this.envoye.set(true);
      },
      error: (e) => {
        this.envoi.set(false);
        this.erreur.set(messageErreur(e, "L'envoi a échoué."));
      },
    });
  }
}
