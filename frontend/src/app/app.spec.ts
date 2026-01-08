import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { TranslateService } from '@ngx-translate/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

describe('App', () => {
  beforeEach(async () => {
    const translateSpy = jasmine.createSpyObj('TranslateService', [
      'use',
      'instant',
      'setFallbackLang',
      'addLangs',
    ]);
    translateSpy.use.and.returnValue(of({}));
    translateSpy.instant.and.callFake((key: string) => key);

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: TranslateService, useValue: translateSpy },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
