/** Une relation API Platform arrive soit sous forme d'IRI ("/api/salles/3"), soit imbriquée. */
export type Ref<T> = string | T;

export interface Entite {
  '@id'?: string;
  id: number;
  dateCreation?: string;
}

export interface Activite extends Entite {
  nom: string;
  description: string | null;
}

export interface Equipement extends Entite {
  nom: string;
}

/** Données d'un utilisateur telles que le front les attend (GET /me, GET /utilisateurs). */
export interface Utilisateur extends Entite {
  email?: string;
  nom?: string;
  prenom?: string;
  image?: string | null;
  objectifs?: string | null;
  niveau?: string | null;
  emailVerifie?: boolean;
  actif?: boolean;
  roleLibelle?: string;
  favorisSalles?: string[];
  favorisCoachs?: string[];
  favorisSeances?: string[];
}

export interface Salle extends Entite {
  nom: string;
  adresse: string;
  ville: string;
  description: string;
  capaciteMax: number;
  gestionnaire?: Ref<Utilisateur>;
  equipements: string[];
  activites: string[];
}

export interface HoraireSalle extends Entite {
  jourSemaine: number;
  heureOuverture: string;
  heureFermeture: string;
  salle: string;
}

export interface PhotoSalle extends Entite {
  url: string;
  salle: string;
}

export interface ProfilCoach extends Entite {
  presentation: string;
  specialites: string;
  tarifHoraire: number;
  ville: string;
  utilisateur?: Ref<Utilisateur>;
  salles: string[];
}

export interface HoraireCoach extends Entite {
  jourSemaine: number;
  heureDebut: string;
  heureFin: string;
  profilCoach: string;
}

export interface Seance extends Entite {
  dateSeance: string;
  heureDebut: string;
  dureeMinutes: number;
  capacite: number;
  prix: number;
  statut: string;
  activite: string;
  profilCoach?: string | null;
  salle?: string | null;
  reservations?: string[];
  /** Calculé par le backend (capacité moins réservations confirmées) quand il est configuré. */
  placesRestantes?: number;
}

export interface Disponibilite extends Entite {
  dateDispo: string;
  heureDebut: string;
  heureFin: string;
  type: string;
  profilCoach?: string | null;
  salle?: string | null;
}

export interface Reservation extends Entite {
  statut: string;
  utilisateur?: Ref<Utilisateur>;
  seance: string;
}

export interface Avis extends Entite {
  note: number;
  commentaire: string | null;
  utilisateur?: Ref<Utilisateur>;
  salle?: string | null;
  profilCoach?: string | null;
}

export type Role = 'sportif' | 'coach' | 'salle' | 'administrateur';

export interface Page<T> {
  items: T[];
  suivante: boolean;
}
