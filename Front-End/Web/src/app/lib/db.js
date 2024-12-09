import { Pool } from 'pg';

export const pool = new Pool({
    user: 'postgres',       // Remplace par ton utilisateur PostgreSQL
    host: 'localhost',      // Adresse du serveur
    database: 'user_management', // Nom de la base
    password: '123',   // Ton mot de passe
    port: 5432,             // Port par défaut
});
