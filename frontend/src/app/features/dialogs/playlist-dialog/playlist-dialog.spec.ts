import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistDialog } from './playlist-dialog';
import { provideHttpClient } from '@angular/common/http';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('PlaylistDialog', () => {
  let component: PlaylistDialog;
  let fixture: ComponentFixture<PlaylistDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistDialog],
      providers: [
        provideHttpClient(),
        { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaylistDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
