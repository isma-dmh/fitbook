import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CHEMINS } from '../../../core/api';
import { JOURS, heure, iri, messageErreur } from '../../../core/utils';
import { BaseEspace } from '../base-espace';

/** Horaires d'ouverture de la salle ou de disponibilité hebdomadaire du coach. */
@Component({
  selector: 'app-espace-horaires',
  imports: [ReactiveFormsModule],
  templateUrl: './espace-horaires.html',
  styleUrl: './espace-horaires.css',

})
export class EspaceHoraires extends BaseEspace {
  private fb = inject(FormBuilder).nonNullable;
  jours = JOURS;
  heure = heure;
  erreurForm = signal('');

  form = this.fb.group({
    jourSemaine: [1, Validators.required],
    debut: ['', Validators.required],
    fin: ['', Validators.required],
  });

  lignes = computed(() => {
    const v = this.vue();
    const c = this.cible();
    if (!v || !c) return [];
    if (this.espace === 'salle') {
      return v.horairesSalle(c).map((h) => ({ id: h.id, iri: h['@id'] ?? `/api${CHEMINS.horairesSalle}/${h.id}`, jour: h.jourSemaine, debut: h.heureOuverture, fin: h.heureFermeture }));
    }
    return v.horairesCoach(c).map((h) => ({ id: h.id, iri: h['@id'] ?? `/api${CHEMINS.horairesCoach}/${h.id}`, jour: h.jourSemaine, debut: h.heureDebut, fin: h.heureFin }));
  });

  ajouter() {
    const v = this.form.getRawValue();
    if (v.fin <= v.debut) {
      this.erreurForm.set("L'heure de fin doit être après l'heure de début.");
      return;
    }
    this.erreurForm.set('');
    const jour = Number(v.jourSemaine);
    const cible = this.cible()!;
    const appel =
      this.espace === 'salle'
        ? this.api.creer(CHEMINS.horairesSalle, { jourSemaine: jour, heureOuverture: v.debut, heureFermeture: v.fin, salle: cible })
        : this.api.creer(CHEMINS.horairesCoach, { jourSemaine: jour, heureDebut: v.debut, heureFin: v.fin, profilCoach: cible });
    appel.subscribe({
      next: () => {
        this.form.patchValue({ debut: '', fin: '' });
        this.rafraichir();
      },
      error: (e) => this.erreurForm.set(messageErreur(e, "L'ajout a échoué.")),
    });
  }

  supprimer(i: string) {
    this.api.supprimer(i).subscribe({ next: () => this.rafraichir(), error: (e) => this.erreurForm.set(messageErreur(e)) });
  }
}
