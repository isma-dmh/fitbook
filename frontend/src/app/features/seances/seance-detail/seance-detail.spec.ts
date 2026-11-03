import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { SeanceDetail } from './seance-detail';

describe('SeanceDetail', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([{ path: '', component: SeanceDetail, data: { espace: 'coach', ressource: 'salles', mode: 'confirmation', type: 'salles' } }]),
      ],
    });
  });

  it('should create', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/', SeanceDetail);
    expect(component).toBeTruthy();
  });
});
