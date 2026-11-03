import { Routes } from '@angular/router';

const lazy = (fn: () => Promise<any>) => ({ loadComponent: fn });

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/public-layout/public-layout').then((m) => m.PublicLayout),
    children: [
      { path: '', ...lazy(() => import('./features/home/home/home').then((m) => m.Home)) },
      { path: 'recherche', ...lazy(() => import('./features/recherche/recherche/recherche').then((m) => m.Recherche)), data: { type: 'salles' } },
      { path: 'salles', ...lazy(() => import('./features/recherche/recherche/recherche').then((m) => m.Recherche)), data: { type: 'salles' } },
      { path: 'coachs', ...lazy(() => import('./features/recherche/recherche/recherche').then((m) => m.Recherche)), data: { type: 'coachs' } },
      { path: 'seances', ...lazy(() => import('./features/recherche/recherche/recherche').then((m) => m.Recherche)), data: { type: 'seances' } },
      { path: 'salles/:id', ...lazy(() => import('./features/salles/salle-detail/salle-detail').then((m) => m.SalleDetail)) },
      { path: 'coachs/:id', ...lazy(() => import('./features/coachs/coach-detail/coach-detail').then((m) => m.CoachDetail)) },
      { path: 'seances/:id', ...lazy(() => import('./features/seances/seance-detail/seance-detail').then((m) => m.SeanceDetail)) },

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
