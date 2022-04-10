import { TestBed } from '@angular/core/testing';

import { TrackerDetailsService } from './tracker-details.service';

describe('TrackerDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrackerDetailsService = TestBed.get(TrackerDetailsService);
    expect(service).toBeTruthy();
  });
});
