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
| Back-end | Symfony 8.1, API Platform 5 (API REST), authentification JWT (Lexik), Doctrine ORM et migrations, Symfony Mailer, VichUploader (images) |
| Front-end | Angular 21 (composants autonomes, signaux) |
| Base de données | MySQL 8 |
| Tests de l'API | Postman et Newman |

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
- [MLD](docs/mld/fitbook-mld.md) (modèle relationnel déduit de la base)
- [Diagramme de classes](docs/diagramme-classes/fitbook-diagramme.png) (fichier source : `.mdj`, StarUML)
- Maquettes Figma : wireframes et maquettes couleur pour mobile, tablette et desktop

## Installation

Prérequis : PHP 8.4 ou plus, Composer, MySQL 8, Node.js et npm, la CLI Symfony (pour le serveur HTTPS local).

### Back-end (`backend/`)

1. Installer les dépendances : `composer install`
2. Créer le fichier `backend/.env.local` (non versionné) avec vos valeurs :

```
APP_ENV=dev
APP_SECRET=une_chaine_secrete
DATABASE_URL="mysql://utilisateur:motdepasse@127.0.0.1:3306/fitbook?serverVersion=8.0.32&charset=utf8mb4"
JWT_PASSPHRASE=une_phrase_secrete
MAILER_DSN="smtp://identifiant:motdepasse@serveur:2525"
FRONTEND_URL=http://localhost:4200
```

3. Créer la base et le schéma : `php bin/console doctrine:database:create` puis `php bin/console doctrine:migrations:migrate`
4. Générer les clés JWT : `php bin/console lexik:jwt:generate-keypair`
5. Lancer l'API : `symfony server:start` (https://127.0.0.1:8000/api)

### Front-end (`frontend/`)

1. Installer les dépendances : `npm install`
2. Lancer l'application : `npm start` (http://localhost:4200)

L'adresse de l'API se règle dans `frontend/src/environments/` (`apiUrl`).

## Fonctionnement du back-end

- **Inscription** : un compte doit confirmer son email avant de pouvoir se connecter. Un administrateur peut aussi valider l'email d'un compte (`PATCH /api/utilisateurs/{id}` avec `emailVerifie`).
- **Réservation** : règles métier côté API (séance non annulée, non passée, non complète, une seule réservation par sportif) et emails de confirmation envoyés au sportif et au coach.
- **Administration** : liste, modification (nom, prénom, rôle, activation) et suppression des comptes, accessibles uniquement à l'administrateur ; un administrateur ne peut pas modifier son propre rôle ni supprimer son propre compte.
- **Procédures stockées MySQL** (créées par la migration `Version20261103034500`) : `sp_places_restantes`, `sp_reserver_seance` et `sp_note_moyenne`.

## Tests

- **API (Newman)** : scénario complet (connexion, création d'un coach, séance, nettoyage par l'administrateur) avec variables d'environnement. Le serveur doit tourner et la base contenir un compte administrateur ; adapter `adminEmail` et `adminPassword` dans `backend/postman/Env_fitbook.postman_environment.json`.

```
cd backend
newman run postman/fitbook.postman_collection.json -e postman/Env_fitbook.postman_environment.json --insecure
```

- **Front-end** : `cd frontend && npm test`

## Sauvegardes de la base

Trois sauvegardes SQL de la base `fitbook` sont dans [`backend/sauvegardes/`](backend/sauvegardes/) (générées avec `mysqldump`). Elles ne contiennent pas les procédures stockées, qui sont créées par les migrations. Pour restaurer l'une d'elles : `mysql -u root fitbook < backend/sauvegardes/fitbook_backup1.sql`.

## Organisation Git

- `main` : version stable
- `develop` : intégration
- `feature/*` : une branche par fonctionnalité, fusionnée dans `develop` par pull request

## Auteur

Ismail — UAA MI08
