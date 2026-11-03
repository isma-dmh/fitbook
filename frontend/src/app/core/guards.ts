import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from './auth';
import { Role } from './models';

/** Réserve une route aux utilisateurs connectés. */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(Auth);
  if (auth.estConnecte()) return true;
  return inject(Router).createUrlTree(['/connexion'], { queryParams: { retour: state.url } });
};

/** Réserve une route à certains rôles (US-T8). */
export function roleGuard(...roles: Role[]): CanActivateFn {
  return () => {
    const auth = inject(Auth);
    const router = inject(Router);
    if (!auth.estConnecte()) return router.createUrlTree(['/connexion']);
    const role = auth.role();
    return role && roles.includes(role) ? true : router.createUrlTree([auth.accueilRole()]);
  };
}
