import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-required',
  imports: [MatFormFieldModule, CommonModule],
  templateUrl: './required.html',
  styleUrl: './required.scss',
})
export class Required {
  control = input<AbstractControl | null>();
}
