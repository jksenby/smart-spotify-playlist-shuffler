import { HttpInterceptorFn } from '@angular/common/http';

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  const protectedMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];

  if (protectedMethods.includes(req.method)) {
    let token = sessionStorage.getItem('csrf_token');

    if (!token) {
      token = generateCsrfToken();
      sessionStorage.setItem('csrf_token', token);
    }

    req = req.clone({
      setHeaders: { 'X-CSRF-Token': token },
    });
  }

  return next(req);
};

function generateCsrfToken(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function verifyOAuthState(receivedState: string): boolean {
  const storedState = sessionStorage.getItem('oauth_state');
  sessionStorage.removeItem('oauth_state');
  return storedState === receivedState && storedState !== null;
}
