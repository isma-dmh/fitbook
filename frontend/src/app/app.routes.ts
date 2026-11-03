import { Routes } from '@angular/router';

const lazy = (fn: () => Promise<any>) => ({ loadComponent: fn });

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/public-layout/public-layout').then((m) => m.PublicLayout),
    children: [
      { path: 'connexion', ...lazy(() => import('./features/auth/connexion/connexion').then((m) => m.Connexion)) },
      { path: 'inscription', ...lazy(() => import('./features/auth/inscription/inscription').then((m) => m.Inscription)) },
      { path: 'email-verifie', ...lazy(() => import('./features/auth/email-verifie/email-verifie').then((m) => m.EmailVerifie)) },
      { path: 'renvoyer-confirmation', data: { mode: 'confirmation' }, ...lazy(() => import('./features/auth/email-seul/email-seul').then((m) => m.EmailSeul)) },
      { path: 'mot-de-passe-oublie', data: { mode: 'motdepasse' }, ...lazy(() => import('./features/auth/email-seul/email-seul').then((m) => m.EmailSeul)) },
      { path: 'reinitialiser-mot-de-passe', ...lazy(() => import('./features/auth/mdp-reset/mdp-reset').then((m) => m.MdpReset)) },
    ],
  },
  { path: '**', redirectTo: '' },
];
