import { TestBed } from '@angular/core/testing';

import { SporifyService } from './sporify-service';

describe('SporifyService', () => {
  let service: SporifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SporifyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
