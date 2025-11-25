import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';
import { LoginFormComponent } from '@app/_shared/ui/login-form/login-form.component';
import { AuthActions } from '@app/store/auth/auth.actions';
import { Store } from '@ngxs/store';
import { UserFormModel } from '@app/_shared/models/auth.model';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, LoginFormComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  loading$: any;
  error$: any;

  constructor(private store: Store) {}

  onFormSubmit(data: { loginForm: UserFormModel; isRegister: boolean }) {
    const payload = data.loginForm;
    this.store.dispatch(new AuthActions.Login(payload)).subscribe((res) => console.log(res));
  }

  onSocialLogin(provider: string) {
    alert(`Social login with ${provider} not implemented in this demo`);
  }
}
