import { Injectable } from '@angular/core';
import { AuthModel } from '@app/_shared/models/auth.model';
import { AuthService } from '@app/_shared/services/auth-service';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AuthActions } from './auth.actions';
import { tap } from 'rxjs';

@State<AuthModel>({
  name: 'auth',
  defaults: {
    username: null,
    token: null,
    loading: false,
    error: null,
  },
})
@Injectable()
export class AuthState {
  @Selector()
  static isAutheticated(state: AuthModel): boolean {
    return !!state.token;
  }

  @Selector()
  static selectUser(state: AuthModel) {
    return state;
  }

  constructor(private authService: AuthService) {}

  @Action(AuthActions.Login)
  login(ctx: StateContext<AuthModel>, action: AuthActions.Login) {
    return this.authService.login(action.payload).pipe(
      tap((res) => {
        ctx.patchState({
          username: res.username,
          token: res.token,
        });
      }),
    );
  }

  @Action(AuthActions.Register)
  register(ctx: StateContext<AuthModel>, action: AuthActions.Register) {
    return this.authService.login(action.payload).pipe(
      tap((res) => {
        ctx.patchState({
          username: res.username,
          token: res.token,
        });
      }),
    );
  }
}
