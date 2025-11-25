import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserFormControls } from '@app/_shared/helpers/form.helper';
import { UserFormModel } from '@app/_shared/models/auth.model';
import { Required } from '../required/required';

@Component({
  selector: 'app-login-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    Required,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent {
  @Input() loading = false;
  @Input() errorMessage: string | null = null;

  @Output() formSubmit = new EventEmitter<{ loginForm: UserFormModel; isRegister: boolean }>();
  @Output() googleLogin = new EventEmitter<void>();
  @Output() appleLogin = new EventEmitter<void>();

  hidePassword = true;
  rememberMe = false;
  isRegister = false;

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group<UserFormControls>({
      username: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [Validators.required, Validators.minLength(8)]),
    });
  }

  toggleMode() {
    this.isRegister = !this.isRegister;
    this.errorMessage = null;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.formSubmit.emit({
      loginForm: this.form.value,
      isRegister: this.isRegister,
    });
  }
}
