import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Vue } from '../../core/catalogue';
import { ProfilCoach } from '../../core/models';
import { prix } from '../../core/utils';
import { Etoiles } from '../etoiles/etoiles';
import { Favori } from '../favori/favori';
import { Visuel } from '../visuel/visuel';

@Component({
  selector: 'app-carte-coach',
  imports: [RouterLink, Etoiles, Favori, Visuel],
  templateUrl: './carte-coach.html',
  styleUrl: './carte-coach.css',

})
export class CarteCoach {
  coach = input.required<ProfilCoach>();
  vue = input.required<Vue>();
  tarif() {
    return prix(this.coach().tarifHoraire);
  }
}
