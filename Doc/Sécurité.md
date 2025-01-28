| **Technologie**     | **Failles de sécurité récentes**                                                                                                                                     | **Mesures de sécurité recommandées**                                                                                                                     |
|---------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Next.js**         | - XSS (Cross-Site Scripting) dans certaines configurations d'applications non sécurisées. <br> - CSRF (Cross-Site Request Forgery) dans les API mal sécurisées.     | - Activer **CSRF protection** dans les formulaires d'authentification.        |
| **Express.js**      | - Injection SQL via des requêtes mal construites. <br> - Erreurs de configuration dans les middlewares exposant des informations sensibles.                         | - Utiliser des **ORMs sécurisés** comme Sequelize pour éviter les injections SQL. <br> - Configurer correctement les **HTTP Headers** et **CORS**.     |
| **PostgreSQL**      | - Injection SQL en cas de requêtes non paramétrées. <br> - Failles de configuration du serveur de base de données (ex : accès non restreint aux données sensibles). | - Toujours utiliser des **requêtes paramétrées**. <br> - Activer **l'authentification forte** et limiter les accès avec **listes blanches d'IP**.     |
| **React Native**    | - Risques de **reverse engineering** des applications mobiles. <br> - Exposition de données sensibles stockées en clair dans le code.                              | - Utiliser **React Native Secure Storage** pour les données sensibles. <br> - **Minifier** et **obfusquer** le code avant la publication de l'app.    |








| **Technologie**     | **Failles de sécurité récentes**                                                                                                     |
|---------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| **Next.js**         | - XSS (Cross-Site Scripting) dans certaines configurations d'applications non sécurisées. <br> - CSRF (Cross-Site Request Forgery) dans les API mal sécurisées. |
| **Express.js**      | - Injection SQL via des requêtes mal construites. <br> - Erreurs de configuration dans les middlewares exposant des informations sensibles. |
| **PostgreSQL**      | - Injection SQL en cas de requêtes non paramétrées. <br> - Failles de configuration du serveur de base de données (ex : accès non restreint aux données sensibles). |
| **React Native**    | - Risques de **reverse engineering** des applications mobiles. <br> - Exposition de données sensibles stockées en clair dans le code. |
