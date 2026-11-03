import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Vue } from '../../core/catalogue';
import { CarteCoach } from './carte-coach';

function vueVide(): Vue {
  return new Vue({
    salles: [], activites: [], equipements: [], coachs: [], seances: [], avis: [], photos: [],
    horairesSalle: [], horairesCoach: [], disponibilites: [],
  });
}

describe('CarteCoach', () => {
  let fixture: ComponentFixture<CarteCoach>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarteCoach],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    fixture = TestBed.createComponent(CarteCoach);
    fixture.componentRef.setInput('coach', { id: 1, '@id': '/api/profil_coaches/1', specialites: 'Yoga', ville: 'Namur', tarifHoraire: 30 });
    fixture.componentRef.setInput('vue', vueVide());
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
