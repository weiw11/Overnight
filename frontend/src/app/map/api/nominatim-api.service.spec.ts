import { TestBed } from '@angular/core/testing';

import { NominatimApiService } from './nominatim-api.service';

describe('NominatimApiService', () => {
  let service: NominatimApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NominatimApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
