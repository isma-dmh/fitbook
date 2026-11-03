# Modèle logique de données (MLD) — FitBook

Modèle relationnel déduit du schéma réel de la base MySQL `fitbook` (migrations Doctrine).

Notation : <u>clé primaire</u> soulignée, `#clé_étrangère` précédée d'un dièse (avec la table référencée), `(NULL)` pour une colonne facultative, `(unique)` pour une valeur unique.

## Schéma relationnel

| Table | Colonnes |
|---|---|
| **activite** | <u>id</u>, nom, description (NULL), date_creation, date_modification |
| **avis** | <u>id</u>, note, commentaire (NULL), date_creation, date_modification, #utilisateur_id → utilisateur, #salle_id → salle (NULL), #profil_coach_id → profil_coach (NULL) |
| **disponibilite** | <u>id</u>, date_dispo, heure_debut, heure_fin, type, date_creation, date_modification, #profil_coach_id → profil_coach (NULL), #salle_id → salle (NULL) |
| **equipement** | <u>id</u>, nom |
| **horaire_coach** | <u>id</u>, jour_semaine, heure_debut, heure_fin, #profil_coach_id → profil_coach |
| **horaire_salle** | <u>id</u>, jour_semaine, heure_ouverture, heure_fermeture, #salle_id → salle |
| **photo_salle** | <u>id</u>, url, date_creation, #salle_id → salle |
| **profil_coach** | <u>id</u>, presentation, specialites, tarif_horaire, ville, date_creation, date_modification, #utilisateur_id → utilisateur (unique) |
| **profil_coach_salle** | <u>#profil_coach_id</u> → profil_coach, <u>#salle_id</u> → salle |
| **reservation** | <u>id</u>, statut, date_creation, date_modification, #utilisateur_id → utilisateur, #seance_id → seance |
| **reset_password_request** | <u>id</u>, selector, hashed_token, requested_at, expires_at, #user_id → utilisateur |
| **role** | <u>id</u>, libelle |
| **salle** | <u>id</u>, nom, adresse, ville, description, capacite_max, date_creation, date_modification, #gestionnaire_id → utilisateur |
| **salle_activite** | <u>#salle_id</u> → salle, <u>#activite_id</u> → activite |
| **salle_equipement** | <u>#salle_id</u> → salle, <u>#equipement_id</u> → equipement |
| **seance** | <u>id</u>, date_seance, heure_debut, duree_minutes, capacite, prix, statut, date_creation, date_modification, #activite_id → activite, #profil_coach_id → profil_coach (NULL), #salle_id → salle (NULL) |
| **utilisateur** | <u>id</u>, email (unique), mot_de_passe, nom, prenom, image (NULL), objectifs (NULL), niveau (NULL), email_verifie, actif, date_creation, date_modification, #role_id → role |
| **utilisateur_profil_coach** | <u>#utilisateur_id</u> → utilisateur, <u>#profil_coach_id</u> → profil_coach |
| **utilisateur_salle** | <u>#utilisateur_id</u> → utilisateur, <u>#salle_id</u> → salle |
| **utilisateur_seance** | <u>#utilisateur_id</u> → utilisateur, <u>#seance_id</u> → seance |

## Tables d'association (relations plusieurs-à-plusieurs)

- `profil_coach_salle` : salles où intervient un coach.
- `salle_activite` : activités proposées par une salle.
- `salle_equipement` : équipements d'une salle.
- `utilisateur_salle` : salles favorites d'un utilisateur.
- `utilisateur_profil_coach` : coachs favoris d'un utilisateur.
- `utilisateur_seance` : séances favorites d'un utilisateur.

La table technique `doctrine_migration_versions` (suivi des migrations) n'est pas représentée.

## Diagramme

```mermaid
erDiagram
    profil_coach o|--o{ avis : "profil_coach_id"
    salle o|--o{ avis : "salle_id"
    utilisateur ||--o{ avis : "utilisateur_id"
    profil_coach o|--o{ disponibilite : "profil_coach_id"
    salle o|--o{ disponibilite : "salle_id"
    profil_coach ||--o{ horaire_coach : "profil_coach_id"
    salle ||--o{ horaire_salle : "salle_id"
    salle ||--o{ photo_salle : "salle_id"
    utilisateur ||--o| profil_coach : "utilisateur_id"
    profil_coach ||--o{ profil_coach_salle : "profil_coach_id"
    salle ||--o{ profil_coach_salle : "salle_id"
    seance ||--o{ reservation : "seance_id"
    utilisateur ||--o{ reservation : "utilisateur_id"
    utilisateur ||--o{ reset_password_request : "user_id"
    utilisateur ||--o{ salle : "gestionnaire_id"
    activite ||--o{ salle_activite : "activite_id"
    salle ||--o{ salle_activite : "salle_id"
    equipement ||--o{ salle_equipement : "equipement_id"
    salle ||--o{ salle_equipement : "salle_id"
    profil_coach o|--o{ seance : "profil_coach_id"
    activite ||--o{ seance : "activite_id"
    salle o|--o{ seance : "salle_id"
    role ||--o{ utilisateur : "role_id"
    profil_coach ||--o{ utilisateur_profil_coach : "profil_coach_id"
    utilisateur ||--o{ utilisateur_profil_coach : "utilisateur_id"
    salle ||--o{ utilisateur_salle : "salle_id"
    utilisateur ||--o{ utilisateur_salle : "utilisateur_id"
    seance ||--o{ utilisateur_seance : "seance_id"
    utilisateur ||--o{ utilisateur_seance : "utilisateur_id"

    activite {
        int id PK
        varchar nom
        longtext description
        datetime date_creation
        datetime date_modification
    }
    avis {
        int id PK
        int note
        longtext commentaire
        datetime date_creation
        datetime date_modification
        int utilisateur_id FK
        int salle_id FK
        int profil_coach_id FK
    }
    disponibilite {
        int id PK
        date date_dispo
        time heure_debut
        time heure_fin
        varchar type
        datetime date_creation
        datetime date_modification
        int profil_coach_id FK
        int salle_id FK
    }
    equipement {
        int id PK
        varchar nom
    }
    horaire_coach {
        int id PK
        int jour_semaine
        time heure_debut
        time heure_fin
        int profil_coach_id FK
    }
    horaire_salle {
        int id PK
        int jour_semaine
        time heure_ouverture
        time heure_fermeture
        int salle_id FK
    }
    photo_salle {
        int id PK
        varchar url
        datetime date_creation
        int salle_id FK
    }
    profil_coach {
        int id PK
        longtext presentation
        varchar specialites
        double tarif_horaire
        varchar ville
        datetime date_creation
        datetime date_modification
        int utilisateur_id FK,UK
    }
    profil_coach_salle {
        int profil_coach_id PK,FK
        int salle_id PK,FK
    }
    reservation {
        int id PK
        varchar statut
        datetime date_creation
        datetime date_modification
        int utilisateur_id FK
        int seance_id FK
    }
    reset_password_request {
        int id PK
        varchar selector
        varchar hashed_token
        datetime requested_at
        datetime expires_at
        int user_id FK
    }
    role {
        int id PK
        varchar libelle
    }
    salle {
        int id PK
        varchar nom
        varchar adresse
        varchar ville
        longtext description
        int capacite_max
        datetime date_creation
        datetime date_modification
        int gestionnaire_id FK
    }
    salle_activite {
        int salle_id PK,FK
        int activite_id PK,FK
    }
    salle_equipement {
        int salle_id PK,FK
        int equipement_id PK,FK
    }
    seance {
        int id PK
        date date_seance
        time heure_debut
        int duree_minutes
        int capacite
        double prix
        varchar statut
        datetime date_creation
        datetime date_modification
        int activite_id FK
        int profil_coach_id FK
        int salle_id FK
    }
    utilisateur {
        int id PK
        varchar email UK
        varchar mot_de_passe
        varchar nom
        varchar prenom
        varchar image
        longtext objectifs
        varchar niveau
        tinyint email_verifie
        tinyint actif
        datetime date_creation
        datetime date_modification
        int role_id FK
    }
    utilisateur_profil_coach {
        int utilisateur_id PK,FK
        int profil_coach_id PK,FK
    }
    utilisateur_salle {
        int utilisateur_id PK,FK
        int salle_id PK,FK
    }
    utilisateur_seance {
        int utilisateur_id PK,FK
        int seance_id PK,FK
    }
```
