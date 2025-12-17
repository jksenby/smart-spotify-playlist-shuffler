import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthActions } from '@app/store/auth/auth.actions';
import { AuthState } from '@app/store/auth/auth.state';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { User } from '@app/_shared/models/user.model';

@Component({
  selector: 'app-main-page',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    NgxSpinnerModule,
    FormsModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private spinner = inject(NgxSpinnerService);

  public user$: Observable<User | null> = this.store.select(AuthState.getUser);
  public isAuthenticated$: Observable<boolean> = this.store.select(AuthState.isAuthenticated);
  public loading$: Observable<boolean> = this.store.select(AuthState.isLoading);
  public tracks$: Observable<any> | null = null;

  private readonly _destroyed$ = new Subject<void>();

  public newArtist: string = '';
  public newTitle: string = '';

  public onAdd() {}

  public onShuffle() {}

  public onLogin() {
    this.store.dispatch(new AuthActions.Login());
  }

  public onLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }

  ngOnInit(): void {
    this.store.dispatch(new AuthActions.GetCurrentUser());

    this.loading$.pipe(takeUntil(this._destroyed$)).subscribe((isLoading) => {
      if (isLoading) {
        this.spinner.show();
      } else {
        this.spinner.hide();
      }
    });
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
