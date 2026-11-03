import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Auth } from './auth';

/** Ajoute le jeton JWT aux appels vers l'API et déconnecte l'utilisateur si le jeton est refusé. */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  const router = inject(Router);
  const token = auth.token();
  const versApi = req.url.startsWith(environment.apiUrl);

  const requete = token && versApi ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(requete).pipe(
    catchError((e: HttpErrorResponse) => {
      if (e.status === 401 && token && versApi && !req.url.endsWith('/login_check')) {
        auth.deconnexion(false);
        router.navigate(['/connexion'], { queryParams: { session: 'expiree' } });
      }
      return throwError(() => e);
    }),
  );
};
