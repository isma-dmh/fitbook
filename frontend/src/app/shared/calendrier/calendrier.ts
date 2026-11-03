import { Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface EvenementCal {
  date: string; // AAAA-MM-JJ
  titre: string;
  sous?: string;
  lien?: string;
  type?: 'seance' | 'reservation' | 'dispo' | 'blocage';
}

interface Cellule {
  date: string;
  jour: number;
  dansMois: boolean;
  aujourdhui: boolean;
  evenements: EvenementCal[];
}

const MOIS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

function formater(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const j = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${j}`;
}

/** Calendrier mensuel (US-S17, US-C8, US-G8). */
@Component({
  selector: 'app-calendrier',
  imports: [RouterLink],
  templateUrl: './calendrier.html',
  styleUrl: './calendrier.css',

})
export class Calendrier {
  evenements = input<EvenementCal[]>([]);
  private debutMois = signal(new Date(new Date().getFullYear(), new Date().getMonth(), 1));

  titre = computed(() => `${MOIS[this.debutMois().getMonth()]} ${this.debutMois().getFullYear()}`);

  cellules = computed<Cellule[]>(() => {
    const premier = this.debutMois();
    const decalage = (premier.getDay() + 6) % 7; // lundi = 0
    const debut = new Date(premier.getFullYear(), premier.getMonth(), 1 - decalage);
    const parJour = new Map<string, EvenementCal[]>();
    for (const e of this.evenements()) {
      const l = parJour.get(e.date) ?? [];
      l.push(e);
      parJour.set(e.date, l);
    }
    const auj = formater(new Date());
    const cellules: Cellule[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(debut.getFullYear(), debut.getMonth(), debut.getDate() + i);
      const date = formater(d);
      cellules.push({
        date,
        jour: d.getDate(),
        dansMois: d.getMonth() === premier.getMonth(),
        aujourdhui: date === auj,
        evenements: parJour.get(date) ?? [],
      });
    }
    // Retire la dernière semaine si elle est entièrement hors du mois.
    return cellules.slice(35).every((c) => !c.dansMois) ? cellules.slice(0, 35) : cellules;
  });

  changer(delta: number) {
    const m = this.debutMois();
    this.debutMois.set(new Date(m.getFullYear(), m.getMonth() + delta, 1));
  }

  aujourdhui() {
    this.debutMois.set(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  }
}
