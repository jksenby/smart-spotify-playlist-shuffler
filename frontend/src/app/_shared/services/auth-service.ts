import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthModel, UserFormModel } from '../models/auth.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  isAuthenticated(): boolean {
    return true;
  }

  login(body: UserFormModel) {
    window.location.href = 'http://localhost:8000/auth/login';
  }
}
