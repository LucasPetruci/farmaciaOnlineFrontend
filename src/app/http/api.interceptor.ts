import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('http://') || req.url.startsWith('https://')) {
    return next(req);
  }

  const url = req.url.startsWith('/') 
    ? `${environment.apiUrl}${req.url}`
    : `${environment.apiUrl}/${req.url}`;

  let headers = req.headers
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');

  const token = localStorage.getItem('auth_token');
  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  const clonedReq = req.clone({
    url,
    headers
  });

  return next(clonedReq);
};
