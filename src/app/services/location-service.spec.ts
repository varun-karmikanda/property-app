import { TestBed } from '@angular/core/testing';

import { LocationService } from './location-service';

describe('LocationService', () => {
  let service: LocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should search across name, city, and state', (done) => {
    service.search('oakland').subscribe((results) => {
      expect(results.length).toBeGreaterThan(0);
      expect(results.every((location) => location.city.toLowerCase().includes('oakland'))).toBeTrue();
      done();
    });
  });

  it('should match by housing name', (done) => {
    service.search('acme').subscribe((results) => {
      expect(results.length).toBe(1);
      expect(results[0]?.name).toContain('Acme');
      done();
    });
  });
});
