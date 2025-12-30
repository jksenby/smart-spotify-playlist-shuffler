import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-required',
  imports: [MatFormFieldModule],
  templateUrl: './required.html',
  styleUrl: './required.scss',
})
export class Required {
  control = input<AbstractControl | null>();
}
