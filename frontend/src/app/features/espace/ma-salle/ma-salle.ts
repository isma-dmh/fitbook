import { Component, WritableSignal, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Api, CHEMINS } from '../../../core/api';
import { Catalogue, Vue } from '../../../core/catalogue';
import { Contexte } from '../../../core/contexte';
import { PhotoSalle } from '../../../core/models';
import { iri, messageErreur } from '../../../core/utils';

/** Fiche de la salle : informations, activités, équipements et photos (US-G1 à US-G3, US-G6). */
@Component({
  selector: 'app-ma-salle',
  imports: [ReactiveFormsModule],
  templateUrl: './ma-salle.html',
  styleUrl: './ma-salle.css',

})
export class MaSalle {
  ctx = inject(Contexte);
  private api = inject(Api);
  private catalogue = inject(Catalogue);
  private fb = inject(FormBuilder).nonNullable;

  vue = signal<Vue | null>(null);
  creation = signal(false);
  activites = signal<string[]>([]);
  equipements = signal<string[]>([]);
  envoi = signal(false);
  message = signal('');
  erreur = signal('');
  fichierPhoto = signal<File | null>(null);
  envoiPhoto = signal(false);

  form = this.fb.group({
    nom: ['', Validators.required],
    adresse: ['', Validators.required],
    ville: ['', Validators.required],
    description: ['', Validators.required],
    capaciteMax: [1, [Validators.required, Validators.min(1)]],
  });

  photos = () => {
    const s = this.ctx.salleCourante();
    return s ? (this.vue()?.photosSalle(s['@id']) ?? []) : [];
  };

  constructor() {
    this.charger();
    effect(() => {
      const s = this.ctx.salleCourante();
      if (this.creation()) return;
      if (s) {
        this.form.patchValue({ nom: s.nom, adresse: s.adresse, ville: s.ville, description: s.description, capaciteMax: s.capaciteMax }, { emitEvent: false });
        this.activites.set((s.activites ?? []).map((a) => iri(a)!));
        this.equipements.set((s.equipements ?? []).map((e) => iri(e)!));
      } else {
        this.creation.set(true);
      }
    });
  }

  private charger() {
    this.catalogue.tout().subscribe((v) => this.vue.set(v));
  }

  invalide(c: 'nom' | 'adresse' | 'ville' | 'description' | 'capaciteMax') {
    const x = this.form.controls[c];
    return x.invalid && (x.touched || x.dirty);
  }

  basculer(liste: WritableSignal<string[]>, i: string) {
    liste.update((l) => (l.includes(i) ? l.filter((x) => x !== i) : [...l, i]));
  }

  nouvelle() {
    this.creation.set(true);
    this.form.reset({ nom: '', adresse: '', ville: '', description: '', capaciteMax: 1 });
    this.activites.set([]);
    this.equipements.set([]);
    this.message.set('');
  }

  enregistrer() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.envoi.set(true);
    this.message.set('');
    this.erreur.set('');
    const corps = { ...this.form.getRawValue(), activites: this.activites(), equipements: this.equipements() };
    const s = this.ctx.salleCourante();
    // À la création, le serveur définit le gestionnaire (utilisateur connecté).
    const appel = !this.creation() && s ? this.api.modifier(s['@id'] ?? `/api${CHEMINS.salles}/${s.id}`, corps) : this.api.creer(CHEMINS.salles, corps);
    appel.subscribe({
      next: () => {
        this.envoi.set(false);
        this.message.set('Salle enregistrée.');
        this.creation.set(false);
        this.catalogue.invalider();
        this.ctx.recharger();
        this.charger();
      },
      error: (e) => {
        this.envoi.set(false);
        this.erreur.set(messageErreur(e, "L'enregistrement a échoué."));
      },
    });
  }

  choisirPhoto(e: Event) {
    this.fichierPhoto.set((e.target as HTMLInputElement).files?.[0] ?? null);
  }

  ajouterPhoto(salleIri: string, champ: HTMLInputElement) {
    const fichier = this.fichierPhoto();
    if (!fichier) return;
    const donnees = new FormData();
    donnees.append('fichier', fichier);
    donnees.append('salle', salleIri);
    this.envoiPhoto.set(true);
    this.api.envoyer<PhotoSalle>(CHEMINS.photosSalle, donnees).subscribe({
      next: () => {
        this.envoiPhoto.set(false);
        this.fichierPhoto.set(null);
        champ.value = '';
        this.catalogue.invalider();
        this.charger();
      },
      error: (e) => {
        this.envoiPhoto.set(false);
        this.erreur.set(messageErreur(e, "La photo n'a pas pu être ajoutée."));
      },
    });
  }

  supprimerPhoto(p: PhotoSalle) {
    this.api.supprimer(p['@id'] ?? `/api${CHEMINS.photosSalle}/${p.id}`).subscribe({
      next: () => {
        this.catalogue.invalider();
        this.charger();
      },
      error: (e) => this.erreur.set(messageErreur(e, 'La suppression a échoué.')),
    });
  }
}
