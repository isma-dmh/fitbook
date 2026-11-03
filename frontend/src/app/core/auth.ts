import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, switchMap, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { CHEMINS } from './api';
import { Role, Utilisateur } from './models';

const CLE_TOKEN = 'fitbook_token';
const LD = 'application/ld+json';

function decoder(token: string | null): any {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
}

function tokenValide(token: string | null): boolean {
  const p = decoder(token);
  return !!p && (!p.exp || p.exp * 1000 > Date.now());
}

export interface DonneesInscription {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  role: 'sportif' | 'coach' | 'salle';
}

@Injectable({ providedIn: 'root' })
export class Auth {
  private http = inject(HttpClient);
  private router = inject(Router);
  private base = environment.apiUrl;

  private _token = signal<string | null>(this.lireToken());
  readonly token = this._token.asReadonly();
  readonly estConnecte = computed(() => this._token() !== null);

  /** Profil renvoyé par GET /me (null tant qu'il n'est pas chargé ou si l'API ne le fournit pas). */
  readonly profil = signal<Utilisateur | null>(null);
  /** État du chargement du profil : 'attente' tant que GET /me n'a pas répondu, 'erreur' s'il a échoué. */
  readonly profilEtat = signal<'attente' | 'ok' | 'erreur'>(this.lireToken() ? 'attente' : 'ok');

  readonly roles = computed<string[]>(() => decoder(this._token())?.roles ?? []);
  readonly role = computed<Role | null>(() => {
    const r = this.roles();
    if (r.includes('ROLE_ADMINISTRATEUR')) return 'administrateur';
    if (r.includes('ROLE_COACH')) return 'coach';
    if (r.includes('ROLE_SALLE')) return 'salle';
    if (r.includes('ROLE_SPORTIF')) return 'sportif';
    return null;
  });

  readonly email = computed<string>(() => {
    const p = decoder(this._token());
    return p?.username ?? p?.email ?? '';
  });

  readonly nomAffiche = computed<string>(() => {
    const p = this.profil();
    return p?.prenom ? `${p.prenom}` : this.email().split('@')[0];
  });

  /** IRI de l'utilisateur connecté, pour retrouver ses salles ou son profil coach. */
  readonly moiIri = computed<string | null>(() => {
    const p = this.profil();
    if (!p) return null;
    return p['@id'] ?? (p.id != null ? `/api/utilisateurs/${p.id}` : null);
  });

  constructor() {
    // Différé : l'intercepteur a besoin d'Auth, qui doit donc être entièrement construite avant le premier appel.
    if (this._token()) queueMicrotask(() => this.chargerProfil().subscribe());
  }

  private lireToken(): string | null {
    try {
      const t = localStorage.getItem(CLE_TOKEN);
      if (t && tokenValide(t)) return t;
      localStorage.removeItem(CLE_TOKEN);
    } catch {
      /* stockage indisponible */
    }
    return null;
  }

  connexion(email: string, password: string): Observable<void> {
    return this.http.post<{ token: string }>(`${this.base}/login_check`, { email, password }).pipe(
      tap((r) => {
        try {
          localStorage.setItem(CLE_TOKEN, r.token);
        } catch {
          /* ignoré */
        }
        this._token.set(r.token);
      }),
      switchMap(() => this.chargerProfil()),
      map(() => undefined),
    );
  }

  chargerProfil(): Observable<Utilisateur | null> {
    this.profilEtat.set('attente');
    return this.http
      .get<Utilisateur>(`${this.base}${CHEMINS.moi}`, { headers: { Accept: LD } })
      .pipe(
        catchError(() => of(null)),
        tap((p) => {
          this.profil.set(p);
          this.profilEtat.set(p ? 'ok' : 'erreur');
        }),
      );
  }

  inscription(donnees: DonneesInscription) {
    return this.http.post<{ message: string; emailEnvoye: boolean }>(`${this.base}/auth/register`, donnees);
  }

  renvoyerConfirmation(email: string) {
    return this.http.post(`${this.base}/auth/resend-verification`, { email });
  }

  motDePasseOublie(email: string) {
    return this.http.post(`${this.base}/auth/forgot-password`, { email });
  }

  reinitialiser(token: string, password: string) {
    return this.http.post(`${this.base}/auth/reset-password`, { token, password });
  }

  deconnexion(rediriger = true): void {
    try {
      localStorage.removeItem(CLE_TOKEN);
    } catch {
      /* ignoré */
    }
    this._token.set(null);
    this.profil.set(null);
    this.profilEtat.set('ok');
    if (rediriger) this.router.navigateByUrl('/');
  }

  /** Page d'accueil de l'espace de l'utilisateur selon son rôle. */
  accueilRole(): string {
    switch (this.role()) {
      case 'coach':
        return '/coach';
      case 'salle':
        return '/salle';
      case 'administrateur':
        return '/admin';
      default:
        return '/mes-reservations';
    }
  }
}
