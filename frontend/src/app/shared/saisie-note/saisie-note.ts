import { Component, input, output } from '@angular/core';

/** Saisie d'une note de 1 à 5 en cliquant sur les étoiles. */
@Component({
  selector: 'app-saisie-note',
  templateUrl: './saisie-note.html',
  styleUrl: './saisie-note.css',

})
export class SaisieNote {
  valeur = input(0);
  choisie = output<number>();
}
