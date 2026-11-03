import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CHEMINS } from '../../../core/api';
import { heure, iri, jour, jourFr, messageErreur } from '../../../core/utils';
import { BaseEspace } from '../base-espace';

/** Disponibilités ponctuelles et blocages de dates (US-C7, US-G7). */
@Component({
  selector: 'app-espace-disponibilites',
  imports: [ReactiveFormsModule],
  templateUrl: './espace-disponibilites.html',
  styleUrl: './espace-disponibilites.css',

})
export class EspaceDisponibilites extends BaseEspace {
  private fb = inject(FormBuilder).nonNullable;
  jourFr = jourFr;
  heure = heure;
  erreurForm = signal('');

  form = this.fb.group({
    dateDispo: ['', Validators.required],
    type: ['disponible'],
    heureDebut: ['', Validators.required],
    heureFin: ['', Validators.required],
  });

  mesDispos = computed(() => {
    const v = this.vue();
    const c = this.cible();
    if (!v || !c) return [];
    return v.d.disponibilites
      .filter((d) => iri(this.espace === 'coach' ? d.profilCoach : d.salle) === c)
      .sort((a, b) => jour(a.dateDispo).localeCompare(jour(b.dateDispo)));
  });

  ajouter() {
    const v = this.form.getRawValue();
    if (v.heureFin <= v.heureDebut) {
      this.erreurForm.set("L'heure de fin doit être après l'heure de début.");
      return;
    }
    this.erreurForm.set('');
    const cible = this.cible()!;
    this.api
      .creer(CHEMINS.disponibilites, {
        ...v,
        profilCoach: this.espace === 'coach' ? cible : null,
        salle: this.espace === 'salle' ? cible : null,
      })
      .subscribe({
        next: () => {
          this.form.patchValue({ dateDispo: '', heureDebut: '', heureFin: '' });
          this.rafraichir();
        },
        error: (e) => this.erreurForm.set(messageErreur(e, "L'ajout a échoué.")),
      });
  }

  iriDe(d: { '@id'?: string; id: number }): string {
    return d['@id'] ?? `/api${CHEMINS.disponibilites}/${d.id}`;
  }

  supprimer(i: string) {
    this.api.supprimer(i).subscribe({ next: () => this.rafraichir(), error: (e) => this.erreurForm.set(messageErreur(e)) });
  }
}
