import { inject, Injectable } from '@angular/core';
import { AuthModel } from '@app/_shared/models/auth.model';
import { AuthService } from '@app/_shared/services/auth-service';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Login, Logout, GetCurrentUser } from './auth.actions';
import { User } from '@app/_shared/models/spotify.model';
import { catchError, tap, throwError } from 'rxjs';

@State<AuthModel>({
  name: 'auth',
  defaults: {
    user: null,
    loading: false,
    error: null,
  },
})
@Injectable()
export class AuthState {
  private authService = inject(AuthService);

  @Selector()
  static isAuthenticated(state: AuthModel): boolean {
    return !!state.user;
  }

  @Selector()
  static getUser(state: AuthModel): User | null {
    return state.user ?? null;
  }

  @Selector()
  static isLoading(state: AuthModel): boolean {
    return state.loading;
  }

  @Selector()
  static getError(state: AuthModel): string | null {
    return state.error;
  }

  @Action(Login)
  login() {
    return this.authService.login();
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthModel>) {
    return this.authService.logout().pipe(
      tap(() => {
        ctx.setState({
          user: null,
          loading: false,
          error: null,
        });
      }),
    );
  }

  @Action(GetCurrentUser)
  getCurrentUser(ctx: StateContext<AuthModel>) {
    return this.authService.getCurrentUser().pipe(
      tap((user: User | null) => {
        ctx.patchState({
          user: user,
          loading: false,
          error: null,
        });
      }),
      catchError((err) => {
        ctx.patchState({
          user: null,
          loading: false,
          error: null,
        });
        return throwError(() => err);
      }),
    );
  }
}
