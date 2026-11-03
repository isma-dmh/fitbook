import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Vue } from '../../core/catalogue';
import { LigneSeance } from './ligne-seance';

function vueVide(): Vue {
  return new Vue({
    salles: [], activites: [], equipements: [], coachs: [], seances: [], avis: [], photos: [],
    horairesSalle: [], horairesCoach: [], disponibilites: [],
  });
}

describe('LigneSeance', () => {
  let fixture: ComponentFixture<LigneSeance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LigneSeance],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    fixture = TestBed.createComponent(LigneSeance);
    fixture.componentRef.setInput('seance', { id: 1, '@id': '/api/seances/1', dateSeance: '2030-01-01', heureDebut: '10:00', dureeMinutes: 60, capacite: 10, prix: 10, statut: 'planifiee', activite: '/api/activites/1' });
    fixture.componentRef.setInput('vue', vueVide());
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
