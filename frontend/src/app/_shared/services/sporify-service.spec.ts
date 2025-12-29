import { TestBed } from '@angular/core/testing';

import { SpotifyService } from './sporify-service';
import { provideHttpClient } from '@angular/common/http';

describe('SpotifyService', () => {
  let service: SpotifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    service = TestBed.inject(SpotifyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
