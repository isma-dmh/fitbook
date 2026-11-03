import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Api, CHEMINS } from '../../../core/api';
import { Auth } from '../../../core/auth';
import { messageErreur } from '../../../core/utils';

/** Profil de l'utilisateur : consultation et modification (US-S1, US-S2, US-C1, US-C2). */
@Component({
  selector: 'app-compte',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './compte.html',
  styleUrl: './compte.css',

})
export class Compte {
  auth = inject(Auth);
  private api = inject(Api);
  private fb = inject(FormBuilder).nonNullable;

  envoi = signal(false);
  message = signal('');
  erreur = signal('');

  form = this.fb.group({
    prenom: ['', Validators.required],
    nom: ['', Validators.required],
    objectifs: [''],
    niveau: [''],
  });

  constructor() {
    effect(() => {
      const p = this.auth.profil();
      if (p)
        this.form.patchValue(
          { prenom: p.prenom ?? '', nom: p.nom ?? '', objectifs: p.objectifs ?? '', niveau: p.niveau ?? '' },
          { emitEvent: false },
        );
    });
  }

  libelleRole() {
    return { sportif: 'Sportif', coach: 'Coach', salle: 'Gestionnaire de salle', administrateur: 'Administrateur' }[this.auth.role() ?? 'sportif'];
  }

  choisirImage(e: Event) {
    const champ = e.target as HTMLInputElement;
    const fichier = champ.files?.[0];
    if (!fichier) return;
    const donnees = new FormData();
    donnees.append('fichier', fichier);
    this.erreur.set('');
    this.message.set('');
    this.api.envoyer(CHEMINS.moi + '/image', donnees).subscribe({
      next: () => {
        champ.value = '';
        this.message.set('Photo mise à jour.');
        this.auth.chargerProfil().subscribe();
      },
      error: (err) => this.erreur.set(messageErreur(err, "La photo n'a pas pu être envoyée.")),
    });
  }

  enregistrer() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.envoi.set(true);
    this.message.set('');
    this.erreur.set('');
    const v = this.form.getRawValue();
    const corps =
      this.auth.role() === 'sportif'
        ? { prenom: v.prenom, nom: v.nom, objectifs: v.objectifs || null, niveau: v.niveau || null }
        : { prenom: v.prenom, nom: v.nom };
    this.api.modifier(CHEMINS.moi, corps).subscribe({
      next: () => {
        this.envoi.set(false);
        this.message.set('Profil enregistré.');
        this.auth.chargerProfil().subscribe();
      },
      error: (e) => {
        this.envoi.set(false);
        this.erreur.set(messageErreur(e, "L'enregistrement a échoué."));
      },
    });
  }
}
