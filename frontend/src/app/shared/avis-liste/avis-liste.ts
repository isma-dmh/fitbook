import { Component, input } from '@angular/core';
import { Avis } from '../../core/models';
import { jourFr, nomComplet } from '../../core/utils';

/** Liste d'avis (note, auteur, commentaire). */
@Component({
  selector: 'app-avis-liste',
  templateUrl: './avis-liste.html',
  styleUrl: './avis-liste.css',

})
export class AvisListe {
  avis = input.required<Avis[]>();
  vide = input("Aucun avis pour l'instant.");
  auteur(a: Avis) {
    return nomComplet(a.utilisateur) || 'Sportif';
  }
  etoiles(n: number) {
    return '★'.repeat(n) + '☆'.repeat(5 - n);
  }
  date(a: Avis) {
    return jourFr(a.dateCreation);
  }
}
