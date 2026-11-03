import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { SaisieNote } from './saisie-note';

describe('SaisieNote', () => {
  let fixture: ComponentFixture<SaisieNote>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaisieNote],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    fixture = TestBed.createComponent(SaisieNote);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
