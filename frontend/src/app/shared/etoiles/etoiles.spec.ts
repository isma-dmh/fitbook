import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Etoiles } from './etoiles';

describe('Etoiles', () => {
  let fixture: ComponentFixture<Etoiles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Etoiles],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    fixture = TestBed.createComponent(Etoiles);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
