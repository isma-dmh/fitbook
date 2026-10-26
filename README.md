# FitBook

Plateforme web de réservation de séances de sport qui met en relation des **sportifs**, des **coachs** et des **salles de sport**.
Projet de l'UAA MI08.

## Fonctionnalités principales

- **Recherche** de salles, de coachs et de séances (barre de recherche et filtres : type, ville, activité, note, prix, disponibilité)
- **Réservation** et annulation de séances, avec email de confirmation
- **Calendrier** des réservations, séances et disponibilités
- **Favoris** (salles, coachs, séances)
- **Avis et notes** sur les salles et les coachs, avec modération par l'administrateur
- **Gestion par rôle** : sportif, coach, gestionnaire de salle, administrateur

## Stack technique

| Couche | Technologie |
|---|---|
| Back-end | Symfony (API) |
| Front-end | Angular 21 |
| Base de données | MySQL |

## Rôles

| Rôle | Peut faire |
|---|---|
| Visiteur | Consulter et rechercher salles, coachs et séances |
| Sportif | Réserver, gérer ses favoris, laisser des avis, voir son calendrier |
| Coach | Gérer son profil, ses séances, ses horaires et disponibilités |
| Gestionnaire | Gérer sa salle, ses activités, ses cours, ses horaires et capacités |
| Administrateur | Gérer les utilisateurs, les contenus, les activités et modérer les avis |

## Documentation

Toute la conception se trouve dans le dossier [`docs/`](docs/) :

- [Cahier des charges](docs/cahier-des-charges.md)
- [User stories](docs/user-stories.md)
- [Diagrammes de cas d'utilisation](docs/use-cases/)
- [MCD](docs/mcd/fitbook-mcd.png) (fichier source : `docs/mcd/fitbook.mcd`, Looping)
- [Diagramme de classes](docs/diagramme-classes/fitbook-diagramme.png) (fichier source : `.mdj`, StarUML)
- Maquettes Figma : wireframes et maquettes couleur pour mobile, tablette et desktop

## Installation

Le développement (partie 2) n'a pas encore démarré. Les instructions d'installation du back-end et du front-end seront ajoutées ici.

## Organisation Git

- `main` : version stable
- `develop` : intégration
- `feature/*` : une branche par fonctionnalité, fusionnée dans `develop` par pull request

## Auteur

Ismail — UAA MI08
