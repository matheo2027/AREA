// src/app/api/register/route.js
import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';

// PostgreSQL database configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Check if email and password are provided
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }

    // Check if email is already registered
    const checkUserQuery = 'SELECT * FROM users WHERE email = $1';
    const userExists = await pool.query(checkUserQuery, [email]);

    if (userExists.rows.length > 0) {
      return NextResponse.json({ message: 'This email is already registered.' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    const insertQuery = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id';
    const result = await pool.query(insertQuery, [email, hashedPassword]);

    // Return success with the user ID
    return NextResponse.json({ success: true, userId: result.rows[0].id }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'An error occurred.' }, { status: 500 });
  }
}
