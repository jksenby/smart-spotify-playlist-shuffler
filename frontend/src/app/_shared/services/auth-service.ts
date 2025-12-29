import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { User } from '../models/spotify.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public apiUrl = `${environment.API_URL}/auth`;
  private userSubject = new BehaviorSubject<User | null>(null);
  public user = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  public get currentUserValue(): User | null {
    return this.userSubject.value;
  }

  public setToken(token: string): void {
    sessionStorage.setItem('access_token', token);
  }

  public getToken(): string | null {
    return sessionStorage.getItem('access_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  login() {
    window.location.href = `${this.apiUrl}/login`;
  }

  getUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  logout(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/logout`).pipe(
      tap(() => {
        sessionStorage.removeItem('access_token');
        this.userSubject.next(null);
        location.reload();
      }),
      catchError((error) => {
        sessionStorage.removeItem('access_token');
        this.userSubject.next(null);
        console.error('Logout failed:', error);
        return of(null);
      }),
    );
  }

  getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`).pipe(
      tap((user) => {
        this.userSubject.next(user);
      }),
      catchError((error) => {
        console.error('Get current user failed:', error);
        return of(null);
      }),
    );
  }
}
