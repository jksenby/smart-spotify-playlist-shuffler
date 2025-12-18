import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileMenu } from './user-profile-menu';

describe('UserProfileMenu', () => {
  let component: UserProfileMenu;
  let fixture: ComponentFixture<UserProfileMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfileMenu],
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
