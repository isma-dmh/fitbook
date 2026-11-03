import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Api, CHEMINS } from '../../../core/api';
import { Auth } from '../../../core/auth';
import { Catalogue, Vue } from '../../../core/catalogue';
import { Avis } from '../../../core/models';
import { idDe, iri, jourFr, messageErreur } from '../../../core/utils';
import { SaisieNote } from '../../../shared/saisie-note/saisie-note';

/** Modifier ou supprimer ses avis (US-S16). */
@Component({
  selector: 'app-mes-avis',
  imports: [FormsModule, RouterLink, SaisieNote],
  templateUrl: './mes-avis.html',
  styleUrl: './mes-avis.css',

})
export class MesAvis {
  private api = inject(Api);
  private auth = inject(Auth);
  private catalogue = inject(Catalogue);

  vue = signal<Vue | null>(null);
  message = signal('');
  edition = signal<Avis | null>(null);
  note = signal(0);
  commentaire = '';

  mesAvis = computed(() => {
    const moi = this.auth.profil()?.id;
    return (this.vue()?.d.avis ?? []).filter((a) => moi != null && idDe(a.utilisateur) === moi);
  });

  constructor() {
    this.charger();
  }

  private charger() {
    this.catalogue.tout().subscribe({ next: (v) => this.vue.set(v), error: () => this.message.set('Chargement impossible.') });
  }

  cible(a: Avis) {
    const v = this.vue();
    if (!v) return '';
    return v.salle(iri(a.salle))?.nom ?? v.nomCoach(v.coach(iri(a.profilCoach)));
  }
  date(a: Avis) {
    return jourFr(a.dateCreation);
  }

  modifier(a: Avis) {
    this.edition.set(a);
    this.note.set(a.note);
    this.commentaire = a.commentaire ?? '';
  }

  enregistrer(a: Avis) {
    this.message.set('');
    this.api.modifier(a['@id'] ?? `/api${CHEMINS.avis}/${a.id}`, { note: this.note(), commentaire: this.commentaire || null }).subscribe({
      next: () => this.apres(),
      error: (e) => this.message.set(messageErreur(e, 'La modification a échoué.')),
    });
  }

  supprimer(a: Avis) {
    if (!confirm('Supprimer cet avis ?')) return;
    this.message.set('');
    this.api.supprimer(a['@id'] ?? `/api${CHEMINS.avis}/${a.id}`).subscribe({
      next: () => this.apres(),
      error: (e) => this.message.set(messageErreur(e, 'La suppression a échoué.')),
    });
  }

  private apres() {
    this.edition.set(null);
    this.catalogue.invalider();
    this.charger();
  }
}
