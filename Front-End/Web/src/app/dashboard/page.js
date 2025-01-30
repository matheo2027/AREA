'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';

export default function Dashboard() {
  const [areas, setAreas] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Récupérer l'userId depuis le localStorage
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      setMessage('No user ID found. Please log in.');
      return;
    }

    // Faire un fetch GET /areas en passant x-user-id
    const fetchAreas = async () => {
      try {
        const response = await fetch('http://localhost:8080/areas', {
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': storedUserId, // indispensable pour checkAuth
          },
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setAreas(data.areas);
        } else {
          setMessage(data.message || 'Unable to fetch areas');
        }
      } catch (err) {
        console.error('Error fetching areas:', err);
        setMessage('Error fetching areas');
      }
    };

    fetchAreas();
  }, []);

  return (
    <div className={styles.container}>
      <Navbar />

      <main className={styles.main}>
        <h2>My Areas</h2>

        {message && <p className={styles.message}>{message}</p>}

        {areas.length === 0 ? (
          <p className={styles.message}>No Areas yet...</p>
        ) : (
          <ul className={styles.areaList}>
            {areas.map((area) => (
              <li key={area.id} className={styles.areaItem}>
                <strong>Action:</strong> {area.action} &nbsp;
                <strong>Reaction:</strong> {area.reaction}
              </li>
            ))}
          </ul>
        )}
      </main>

      <Footer />
    </div>
  );
}
