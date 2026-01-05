import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/_shared/services/auth-service';
import { verifyOAuthState } from '@app/_shared/security/csrf.interceptor';

@Component({
  selector: 'app-auth-callback',
  imports: [],
  templateUrl: './auth-callback.html',
  styleUrl: './auth-callback.scss',
})
export class AuthCallback implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      const state = params['state'];

      if (state && !verifyOAuthState(state)) {
        console.error('CSRF attack detected!');
        this.router.navigate(['/']);
        return;
      }

      if (token) {
        this.authService.setToken(token);
        this.router.navigate(['/']);
      } else {
        this.router.navigate(['/']);
      }
    });
  }
}
