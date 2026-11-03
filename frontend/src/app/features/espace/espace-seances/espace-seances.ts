import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CHEMINS } from '../../../core/api';
import { Seance } from '../../../core/models';
import { debutSeance, estPassee, heure, iri, jour, jourFr, messageErreur, prix } from '../../../core/utils';
import { BaseEspace } from '../base-espace';

/** Création, modification et suppression des séances (US-C3 à US-C5, US-G4, US-G6). */
@Component({
  selector: 'app-espace-seances',
  imports: [ReactiveFormsModule],
  templateUrl: './espace-seances.html',
  styleUrl: './espace-seances.css',

})
export class EspaceSeances extends BaseEspace {
  private fb = inject(FormBuilder).nonNullable;
  private route = inject(ActivatedRoute);

  jourFr = jourFr;
  heure = heure;
  prix = prix;
  passee = estPassee;

  formulaire = signal(false);
  edition = signal<Seance | null>(null);
  envoi = signal(false);
  erreurForm = signal('');

  form = this.fb.group({
    activite: ['', Validators.required],
    salle: [''],
    date: ['', Validators.required],
    heure: ['', Validators.required],
    dureeMinutes: [60, [Validators.required, Validators.min(5)]],
    capacite: [10, [Validators.required, Validators.min(1)]],
    prix: [0, [Validators.required, Validators.min(0)]],
    statut: ['planifiee'],
  });

  mesSeances = computed(() => {
    const v = this.vue();
    const c = this.cible();
    if (!v || !c) return [];
    return v.d.seances
      .filter((s) => iri(this.espace === 'coach' ? s.profilCoach : s.salle) === c)
      .sort((a, b) => debutSeance(b).getTime() - debutSeance(a).getTime());
  });

  sallesPossibles = computed(() => {
    const v = this.vue();
    const p = this.ctx.profilCoach();
    if (!v) return [];
    const liees = (p?.salles ?? []).map((s) => iri(s));
    return liees.length ? v.d.salles.filter((s) => liees.includes(s['@id']!)) : v.d.salles;
  });

  /** Capacité de la salle choisie (le coach choisit sa salle, le gestionnaire est sur la sienne). */
  capaciteSalle = computed<number | null>(() => {
    if (this.espace === 'salle') return this.ctx.salleCourante()?.capaciteMax ?? null;
    const i = this.salleChoisie();
    return this.vue()?.salle(i || null)?.capaciteMax ?? null;
  });
  private salleChoisie = signal('');

  constructor() {
    super();
    this.form.controls.salle.valueChanges.subscribe((v) => this.salleChoisie.set(v));
    effect(() => {
      if (this.cible() && this.route.snapshot.queryParamMap.get('nouvelle') && !this.formulaire() && !this.edition()) this.ouvrir(null);
    });
  }

  invalide(c: 'activite' | 'date' | 'heure') {
    const x = this.form.controls[c];
    return x.invalid && (x.touched || x.dirty);
  }

  ouvrir(s: Seance | null) {
    this.edition.set(s);
    this.erreurForm.set('');
    this.message.set('');
    this.form.reset({
      activite: s ? (iri(s.activite) ?? '') : '',
      salle: s ? (iri(s.salle) ?? '') : '',
      date: s ? jour(s.dateSeance) : '',
      heure: s ? heure(s.heureDebut) : '',
      dureeMinutes: s?.dureeMinutes ?? 60,
      capacite: s?.capacite ?? this.capaciteSalle() ?? 10,
      prix: s?.prix ?? 0,
      statut: s?.statut ?? 'planifiee',
    });
    this.salleChoisie.set(this.form.controls.salle.value);
    this.formulaire.set(true);
  }

  fermer() {
    this.formulaire.set(false);
    this.edition.set(null);
  }

  enregistrer() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const max = this.capaciteSalle();
    if (max !== null && v.capacite > max) {
      this.erreurForm.set(`La capacité (${v.capacite}) dépasse celle de la salle (${max}).`);
      return;
    }
    const cible = this.cible()!;
    const corps = {
      dateSeance: v.date,
      heureDebut: v.heure,
      dureeMinutes: v.dureeMinutes,
      capacite: v.capacite,
      prix: v.prix,
      statut: v.statut,
      activite: v.activite,
      profilCoach: this.espace === 'coach' ? cible : null,
      salle: this.espace === 'salle' ? cible : v.salle || null,
    };
    this.envoi.set(true);
    this.erreurForm.set('');
    const e = this.edition();
    const appel = e ? this.api.modifier<Seance>(e['@id'] ?? `/api${CHEMINS.seances}/${e.id}`, corps) : this.api.creer<Seance>(CHEMINS.seances, corps);
    appel.subscribe({
      next: () => {
        this.envoi.set(false);
        this.fermer();
        this.rafraichir();
      },
      error: (err) => {
        this.envoi.set(false);
        this.erreurForm.set(messageErreur(err, "L'enregistrement a échoué."));
      },
    });
  }

  supprimer(s: Seance) {
    if (!confirm('Supprimer cette séance ?')) return;
    this.message.set('');
    this.api.supprimer(s['@id'] ?? `/api${CHEMINS.seances}/${s.id}`).subscribe({
      next: () => this.rafraichir(),
      error: (e) => this.message.set(messageErreur(e, 'La suppression a échoué (des réservations existent peut-être).')),
    });
  }
}
