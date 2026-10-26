# Cahier des charges — FitBook

## 1. Contexte et objectif

FitBook est une plateforme web qui permet de trouver et de réserver des séances de sport. Aujourd'hui, un sportif doit contacter chaque salle ou chaque coach séparément pour connaître les horaires, les places disponibles et les tarifs. FitBook centralise ces informations et la réservation au même endroit.

**Objectif** : permettre à un sportif de trouver une salle, un coach ou une séance, de la réserver en ligne, et de partager son avis ensuite. Les coachs et les salles gèrent leur offre et leurs disponibilités dans la même application.

## 2. Public cible et rôles

| Rôle | Description |
|---|---|
| Visiteur | Personne non connectée. Peut consulter et rechercher, sans réserver. |
| Sportif | Cherche et réserve des séances, gère ses favoris, laisse des avis. |
| Coach | Propose des séances, gère son profil professionnel, ses horaires et ses disponibilités. |
| Gestionnaire (salle) | Gère la fiche de sa salle, ses activités, ses cours, ses horaires et sa capacité. |
| Administrateur | Gère les comptes, les contenus et les activités, et modère les avis. |

Chaque utilisateur a un rôle (entité `ROLE`) et n'accède qu'aux pages correspondant à ce rôle.

## 3. Périmètre fonctionnel

Les besoins détaillés sont décrits dans les [user stories](user-stories.md) (identifiants US-S, US-C, US-G, US-A et US-T).

### 3.1 Fonctionnalités obligatoires

1. **Recherche** : barre de recherche (salle, coach, activité, ville) et filtres (type, ville, activité, note, prix, disponibilité). US-S3, US-S4, US-T1.
2. **Favoris** : ajouter, retirer et consulter ses salles, coachs et séances favoris. US-S13, US-S14.
3. **Avis et notes** : noter et commenter une salle ou un coach, modifier ou supprimer son avis, consulter les avis reçus, modération par l'administrateur. US-S15, US-S16, US-C11, US-G11, US-A8, US-A9.
4. **Calendrier** : calendrier des réservations du sportif, du coach et de la salle. US-S17, US-C8, US-G8.

### 3.2 Autres fonctionnalités

- **Comptes et sécurité** : inscription avec choix du rôle, confirmation de l'adresse email par lien, nouvel envoi du lien s'il a expiré, connexion, déconnexion, réinitialisation du mot de passe par email, contrôle d'accès selon le rôle. US-T2 à US-T8.
- **Profils** : profil du sportif (nom, photo, objectifs, niveau), profil professionnel du coach (photo, présentation, spécialités, tarifs, ville). US-S1, US-S2, US-C1, US-C2.
- **Salles** : fiche de la salle (nom, adresse, description, photos, équipements), activités proposées, horaires d'ouverture, capacité. US-G1 à US-G6.
- **Séances** : création, modification et suppression par un coach ou un gestionnaire, avec activité, date, heure, durée, capacité et prix. US-C3 à US-C5, US-G4.
- **Horaires et disponibilités** : horaires de travail et disponibilités du coach, ouverture, blocage et fermeture exceptionnelle de la salle. US-C6, US-C7, US-G7.
- **Réservations** : réserver, être informé qu'une séance est complète, annuler, consulter l'historique, consulter les réservations de ses séances. US-S8 à US-S11, US-C9, US-G9.
- **Notifications par email** : confirmation ou annulation d'une réservation pour le sportif, nouvelle réservation ou annulation pour le coach et le gestionnaire. US-S12, US-C10, US-G10, US-T9.
- **Administration** : liste, modification, désactivation et suppression des comptes, attribution des rôles, gestion des salles, coachs, activités et réservations. US-A1 à US-A7.

### 3.3 Hors périmètre

Les points suivants ne figurent dans aucune user story et ne sont pas prévus dans cette version : paiement en ligne, messagerie entre utilisateurs, application mobile native.

## 4. Règles de gestion

- Une séance a une capacité maximale ; une réservation n'est possible que s'il reste des places. Quand la séance est complète, le sportif en est informé (US-S9).
- La capacité d'une séance ne peut pas dépasser celle de la salle où elle se déroule (US-G6, rappelée dans la maquette de création de séance).
- Un sportif ne peut noter une salle ou un coach qu'après une séance passée et confirmée (US-S15, rappelée dans la maquette « Laisser un avis »).
- Un sportif ne peut modifier ou supprimer que ses propres avis ; l'administrateur peut supprimer tout avis inapproprié.
- Un compte doit être confirmé par email avant d'être actif ; le lien de confirmation expire et peut être renvoyé.
- Un compte désactivé par l'administrateur ne peut plus se connecter.
- Un coach peut travailler dans plusieurs salles, et une salle accueille plusieurs coachs.

## 5. Modèle de données

Le modèle est décrit dans le [MCD](mcd/fitbook-mcd.png) et dans le [diagramme de classes](diagramme-classes/fitbook-diagramme.png). Il compte 13 entités et 22 associations.

| Entité | Rôle dans le modèle |
|---|---|
| `UTILISATEUR` | Compte de toute personne connectée (avec jeton de confirmation et de réinitialisation du mot de passe) |
| `ROLE` | Rôle de l'utilisateur |
| `PROFIL_COACH` | Profil professionnel d'un utilisateur coach |
| `SALLE` | Salle de sport, gérée par un utilisateur |
| `PHOTO_SALLE` | Photos d'une salle |
| `EQUIPEMENT` | Équipements proposés par les salles |
| `ACTIVITE` | Activité sportive (yoga, boxe, musculation…) |
| `SEANCE` | Séance donnée par un coach, dans une salle, sur une activité |
| `RESERVATION` | Réservation d'un sportif pour une séance |
| `AVIS` | Note et commentaire, sur une salle ou sur un coach |
| `HORAIRE_SALLE` | Horaires d'ouverture d'une salle |
| `HORAIRE_COACH` | Horaires de travail d'un coach |
| `DISPONIBILITE` | Créneaux ouverts ou bloqués, pour un coach ou une salle |

Les favoris (salles, coachs, séances) sont des associations entre l'utilisateur et chacune de ces entités.

## 6. Contraintes techniques

- **Back-end** : API Symfony.
- **Front-end** : application Angular 21.
- **Base de données** : MySQL.
- **Interface** : responsive, maquettes prévues pour mobile, tablette et desktop (voir Figma).
- **Sécurité** : authentification, mots de passe stockés de façon sécurisée, accès limité selon le rôle, confirmation de l'adresse email.
- **Emails** : confirmation de compte, réinitialisation du mot de passe, réservations.

## 7. Conception réalisée (partie 1)

| Livrable | Emplacement |
|---|---|
| User stories | `docs/user-stories.md` |
| Cas d'utilisation (4 diagrammes) | `docs/use-cases/` |
| MCD | `docs/mcd/` |
| Diagramme de classes | `docs/diagramme-classes/` |
| Maquettes (54 wireframes et 54 maquettes couleur : 18 écrans × mobile, tablette, desktop) | Figma, fichier « fitbook » |

Les 18 écrans maquettés : accueil, résultats de recherche, détail d'une salle, profil d'un coach, réservation, connexion, inscription, favoris, calendrier, laisser un avis, compte, espace coach, ajout d'une disponibilité, espace salle, création d'une séance, ma salle, administration des utilisateurs, modération des avis.

## 8. Livraison et organisation

- **Partie 2 : développement.** Ordre prévu : authentification et rôles, salles, coachs et séances, recherche, réservation et calendrier, favoris, avis et notes, administration.
- Gestion de version avec Git : branche `develop` pour l'intégration, une branche `feature/*` par fonctionnalité, pull requests vers `develop`.
