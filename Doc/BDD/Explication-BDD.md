# Explication de la Base de Données (BDD)

## Architecture de la BDD

La base de données est composée de plusieurs tables qui permettent de stocker et de gérer les informations relatives aux utilisateurs, aux services connectés, aux actions et réactions, ainsi qu'aux workflows et logs. Voici une explication détaillée de chaque table et de leurs relations :

---

### 1. **Table `users`**
La table `users` contient les informations des utilisateurs de l'application. Chaque utilisateur est identifié par un identifiant unique (`id`), et les informations importantes comme l'email, le mot de passe haché et le token de connexion y sont stockées. Les colonnes `created_at` et `updated_at` permettent de suivre la création et la mise à jour des comptes.

| **Colonne**      | **Type**         | **Description**                      |
|------------------|------------------|--------------------------------------|
| `id`             | `SERIAL`         | Identifiant unique, clé primaire     |
| `email`          | `VARCHAR(100)`   | Adresse e-mail, unique               |
| `password_hash`  | `TEXT`           | Mot de passe haché                   |
| `created_at`     | `TIMESTAMP`      | Date de création du compte           |
| `updated_at`     | `TIMESTAMP`      | Dernière mise à jour                 |
| `token`          | `TEXT`           | Token de connexion                   |
| `is_connected`   | `BOOLEAN`        | Statut de connexion de l'utilisateur |

---

### 2. **Table `areas`**
La table `areas` contient des informations sur les services connectés. Elle inclut les actions, les réactions et des références à l'utilisateur associé.

| **Colonne**      | **Type**        | **Description**                      |
|------------------|-----------------|--------------------------------------|
| `id`             | `SERIAL`        | Identifiant unique, clé primaire     |
| `action`         | `VARCHAR(100)`  | Nom de l'action associée au service  |
| `reaction`       | `VARCHAR(100)`  | Nom de la réaction associée          |
| `created_at`     | `TIMESTAMP`     | Date de création du service          |
| `user_id`        | `INTEGER`       | Clé étrangère vers `users.id`        |

---

### 3. **Table `actions`**
La table `actions` définit les actions disponibles pour chaque service. Chaque action est associée à un service spécifique via une clé étrangère, et les paramètres sont stockés au format JSONB pour une flexibilité maximale.

| **Colonne**      | **Type**        | **Description**                      |
|------------------|-----------------|--------------------------------------|
| `id`             | `SERIAL`        | Identifiant unique, clé primaire     |
| `service_id`     | `INTEGER`       | Clé étrangère vers `areas.id`        |
| `name`           | `VARCHAR(100)`  | Nom de l'action                      |
| `description`    | `TEXT`          | Description de l'action              |
| `parameters`     | `JSONB`         | Paramètres nécessaires               |
| `created_at`     | `TIMESTAMP`     | Date de création                     |
| `updated_at`     | `TIMESTAMP`     | Dernière mise à jour                 |

---

### 4. **Table `reactions`**
La table `reactions` définit les réactions associées aux services. Elle inclut également des paramètres flexibles sous forme de JSONB.

| **Colonne**      | **Type**        | **Description**                      |
|------------------|-----------------|--------------------------------------|
| `id`             | `SERIAL`        | Identifiant unique, clé primaire     |
| `service_id`     | `INTEGER`       | Clé étrangère vers `areas.id`        |
| `name`           | `VARCHAR(100)`  | Nom de la réaction                   |
| `description`    | `TEXT`          | Description de la réaction           |
| `parameters`     | `JSONB`         | Paramètres nécessaires               |
| `created_at`     | `TIMESTAMP`     | Date de création                     |
| `updated_at`     | `TIMESTAMP`     | Dernière mise à jour                 |

---

### 5. **Table `star_tracking`**
La table `star_tracking` sert à suivre les informations liées à des dépôts GitHub, comme les étoiles des projets suivis.

| **Colonne**      | **Type**        | **Description**                      |
|------------------|-----------------|--------------------------------------|
| `repo_url`       | `TEXT`          | URL du dépôt GitHub suivi            |
| `last_stars`     | `INTEGER`       | Nombre d'étoiles à la dernière vérif |

---

### 6. **Table `workflows`**
La table `workflows` définit les flux de travail créés par les utilisateurs. Chaque workflow associe une action à une réaction et peut inclure des paramètres spécifiques.

| **Colonne**      | **Type**        | **Description**                      |
|------------------|-----------------|--------------------------------------|
| `id`             | `SERIAL`        | Identifiant unique, clé primaire     |
| `user_id`        | `INTEGER`       | Clé étrangère vers `users.id`        |
| `action_id`      | `INTEGER`       | Clé étrangère vers `actions.id`      |
| `reaction_id`    | `INTEGER`       | Clé étrangère vers `reactions.id`    |
| `parameters`     | `JSONB`         | Paramètres spécifiques au workflow   |
| `created_at`     | `TIMESTAMP`     | Date de création                     |
| `updated_at`     | `TIMESTAMP`     | Dernière mise à jour                 |

---

## Relations entre les tables

1. **`users` et `areas`** : Les utilisateurs peuvent connecter plusieurs services via `areas`, qui contient des informations sur les actions et réactions associées.
2. **`areas`, `actions` et `reactions`** : Chaque service (dans `areas`) peut avoir plusieurs actions et réactions définies dans `actions` et `reactions`.
3. **`workflows`** : Les workflows associent une action à une réaction pour un utilisateur donné.
4. **`star_tracking`** : Permet de suivre les informations liées à des projets GitHub spécifiques.





# Schéma des relations entre les tables

Voici un schéma décrivant les relations entre les différentes tables de la base de données :

```plaintext
+----------------+         +----------------+         +-----------------+
|     users      |         |     areas      |         |  star_tracking  |
|----------------|         |----------------|         |-----------------|
| id (PK)        |<----+   | id (PK)        |         | repo_url (PK)   |
| email          |     |   | action         |         | last_stars      |
| password_hash  |     +---| reaction       |         +-----------------+
| token          |         | user_id (FK)   |
| is_connected   |         +----------------+
+----------------+

+----------------+         +----------------+         +----------------+
|    actions     |         |   reactions    |         |    workflows   |
|----------------|         |----------------|         |----------------|
| id (PK)        |         | id (PK)        |         | id (PK)        |
| service_id (FK)|<--------| service_id (FK)|<--+     | user_id (FK)   |
| name           |         | name           |    |    | action_id (FK) |
| description    |         | description    |    +----| reaction_id (FK)|
| parameters     |         | parameters     |         | parameters     |
+----------------+         +----------------+         +----------------+
