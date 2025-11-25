import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Required } from './required';

describe('Required', () => {
  let component: Required;
  let fixture: ComponentFixture<Required>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Required],
    }).compileComponents();

    fixture = TestBed.createComponent(Required);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
