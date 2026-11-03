import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Auth } from '../../../core/auth';
import { messageErreur } from '../../../core/utils';

function identiques(g: AbstractControl): ValidationErrors | null {
  return g.get('password')?.value === g.get('confirmation')?.value ? null : { different: true };
}

/** Page ouverte depuis l'email : /reinitialiser-mot-de-passe?token=... */
@Component({
  selector: 'app-mdp-reset',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './mdp-reset.html',
  styleUrl: './mdp-reset.css',

})
export class MdpReset {
  private fb = inject(FormBuilder).nonNullable;
  private auth = inject(Auth);
  token = inject(ActivatedRoute).snapshot.queryParamMap.get('token');

  envoi = signal(false);
  fait = signal(false);
  erreur = signal('');

  form = this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmation: ['', Validators.required],
    },
    { validators: identiques },
  );

  envoyer() {
    this.form.markAllAsTouched();
    if (this.form.invalid || !this.token) return;
    this.envoi.set(true);
    this.erreur.set('');
    this.auth.reinitialiser(this.token, this.form.getRawValue().password).subscribe({
      next: () => {
        this.envoi.set(false);
        this.fait.set(true);
      },
      error: (e) => {
        this.envoi.set(false);
        this.erreur.set(messageErreur(e, 'Le lien est invalide ou expiré.'));
      },
    });
  }
}
