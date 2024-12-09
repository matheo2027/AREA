import { NextResponse } from 'next/server';
import { Pool } from 'pg'; // Import PostgreSQL client

// Create a PostgreSQL client instance
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export async function POST(req) {
  try {
    // Get the data from the request body
    const { action, reactions } = await req.json();

    // Ensure the required fields are present
    if (!action || !reactions) {
      return NextResponse.json(
        { success: false, message: 'Action and reactions are required.' },
        { status: 400 }
      );
    }

    // Insert the data into the "areas" table
    const query = `
      INSERT INTO areas (action, reactions)
      VALUES ($1, $2) RETURNING *;
    `;
    const values = [action, reactions];

    const result = await pool.query(query, values);

    // Return success response
    return NextResponse.json({ success: true, area: result.rows[0] });
  } catch (error) {
    console.error('Error inserting area into database:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
