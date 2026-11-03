import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Api, CHEMINS } from '../../../core/api';
import { Catalogue } from '../../../core/catalogue';
import { Contexte } from '../../../core/contexte';
import { Salle } from '../../../core/models';
import { iri, messageErreur } from '../../../core/utils';

/** Profil professionnel du coach : création et modification (US-C1, US-C2). */
@Component({
  selector: 'app-profil-coach',
  imports: [ReactiveFormsModule],
  templateUrl: './profil-coach.html',
  styleUrl: './profil-coach.css',

})
export class ProfilCoachPage {
  ctx = inject(Contexte);
  private api = inject(Api);
  private catalogue = inject(Catalogue);
  private fb = inject(FormBuilder).nonNullable;

  salles = signal<Salle[]>([]);
  choisies = signal<string[]>([]);
  envoi = signal(false);
  message = signal('');
  erreur = signal('');

  form = this.fb.group({
    presentation: ['', Validators.required],
    specialites: ['', Validators.required],
    tarifHoraire: [0, [Validators.required, Validators.min(0)]],
    ville: ['', Validators.required],
  });

  constructor() {
    this.catalogue.tout().subscribe((v) => this.salles.set(v.d.salles));
    effect(() => {
      const p = this.ctx.profilCoach();
      if (p) {
        this.form.patchValue({ presentation: p.presentation, specialites: p.specialites, tarifHoraire: p.tarifHoraire, ville: p.ville }, { emitEvent: false });
        this.choisies.set((p.salles ?? []).map((s) => iri(s)!));
      }
    });
  }

  invalide(c: 'presentation' | 'specialites' | 'tarifHoraire' | 'ville') {
    const x = this.form.controls[c];
    return x.invalid && (x.touched || x.dirty);
  }

  basculer(i: string) {
    this.choisies.update((l) => (l.includes(i) ? l.filter((x) => x !== i) : [...l, i]));
  }

  enregistrer() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.envoi.set(true);
    this.message.set('');
    this.erreur.set('');
    const corps = { ...this.form.getRawValue(), salles: this.choisies() };
    const p = this.ctx.profilCoach();
    // À la création, le serveur rattache le profil à l'utilisateur connecté.
    const appel = p ? this.api.modifier(p['@id'] ?? `/api${CHEMINS.coachs}/${p.id}`, corps) : this.api.creer(CHEMINS.coachs, corps);
    appel.subscribe({
      next: () => {
        this.envoi.set(false);
        this.message.set('Profil enregistré.');
        this.catalogue.invalider();
        this.ctx.recharger();
      },
      error: (e) => {
        this.envoi.set(false);
        this.erreur.set(messageErreur(e, "L'enregistrement a échoué."));
      },
    });
  }
}
