import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@env/environment';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const isApiUrl = req.url.startsWith(environment.API_URL);

  if (isApiUrl) {
    const token = authService.getToken();

    const authReq = req.clone({
      withCredentials: true,
      setHeaders: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    return next(authReq);
  }

  return next(req);
};
