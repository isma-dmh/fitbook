import { Ref } from './models';

/** IRI d'une relation, qu'elle soit une chaîne ou un objet imbriqué. */
export function iri(r: Ref<{ '@id'?: string }> | null | undefined): string | null {
  if (!r) return null;
  return typeof r === 'string' ? r : (r['@id'] ?? null);
}

/** Identifiant numérique à la fin d'une IRI ("/api/salles/12" -> 12). */
export function idDe(r: Ref<{ '@id'?: string; id?: number }> | null | undefined): number | null {
  if (!r) return null;
  if (typeof r !== 'string' && r.id != null) return r.id;
  const m = /(\d+)$/.exec(iri(r) ?? '');
  return m ? Number(m[1]) : null;
}

/** "2026-11-05T00:00:00+00:00" -> "2026-11-05". On découpe la chaîne pour éviter tout décalage de fuseau. */
export function jour(valeur: string | null | undefined): string {
  return valeur ? valeur.slice(0, 10) : '';
}

/** "1970-01-01T18:30:00+00:00" ou "18:30:00" -> "18:30". */
export function heure(valeur: string | null | undefined): string {
  if (!valeur) return '';
  const i = valeur.indexOf('T');
  return (i >= 0 ? valeur.slice(i + 1) : valeur).slice(0, 5);
}

export function jourFr(valeur: string | null | undefined): string {
  const j = jour(valeur);
  if (!j) return '';
  const [a, m, d] = j.split('-');
  return `${d}/${m}/${a}`;
}

export function jourCourt(valeur: string | null | undefined): string {
  const j = jour(valeur);
  if (!j) return '';
  const [, m, d] = j.split('-');
  return `${d}/${m}`;
}

/** Début d'une séance sous forme de Date locale. */
export function debutSeance(s: { dateSeance: string; heureDebut: string }): Date {
  return new Date(`${jour(s.dateSeance)}T${heure(s.heureDebut) || '00:00'}:00`);
}

export function estPassee(s: { dateSeance: string; heureDebut: string }): boolean {
  return debutSeance(s).getTime() < Date.now();
}

export const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

export function nomJour(n: number): string {
  return JOURS[n - 1] ?? '';
}

export function nomComplet(u: Ref<{ nom?: string; prenom?: string }> | null | undefined): string {
  if (!u || typeof u === 'string') return '';
  return `${u.prenom ?? ''} ${u.nom ?? ''}`.trim();
}

export function initiales(texte: string): string {
  return (
    texte
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((m) => m[0].toUpperCase())
      .join('') || '?'
  );
}

export function moyenne(notes: number[]): number | null {
  if (!notes.length) return null;
  return Math.round((notes.reduce((a, n) => a + n, 0) / notes.length) * 10) / 10;
}

export function prix(valeur: number | null | undefined): string {
  if (valeur == null) return '';
  return `${Number(valeur).toFixed(2).replace('.', ',')} €`;
}

/** Message lisible à partir d'une erreur HTTP (API Platform, contrôleurs d'auth ou Symfony). */
export function messageErreur(e: any, defaut = 'Une erreur est survenue.'): string {
  const c = e?.error;
  if (!c) return e?.status === 0 ? "Impossible de joindre le serveur." : defaut;
  if (c.errors && typeof c.errors === 'object') return Object.values(c.errors).join(' ');
  if (Array.isArray(c.violations) && c.violations.length)
    return c.violations.map((v: any) => v.message).join(' ');
  return c.error ?? c.message ?? c.detail ?? c['hydra:description'] ?? c.description ?? defaut;
}

/** Minuscules sans accents, pour comparer des textes lors d'une recherche. */
export function norm(texte: string | null | undefined): string {
  return (texte ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}
