import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Api, CHEMINS } from '../../../core/api';
import { Donnees } from '../../../core/donnees';
import { iri, jourFr, messageErreur, nomComplet } from '../../../core/utils';

interface Colonne {
  titre: string;
  valeur: (e: any) => string;
}
interface Config {
  titre: string;
  chemin: string;
  colonnes: Colonne[];
  supprimable?: boolean;
  formulaire?: { cle: string; libelle: string }[];
  /** Bascule d'un booléen (ex. compte actif). */
  bascule?: { cle: string; libelle: string };
  /** Action « Annuler » qui passe le statut à annulee. */
  annulable?: boolean;
}

const CONFIGS: Record<string, Config> = {
  utilisateurs: {
    titre: 'Utilisateurs',
    chemin: CHEMINS.utilisateurs,
    colonnes: [
      { titre: 'Nom', valeur: (u) => nomComplet(u) || '—' },
      { titre: 'Email', valeur: (u) => u.email ?? '—' },
      { titre: 'Rôle', valeur: (u) => u.roleLibelle ?? '—' },
      { titre: 'Actif', valeur: (u) => (u.actif === false ? 'Non' : 'Oui') },
    ],
    bascule: { cle: 'actif', libelle: 'Activer / désactiver' },
    supprimable: true,
  },
  salles: {
    titre: 'Salles',
    chemin: CHEMINS.salles,
    colonnes: [
      { titre: 'Nom', valeur: (s) => s.nom },
      { titre: 'Ville', valeur: (s) => s.ville },
      { titre: 'Capacité', valeur: (s) => String(s.capaciteMax) },
    ],
    supprimable: true,
  },
  coachs: {
    titre: 'Coachs',
    chemin: CHEMINS.coachs,
    colonnes: [
      { titre: 'Coach', valeur: (c) => nomComplet(c.utilisateur) || `Coach n°${c.id}` },
      { titre: 'Ville', valeur: (c) => c.ville },
      { titre: 'Spécialités', valeur: (c) => c.specialites },
    ],
    supprimable: true,
  },
  activites: {
    titre: 'Activités',
    chemin: CHEMINS.activites,
    colonnes: [
      { titre: 'Nom', valeur: (a) => a.nom },
      { titre: 'Description', valeur: (a) => a.description ?? '' },
    ],
    formulaire: [
      { cle: 'nom', libelle: 'Nom' },
      { cle: 'description', libelle: 'Description' },
    ],
    supprimable: true,
  },
  equipements: {
    titre: 'Équipements',
    chemin: CHEMINS.equipements,
    colonnes: [{ titre: 'Nom', valeur: (e) => e.nom }],
    formulaire: [{ cle: 'nom', libelle: 'Nom' }],
    supprimable: true,
  },
  reservations: {
    titre: 'Réservations',
    chemin: CHEMINS.reservations,
    colonnes: [
      { titre: 'Sportif', valeur: (r) => nomComplet(r.utilisateur) || '—' },
      { titre: 'Séance', valeur: (r) => iri(r.seance) ?? '' },
      { titre: 'Statut', valeur: (r) => (r.statut === 'annulee' ? 'Annulée' : 'Confirmée') },
    ],
    annulable: true,
  },
  avis: {
    titre: 'Avis',
    chemin: CHEMINS.avis,
    colonnes: [
      { titre: 'Auteur', valeur: (a) => nomComplet(a.utilisateur) || '—' },
      { titre: 'Note', valeur: (a) => `${a.note} / 5` },
      { titre: 'Commentaire', valeur: (a) => a.commentaire ?? '' },
      { titre: 'Date', valeur: (a) => (a.dateCreation ? jourFr(a.dateCreation) : '') },
    ],
    supprimable: true,
  },
};

/** Tableau d'administration générique : une même page, configurée par la route (data.ressource). */
@Component({
  selector: 'app-admin-liste',
  imports: [FormsModule],
  templateUrl: './admin-liste.html',
  styleUrl: './admin-liste.css',

})
export class AdminListe {
  private api = inject(Api);
  private donnees = inject(Donnees);
  readonly config: Config = CONFIGS[inject(ActivatedRoute).snapshot.data['ressource']];

  lignes = signal<any[] | null>(null);
  message = signal('');
  edition = signal<any | null>(null);
  saisie = signal<Record<string, string>>({});

  constructor() {
    this.charger();
  }

  private charger() {
    this.api.liste<any>(this.config.chemin).subscribe({
      next: (l) => this.lignes.set(l),
      error: (e) => {
        this.lignes.set([]);
        this.message.set(messageErreur(e, 'Impossible de charger la liste (droits administrateur requis).'));
      },
    });
  }

  private cible(l: any): string {
    return l['@id'] ?? `/api${this.config.chemin}/${l.id}`;
  }

  private apres() {
    this.donnees.invalider();
    this.charger();
  }

  maj(cle: string, valeur: string) {
    this.saisie.update((s) => ({ ...s, [cle]: valeur }));
  }

  editer(l: any) {
    this.edition.set(l);
    this.saisie.set(Object.fromEntries((this.config.formulaire ?? []).map((c) => [c.cle, l[c.cle] ?? ''])));
  }

  annulerEdition() {
    this.edition.set(null);
    this.saisie.set({});
  }

  ajouter() {
    const corps = this.saisie();
    if (!corps['nom']?.trim()) {
      this.message.set('Le nom est obligatoire.');
      return;
    }
    this.message.set('');
    const e = this.edition();
    const appel = e ? this.api.modifier(this.cible(e), corps) : this.api.creer(this.config.chemin, corps);
    appel.subscribe({
      next: () => {
        this.annulerEdition();
        this.apres();
      },
      error: (err) => this.message.set(messageErreur(err, "L'enregistrement a échoué.")),
    });
  }

  basculer(l: any) {
    const cle = this.config.bascule!.cle;
    this.api.modifier(this.cible(l), { [cle]: l[cle] === false }).subscribe({
      next: () => this.apres(),
      error: (e) => this.message.set(messageErreur(e)),
    });
  }

  annuler(l: any) {
    if (!confirm('Annuler cet élément ?')) return;
    this.api.modifier(this.cible(l), { statut: 'annulee' }).subscribe({
      next: () => this.apres(),
      error: (e) => this.message.set(messageErreur(e)),
    });
  }

  supprimer(l: any) {
    if (!confirm('Supprimer définitivement cet élément ?')) return;
    this.api.supprimer(this.cible(l)).subscribe({
      next: () => this.apres(),
      error: (e) => this.message.set(messageErreur(e, 'La suppression a échoué (élément utilisé ailleurs ?).')),
    });
  }
}
