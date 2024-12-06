// src/app/api/login/route.js
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

    // Check if the user exists
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const user = result.rows[0];

    // Compare the password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ message: 'Incorrect password' }, { status: 401 });
    }

    // Successful login
    return NextResponse.json({
      success: true,
      userId: user.id,
      message: 'Login successful',
    }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'An error occurred.' }, { status: 500 });
  }
}
