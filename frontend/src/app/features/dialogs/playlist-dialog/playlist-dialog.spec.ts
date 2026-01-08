import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlaylistDialog } from './playlist-dialog';
import { provideHttpClient } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

describe('PlaylistDialog', () => {
  let component: PlaylistDialog;
  let fixture: ComponentFixture<PlaylistDialog>;

  beforeEach(async () => {
    const translateSpy = jasmine.createSpyObj('TranslateService', ['use', 'instant', 'get']);
    translateSpy.use.and.returnValue(of({}));
    translateSpy.get.and.returnValue(of({}));
    translateSpy.instant.and.callFake((key: string) => key);

    await TestBed.configureTestingModule({
      imports: [PlaylistDialog],
      providers: [
        provideHttpClient(),
        { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) },
        { provide: TranslateService, useValue: translateSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaylistDialog);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
