import { Component, computed, input } from '@angular/core';
import { initiales } from '../../core/utils';

/** Image d'une salle ou d'un coach, ou ses initiales si aucune image n'est disponible. */
@Component({
  selector: 'app-visuel',
  templateUrl: './visuel.html',
  styleUrl: './visuel.css',

  host: { class: 'visuel' },
})
export class Visuel {
  src = input<string | null | undefined>(null);
  texte = input('');
  lettres = computed(() => initiales(this.texte()));
}
