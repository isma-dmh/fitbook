import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Vue } from '../../core/catalogue';
import { Salle } from '../../core/models';
import { Etoiles } from '../etoiles/etoiles';
import { Favori } from '../favori/favori';
import { Visuel } from '../visuel/visuel';

@Component({
  selector: 'app-carte-salle',
  imports: [RouterLink, Etoiles, Favori, Visuel],
  templateUrl: './carte-salle.html',
  styleUrl: './carte-salle.css',

})
export class CarteSalle {
  salle = input.required<Salle>();
  vue = input.required<Vue>();
  activites() {
    return this.vue().activitesSalle(this.salle()).slice(0, 3).join(', ');
  }
}
