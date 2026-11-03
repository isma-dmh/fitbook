import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Vue } from '../../core/catalogue';
import { CarteSalle } from './carte-salle';

function vueVide(): Vue {
  return new Vue({
    salles: [], activites: [], equipements: [], coachs: [], seances: [], avis: [], photos: [],
    horairesSalle: [], horairesCoach: [], disponibilites: [],
  });
}

describe('CarteSalle', () => {
  let fixture: ComponentFixture<CarteSalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarteSalle],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    fixture = TestBed.createComponent(CarteSalle);
    fixture.componentRef.setInput('salle', { id: 1, '@id': '/api/salles/1', nom: 'Salle test', ville: 'Namur' });
    fixture.componentRef.setInput('vue', vueVide());
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
