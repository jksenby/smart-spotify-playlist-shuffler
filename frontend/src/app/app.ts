import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSpinnerModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private translate = inject(TranslateService);
  constructor() {
    const lang = localStorage.getItem('lang');
    this.translate.addLangs(['en', 'ru']);
    this.translate.setFallbackLang('en');
    if (lang) {
      this.translate.use(lang);
    } else {
      localStorage.setItem('lang', 'en');
      this.translate.use('en');
    }
  }
}
