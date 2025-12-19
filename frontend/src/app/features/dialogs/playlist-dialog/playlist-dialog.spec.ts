import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistDialog } from './playlist-dialog';

describe('PlaylistDialog', () => {
  let component: PlaylistDialog;
  let fixture: ComponentFixture<PlaylistDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaylistDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
