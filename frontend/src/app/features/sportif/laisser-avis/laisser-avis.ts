import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Api, CHEMINS } from '../../../core/api';
import { Catalogue, Vue } from '../../../core/catalogue';
import { messageErreur } from '../../../core/utils';
import { SaisieNote } from '../../../shared/saisie-note/saisie-note';

/** Noter et commenter une salle ou un coach (US-S15). */
@Component({
  selector: 'app-laisser-avis',
  imports: [ReactiveFormsModule, RouterLink, SaisieNote],
  templateUrl: './laisser-avis.html',
  styleUrl: './laisser-avis.css',

})
export class LaisserAvis {
  private api = inject(Api);
  private catalogue = inject(Catalogue);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder).nonNullable;
  private router = inject(Router);

  vue = signal<Vue | null>(null);
  envoi = signal(false);
  envoye = signal(false);
  erreur = signal('');

  private salleId = Number(this.route.snapshot.queryParamMap.get('salle')) || null;
  private coachId = Number(this.route.snapshot.queryParamMap.get('coach')) || null;

  form = this.fb.group({
    note: [0, [Validators.min(1), Validators.max(5)]],
    commentaire: [''],
  });

  cible = computed(() => {
    const v = this.vue();
    if (!v) return null;
    const salle = this.salleId ? v.d.salles.find((s) => s.id === this.salleId) : null;
    if (salle) return { champ: 'salle', iri: salle['@id']!, nom: salle.nom, lien: ['/salles', salle.id] };
    const coach = this.coachId ? v.d.coachs.find((c) => c.id === this.coachId) : null;
    if (coach) return { champ: 'profilCoach', iri: coach['@id']!, nom: v.nomCoach(coach), lien: ['/coachs', coach.id] };
    return null;
  });

  constructor() {
    this.catalogue.tout().subscribe({ next: (v) => this.vue.set(v), error: () => this.router.navigateByUrl('/') });
  }

  envoyer() {
    this.form.markAllAsTouched();
    const c = this.cible();
    const { note, commentaire } = this.form.getRawValue();
    if (!c || note < 1) return;
    this.envoi.set(true);
    this.erreur.set('');
    // Le serveur renseigne l'auteur et vérifie qu'une séance a bien été suivie.
    this.api.creer(CHEMINS.avis, { note, commentaire: commentaire || null, [c.champ]: c.iri }).subscribe({
      next: () => {
        this.envoi.set(false);
        this.envoye.set(true);
        this.catalogue.invalider();
      },
      error: (e) => {
        this.envoi.set(false);
        this.erreur.set(messageErreur(e, "L'avis n'a pas pu être publié."));
      },
    });
  }
}
