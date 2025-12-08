import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '@env/environment.development';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public apiUrl = `${environment.API_URL}/auth`;
  private userSubject = new BehaviorSubject<User | null>(null);
  public user = this.userSubject.asObservable();
  constructor(private http: HttpClient, private router: Router) {}

  public get currentUserValue(): User | null {
    return this.userSubject.value;
  }

  isAuthenticated(): boolean {
    return true;
  }

  login() {
    window.location.href = `${this.apiUrl}/login`;
  }

  getUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`)
  }

  logout(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/logout`).pipe(
      tap(() => {
        this.userSubject.next(null);
        this.router.navigate(['/']);
      }),
      catchError((error) => {
        this.userSubject.next(null);
        console.error('Logout failed:', error);
        return of(null);
      })
    );
  }

  getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`).pipe(
      tap((user) => {
        this.userSubject.next(null);
      }),
      catchError((error) => {
        console.error('Get current user failed:', error);
        return of(null);
      })
    );
  }
}
