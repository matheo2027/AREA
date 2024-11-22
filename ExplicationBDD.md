# Explication de la Base de Données (BDD)

## Architecture de la BDD

La base de données est composée de plusieurs tables qui permettent de stocker et de gérer les informations relatives aux utilisateurs, aux services connectés, aux actions et réactions, ainsi qu'aux workflows et logs. Voici une explication détaillée de chaque table et de leurs relations :

### 1. **Table `users`**
La table `users` contient les informations des utilisateurs de l'application. Chaque utilisateur est identifié par un identifiant unique (`id`), et les informations importantes comme le nom d'utilisateur (`username`), l'email (`email`), ainsi que le mot de passe haché (`password_hash`) sont également stockées. Les colonnes `created_at` et `updated_at` permettent de suivre la création et la dernière mise à jour des comptes utilisateurs.

| **Colonne**      | **Type**        | **Description**                  |
|------------------|-----------------|----------------------------------|
| `id`             | `SERIAL`        | Identifiant unique, clé primaire |
| `username`       | `VARCHAR(50)`    | Nom d'utilisateur                |
| `email`          | `VARCHAR(100)`   | Adresse e-mail, unique           |
| `password_hash`  | `TEXT`           | Mot de passe haché               |
| `created_at`     | `TIMESTAMP`      | Date de création du compte       |
| `updated_at`     | `TIMESTAMP`      | Dernière modification            |

### 2. **Table `services`**
La table `services` contient des informations sur les services disponibles dans l'application, tels que "GitHub", "Google", etc. Chaque service a un identifiant unique (`id`), un nom (`name`) et une description (`description`). La date d'ajout du service est également enregistrée.

| **Colonne**      | **Type**        | **Description**                  |
|------------------|-----------------|----------------------------------|
| `id`             | `SERIAL`        | Identifiant unique, clé primaire |
| `name`           | `VARCHAR(100)`   | Nom du service (ex : "GitHub")   |
| `description`    | `TEXT`           | Description du service           |
| `created_at`     | `TIMESTAMP`      | Date d'ajout du service          |

### 3. **Table `actions`**
La table `actions` est utilisée pour définir les actions disponibles pour chaque service. Chaque action appartient à un service spécifique, indiqué par `service_id`. Elle possède un nom (`name`), une description (`description`) et des paramètres (`parameters`) qui sont stockés au format JSONB pour une flexibilité maximale.

| **Colonne**      | **Type**        | **Description**                  |
|------------------|-----------------|----------------------------------|
| `id`             | `SERIAL`        | Identifiant unique, clé primaire |
| `service_id`     | `INTEGER`       | Clé étrangère vers `services.id` |
| `name`           | `VARCHAR(100)`   | Nom de l'action                  |
| `description`    | `TEXT`           | Description de l'action          |
| `parameters`     | `JSONB`          | Paramètres nécessaires           |

### 4. **Table `reactions`**
La table `reactions` définit les réactions associées aux services. Semblable à la table `actions`, elle contient un identifiant unique (`id`), un identifiant de service (`service_id`), un nom (`name`), une description (`description`) et des paramètres (`parameters`).

| **Colonne**      | **Type**        | **Description**                  |
|------------------|-----------------|----------------------------------|
| `id`             | `SERIAL`        | Identifiant unique, clé primaire |
| `service_id`     | `INTEGER`       | Clé étrangère vers `services.id` |
| `name`           | `VARCHAR(100)`   | Nom de la réaction               |
| `description`    | `TEXT`           | Description de la réaction       |
| `parameters`     | `JSONB`          | Paramètres nécessaires           |

### 5. **Table `user_services`**
La table `user_services` lie les utilisateurs aux services qu'ils ont autorisés ou connectés à leur compte. Elle contient des informations sur les jetons d'accès et de renouvellement associés à chaque service, ainsi que la date de connexion.

| **Colonne**      | **Type**        | **Description**                  |
|------------------|-----------------|----------------------------------|
| `id`             | `SERIAL`        | Identifiant unique, clé primaire |
| `user_id`        | `INTEGER`       | Clé étrangère vers `users.id`    |
| `service_id`     | `INTEGER`       | Clé étrangère vers `services.id` |
| `access_token`   | `TEXT`          | Jeton d'accès au service         |
| `refresh_token`  | `TEXT`          | Jeton pour renouveler l'accès    |
| `created_at`     | `TIMESTAMP`     | Date de connexion                |

### 6. **Table `workflows`**
La table `workflows` définit les flux de travail que les utilisateurs peuvent créer. Chaque workflow associe une action et une réaction. Elle contient également des paramètres spécifiques pour chaque workflow ainsi que des informations sur sa création et sa dernière modification.

| **Colonne**      | **Type**        | **Description**                  |
|------------------|-----------------|----------------------------------|
| `id`             | `SERIAL`        | Identifiant unique, clé primaire |
| `user_id`        | `INTEGER`       | Clé étrangère vers `users.id`    |
| `action_id`      | `INTEGER`       | Clé étrangère vers `actions.id`  |
| `reaction_id`    | `INTEGER`       | Clé étrangère vers `reactions.id`|
| `parameters`     | `JSONB`         | Paramètres spécifiques au workflow|
| `created_at`     | `TIMESTAMP`     | Date de création                 |
| `updated_at`     | `TIMESTAMP`     | Dernière modification            |

### 7. **Table `logs`**
La table `logs` enregistre l'exécution des workflows. Elle contient des informations sur le statut de l'exécution (par exemple, "success" ou "error"), un message associé à l'exécution, ainsi que la date de l'exécution.

| **Colonne**      | **Type**        | **Description**                  |
|------------------|-----------------|----------------------------------|
| `id`             | `SERIAL`        | Identifiant unique, clé primaire |
| `workflow_id`    | `INTEGER`       | Clé étrangère vers `workflows.id`|
| `status`         | `VARCHAR(50)`    | Statut de l'exécution            |
| `message`        | `TEXT`           | Message de log                   |
| `executed_at`    | `TIMESTAMP`      | Date d'exécution                 |

## Relations entre les tables

- **Utilisateurs et services** : Les utilisateurs peuvent connecter des services via la table `user_services`, qui contient des informations sur les jetons d'accès et de rafraîchissement.
- **Services, actions et réactions** : Chaque service peut avoir plusieurs actions et réactions, définies respectivement dans les tables `actions` et `reactions`. Les workflows associent une action à une réaction.
- **Logs** : Chaque exécution de workflow est enregistrée dans la table `logs`, ce qui permet de suivre l'état des workflows dans l'application.