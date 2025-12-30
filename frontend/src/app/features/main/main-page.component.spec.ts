import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  discardPeriodicTasks,
} from '@angular/core/testing';
import { Store } from '@ngxs/store';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { MainPageComponent } from './main-page.component';
import { AuthActions } from '@app/store/auth/auth.actions';
import { PlaylistActions } from '@app/store/playlist/playlist.actions';
import { Playlist, User, TrackItem, Artist } from '@app/_shared/models/spotify.model';
import { PlaylistDialog } from '../dialogs/playlist-dialog/playlist-dialog';

describe('MainPageComponent', () => {
  let component: MainPageComponent;
  let fixture: ComponentFixture<MainPageComponent>;
  let store: jasmine.SpyObj<Store>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let spinner: jasmine.SpyObj<NgxSpinnerService>;

  let userSubject: BehaviorSubject<User | null>;
  let isAuthenticatedSubject: BehaviorSubject<boolean>;
  let loadingSubject: BehaviorSubject<boolean>;
  let currentPlaylistSubject: BehaviorSubject<Playlist | null>;
  let currentTracksSubject: BehaviorSubject<TrackItem[]>;
  let shufflingSubject: BehaviorSubject<boolean>;
  let savingSubject: BehaviorSubject<boolean>;
  let hasPlaylistSubject: BehaviorSubject<boolean>;

  const mockPlaylist: Playlist = {
    id: 'playlist123',
    name: 'Test Playlist',
    description: 'A test playlist',
    images: [],
    tracks: {
      total: 10,
      href: '',
      items: [],
      limit: 0,
      next: '',
      offset: 0,
      previous: '',
    },
    owner: {
      id: '123',
      display_name: 'Test User',
      country: '',
      email: '',
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
      images: [],
      product: '',
      type: '',
      uri: '',
    },
    collaborative: false,
    external_urls: {
      spotify: 'https://open.spotify.com/playlist/playlist123',
    },
    href: '',
    public: false,
    snapshot_id: '',
    type: '',
    uri: '',
  };

  beforeEach(async () => {
    userSubject = new BehaviorSubject<User | null>(null);
    isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    loadingSubject = new BehaviorSubject<boolean>(false);
    currentPlaylistSubject = new BehaviorSubject<Playlist | null>(null);
    currentTracksSubject = new BehaviorSubject<TrackItem[]>([]);
    shufflingSubject = new BehaviorSubject<boolean>(false);
    savingSubject = new BehaviorSubject<boolean>(false);
    hasPlaylistSubject = new BehaviorSubject<boolean>(false);

    const storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);

    storeSpy.select.and.callFake((selector: { name?: string }) => {
      const selectorName = selector?.name || '';

      switch (selectorName) {
        case 'getUser':
          return userSubject.asObservable();
        case 'isAuthenticated':
          return isAuthenticatedSubject.asObservable();
        case 'isLoading':
          return loadingSubject.asObservable();
        case 'getCurrentPlaylist':
          return currentPlaylistSubject.asObservable();
        case 'getCurrentTracks':
          return currentTracksSubject.asObservable();
        case 'isShuffling':
          return shufflingSubject.asObservable();
        case 'isSaving':
          return savingSubject.asObservable();
        case 'hasPlaylist':
          return hasPlaylistSubject.asObservable();
        default:
          return of(null);
      }
    });

    storeSpy.dispatch.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [MainPageComponent],
      providers: [
        { provide: Store, useValue: storeSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
      ],
    }).compileComponents();

    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    spinner = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;

    fixture = TestBed.createComponent(MainPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should dispatch GetCurrentUser action on init', () => {
      component.ngOnInit();

      expect(store.dispatch).toHaveBeenCalledWith(jasmine.any(AuthActions.GetCurrentUser));
    });

    it('should hide spinner when not loading', fakeAsync(() => {
      loadingSubject.next(true);

      component.ngOnInit();
      tick();

      loadingSubject.next(false);
      tick();

      expect(spinner.hide).toHaveBeenCalled();

      component.ngOnDestroy();
      discardPeriodicTasks();
    }));
  });

  describe('Authentication', () => {
    it('should dispatch Login action', () => {
      component.onLogin();

      expect(store.dispatch).toHaveBeenCalledWith(jasmine.any(AuthActions.Login));
    });

    it('should dispatch Logout and ClearPlaylist actions', () => {
      component.onLogout();

      expect(store.dispatch).toHaveBeenCalledWith(jasmine.any(AuthActions.Logout));
      expect(store.dispatch).toHaveBeenCalledWith(jasmine.any(PlaylistActions.ClearPlaylist));
    });
  });

  describe('Playlist Operations', () => {
    it('should shuffle playlist with default algorithm', () => {
      component.onShuffle();

      expect(store.dispatch).toHaveBeenCalledWith(
        jasmine.objectContaining({ algorithm: 'basic_shuffle' }),
      );
      expect(snackBar.open).toHaveBeenCalledWith(
        'Playlist shuffled using Basic Shuffle algorithm!',
        'Close',
      );
    });

    it('should shuffle playlist with specified algorithm', () => {
      component.onShuffle('balanced_artist');

      expect(store.dispatch).toHaveBeenCalledWith(
        jasmine.objectContaining({ algorithm: 'balanced_artist' }),
      );
      expect(snackBar.open).toHaveBeenCalledWith(
        'Playlist shuffled using Balanced Artist algorithm!',
        'Close',
      );
    });

    it('should show error message when shuffle fails', () => {
      store.dispatch.and.returnValue(throwError(() => new Error('Shuffle failed')));

      component.onShuffle();

      expect(snackBar.open).toHaveBeenCalledWith('Something went wrong', 'Close');
    });

    it('should not save if no playlist name', fakeAsync(() => {
      component.ngOnInit();
      tick();

      const initialCallCount = store.dispatch.calls.count();
      component.onSaveToSpotify();
      tick();

      expect(store.dispatch.calls.count()).toBe(initialCallCount);

      component.ngOnDestroy();
      discardPeriodicTasks();
    }));

    it('should open playlist dialog on upload', () => {
      const dialogRef = {
        afterClosed: () => of(mockPlaylist),
      };
      dialog.open.and.returnValue(dialogRef as MatDialogRef<PlaylistDialog>);

      component.onUploadPlaylist();

      expect(dialog.open).toHaveBeenCalled();
    });

    it('should import playlist after dialog closes with result', fakeAsync(() => {
      const dialogRef = {
        afterClosed: () => of(mockPlaylist),
      };
      dialog.open.and.returnValue(dialogRef as MatDialogRef<PlaylistDialog>);

      component.onUploadPlaylist();
      tick();

      expect(store.dispatch).toHaveBeenCalledWith(
        jasmine.objectContaining({ playlistId: 'playlist123' }),
      );
      expect(snackBar.open).toHaveBeenCalledWith('Test Playlist uploaded!', 'Close');

      discardPeriodicTasks();
    }));

    it('should not import playlist if dialog is cancelled', fakeAsync(() => {
      const dialogRef = {
        afterClosed: () => of(null),
      };
      dialog.open.and.returnValue(dialogRef as MatDialogRef<PlaylistDialog>);
      const initialCallCount = store.dispatch.calls.count();

      component.onUploadPlaylist();
      tick();

      expect(store.dispatch.calls.count()).toBe(initialCallCount);

      discardPeriodicTasks();
    }));
  });

  describe('Utility Methods', () => {
    it('should format duration correctly', () => {
      expect(component.formatDuration(180000)).toBe('3:00');
      expect(component.formatDuration(125000)).toBe('2:05');
      expect(component.formatDuration(65000)).toBe('1:05');
      expect(component.formatDuration(5000)).toBe('0:05');
    });

    it('should get artist names as comma-separated string', () => {
      const artists: Artist[] = [
        {
          id: '1',
          name: 'Artist One',
          external_urls: {
            spotify: 'https://open.spotify.com/artist/1',
          },
          followers: {
            href: '',
            total: 0,
          },
          genres: [],
          href: '',
          images: [],
          popularity: 0,
          type: '',
          uri: '',
        },
        {
          id: '2',
          name: 'Artist Two',
          external_urls: {
            spotify: 'https://open.spotify.com/artist/2',
          },
          followers: {
            href: '',
            total: 0,
          },
          genres: [],
          href: '',
          images: [],
          popularity: 0,
          type: '',
          uri: '',
        },
        {
          id: '3',
          name: 'Artist Three',
          external_urls: {
            spotify: 'https://open.spotify.com/artist/3',
          },
          followers: {
            href: '',
            total: 0,
          },
          genres: [],
          href: '',
          images: [],
          popularity: 0,
          type: '',
          uri: '',
        },
      ];

      expect(component.getArtistNames(artists)).toBe('Artist One, Artist Two, Artist Three');
    });

    it('should handle single artist', () => {
      const artists: Artist[] = [
        {
          id: '1',
          name: 'Solo Artist',
          external_urls: {
            spotify: 'https://open.spotify.com/artist/1',
          },
          followers: {
            href: '',
            total: 0,
          },
          genres: [],
          href: '',
          images: [],
          popularity: 0,
          type: '',
          uri: '',
        },
      ];

      expect(component.getArtistNames(artists)).toBe('Solo Artist');
    });

    it('should handle empty artist array', () => {
      expect(component.getArtistNames([])).toBe('');
    });
  });

  describe('Component Cleanup', () => {
    it('should complete destroyed$ subject on destroy', () => {
      const destroyedSpy = spyOn(component['_destroyed$'], 'next');
      const completeSpy = spyOn(component['_destroyed$'], 'complete');

      component.ngOnDestroy();

      expect(destroyedSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });

  describe('Observables', () => {
    it('should have user$ observable', () => {
      expect(component.user$).toBeDefined();
    });

    it('should have isAuthenticated$ observable', () => {
      expect(component.isAuthenticated$).toBeDefined();
    });

    it('should have currentPlaylist$ observable', () => {
      expect(component.currentPlaylist$).toBeDefined();
    });

    it('should have currentTracks$ observable', () => {
      expect(component.currentTracks$).toBeDefined();
    });
  });
});
