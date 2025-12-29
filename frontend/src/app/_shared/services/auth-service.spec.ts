import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth-service';
import { environment } from '@env/environment.development';
import { User } from '../models/spotify.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUser: User = {
    id: '123',
    display_name: 'Test User',
    email: 'test@example.com',
    images: [{ url: 'https://example.com/image.jpg', height: 64, width: 64 }],
    country: '',
    explicit_content: {
      filter_enabled: false,
      filter_locked: false,
    },
    external_urls: {
      spotify: 'https://open.spotify.com/user/123',
    },
    followers: {
      href: '',
      total: 0,
    },
    href: '',
    product: '',
    type: '',
    uri: '',
  };

  beforeEach(() => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, { provide: Router, useValue: routerSpyObj }],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    sessionStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Token Management', () => {
    it('should set token in sessionStorage', () => {
      const token = 'test-token-123';
      service.setToken(token);
      expect(sessionStorage.getItem('access_token')).toBe(token);
    });

    it('should get token from sessionStorage', () => {
      const token = 'test-token-456';
      sessionStorage.setItem('access_token', token);
      expect(service.getToken()).toBe(token);
    });

    it('should return null when token does not exist', () => {
      expect(service.getToken()).toBeNull();
    });

    it('should check if user is authenticated', () => {
      expect(service.isAuthenticated()).toBeFalse();

      service.setToken('some-token');
      expect(service.isAuthenticated()).toBeTrue();
    });
  });

  describe('User Management', () => {
    it('should return current user value', () => {
      expect(service.currentUserValue).toBeNull();
    });

    it('should get user from API', (done) => {
      service.getUser().subscribe((user) => {
        expect(user).toEqual(mockUser);
        done();
      });

      const req = httpMock.expectOne(`${environment.API_URL}/auth/me`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });

    it('should get current user and update userSubject', (done) => {
      service.getCurrentUser().subscribe((user) => {
        expect(user).toEqual(mockUser);
        expect(service.currentUserValue).toEqual(mockUser);
        done();
      });

      const req = httpMock.expectOne(`${environment.API_URL}/auth/me`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });

    it('should handle getCurrentUser error gracefully', (done) => {
      const consoleSpy = spyOn(console, 'error');

      service.getCurrentUser().subscribe((result) => {
        expect(result).toBeNull();
        expect(consoleSpy).toHaveBeenCalledWith('Get current user failed:', jasmine.any(Object));
        done();
      });

      const req = httpMock.expectOne(`${environment.API_URL}/auth/me`);
      req.error(new ProgressEvent('error'), { status: 401 });
    });

    it('should emit user changes through observable', (done) => {
      const users: (User | null)[] = [];

      service.user.subscribe((user) => {
        users.push(user);
        if (users.length === 2) {
          expect(users[0]).toBeNull();
          expect(users[1]).toEqual(mockUser);
          done();
        }
      });

      service.getCurrentUser().subscribe();

      const req = httpMock.expectOne(`${environment.API_URL}/auth/me`);
      req.flush(mockUser);
    });
  });
});
