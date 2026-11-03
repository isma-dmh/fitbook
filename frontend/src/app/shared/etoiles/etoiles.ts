import { Component, input, output } from '@angular/core';

/** Affichage d'une note moyenne : ★ 4,5 · 12 avis */
@Component({
  selector: 'app-etoiles',
  templateUrl: './etoiles.html',
  styleUrl: './etoiles.css',

})
export class Etoiles {
  note = input<number | null>(null);
  nombre = input<number | null>(null);
  texteNote() {
    return String(this.note()).replace('.', ',');
  }
}
