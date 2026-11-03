import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AvisListe } from './avis-liste';

describe('AvisListe', () => {
  let fixture: ComponentFixture<AvisListe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvisListe],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    fixture = TestBed.createComponent(AvisListe);
    fixture.componentRef.setInput('avis', []);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
