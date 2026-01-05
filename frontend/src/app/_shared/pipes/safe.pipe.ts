import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safe',
  standalone: true,
})
export class SafePipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(
    value: string,
    type: 'html' | 'url' | 'resourceUrl' = 'html',
  ): SafeHtml | SafeUrl | SafeResourceUrl {
    switch (type) {
      case 'html':
        return this.sanitizer.sanitize(1, value) || '';
      case 'url':
        return this.sanitizer.sanitize(4, value) || '';
      case 'resourceUrl':
        return this.sanitizer.sanitize(5, value) || '';
      default:
        return value;
    }
  }
}
