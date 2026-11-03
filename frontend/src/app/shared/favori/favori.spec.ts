import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Favori } from './favori';

describe('Favori', () => {
  let fixture: ComponentFixture<Favori>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Favori],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    fixture = TestBed.createComponent(Favori);
    fixture.componentRef.setInput('type', 'salles');
    fixture.componentRef.setInput('cible', '/api/salles/1');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
