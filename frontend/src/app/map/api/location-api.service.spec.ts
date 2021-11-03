import { TestBed } from '@angular/core/testing';

import { LocationAPIService } from './location-api.service';

describe('LocationAPIService', () => {
  let service: LocationAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
