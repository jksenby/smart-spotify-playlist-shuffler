import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@env/environment.development';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const isApiUrl = req.url.startsWith(environment.API_URL);

  if (isApiUrl) {
    const authReq = req.clone({
      withCredentials: true,
    });
    return next(authReq);
  }

  return next(req);
};