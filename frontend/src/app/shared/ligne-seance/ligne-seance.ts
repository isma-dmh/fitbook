import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Vue } from '../../core/catalogue';
import { Seance } from '../../core/models';
import { heure, jourFr, prix } from '../../core/utils';
import { Favori } from '../favori/favori';

@Component({
  selector: 'app-ligne-seance',
  imports: [RouterLink, Favori],
  templateUrl: './ligne-seance.html',
  styleUrl: './ligne-seance.css',

})
export class LigneSeance {
  seance = input.required<Seance>();
  vue = input.required<Vue>();
  jour() {
    return jourFr(this.seance().dateSeance);
  }
  heureTxt() {
    return heure(this.seance().heureDebut);
  }
  lieu() {
    return this.vue().lieuSeance(this.seance());
  }
  places() {
    return this.vue().places(this.seance());
  }
  complet() {
    return this.places() <= 0;
  }
  tarif() {
    return prix(this.seance().prix);
  }
}
