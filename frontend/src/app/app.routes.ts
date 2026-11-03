import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards';

const lazy = (fn: () => Promise<any>) => ({ loadComponent: fn });

/** Pages d'un espace (coach ou salle) : chaque enfant reçoit data.espace. */
function enfantsEspace(espace: 'coach' | 'salle', pageProfil: { chemin: string; charger: () => Promise<any> }): Routes {
  const d = { espace };
  return [
    { path: '', data: d, loadComponent: () => import('./features/espace/espace-tableau/espace-tableau').then((m) => m.EspaceTableau) },
    { path: pageProfil.chemin, data: d, loadComponent: pageProfil.charger },
    { path: 'seances', data: d, loadComponent: () => import('./features/espace/espace-seances/espace-seances').then((m) => m.EspaceSeances) },
    { path: 'horaires', data: d, loadComponent: () => import('./features/espace/espace-horaires/espace-horaires').then((m) => m.EspaceHoraires) },
    { path: 'disponibilites', data: d, loadComponent: () => import('./features/espace/espace-disponibilites/espace-disponibilites').then((m) => m.EspaceDisponibilites) },
    { path: 'reservations', data: d, loadComponent: () => import('./features/espace/espace-reservations/espace-reservations').then((m) => m.EspaceReservations) },
    { path: 'calendrier', data: d, loadComponent: () => import('./features/espace/espace-calendrier/espace-calendrier').then((m) => m.EspaceCalendrier) },
    { path: 'avis', data: d, loadComponent: () => import('./features/espace/espace-avis/espace-avis').then((m) => m.EspaceAvis) },
  ];
}

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

      { path: 'favoris', canActivate: [authGuard], ...lazy(() => import('./features/sportif/favoris/favoris').then((m) => m.FavorisPage)) },
      { path: 'calendrier', canActivate: [authGuard], ...lazy(() => import('./features/sportif/calendrier-sportif/calendrier-sportif').then((m) => m.CalendrierSportif)) },
      { path: 'mes-reservations', canActivate: [authGuard], ...lazy(() => import('./features/sportif/mes-reservations/mes-reservations').then((m) => m.MesReservations)) },
      { path: 'mes-avis', canActivate: [authGuard], ...lazy(() => import('./features/sportif/mes-avis/mes-avis').then((m) => m.MesAvis)) },
      { path: 'avis/nouveau', canActivate: [authGuard], ...lazy(() => import('./features/sportif/laisser-avis/laisser-avis').then((m) => m.LaisserAvis)) },
      { path: 'compte', canActivate: [authGuard], ...lazy(() => import('./features/sportif/compte/compte').then((m) => m.Compte)) },
    ],
  },
  {
    path: 'coach',
    canActivate: [roleGuard('coach')],
    data: { espace: 'coach' },
    loadComponent: () => import('./layout/espace-layout/espace-layout').then((m) => m.EspaceLayout),
    children: enfantsEspace('coach', { chemin: 'profil', charger: () => import('./features/espace/profil-coach/profil-coach').then((m) => m.ProfilCoachPage) }),
  },
  {
    path: 'salle',
    canActivate: [roleGuard('salle')],
    data: { espace: 'salle' },
    loadComponent: () => import('./layout/espace-layout/espace-layout').then((m) => m.EspaceLayout),
    children: enfantsEspace('salle', { chemin: 'ma-salle', charger: () => import('./features/espace/ma-salle/ma-salle').then((m) => m.MaSalle) }),
  },
  { path: '**', redirectTo: '' },
];
