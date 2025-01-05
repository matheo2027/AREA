// src/app/services/page.js
import Image from 'next/image';
import styles from './page.module.css';

export default function Services() {
  const services = [
    { id: 1, name: 'Timer', description: 'Set up and manage timers for your automation workflows.' },
    { id: 2, name: 'Notifications', description: 'Send notifications based on specific triggers.' },
    { id: 3, name: 'Weather Updates', description: 'Get real-time weather updates for your location.' },
    { id: 4, name: 'Email Automation', description: 'Automate sending and receiving emails.' },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <h1>AREA</h1>
        </div>
        <nav className={styles.nav}>
          <a href="/dashboard">Dashboard</a>
          <a href="/services">Services</a>
          <a href="/ar-editor">AR Editor</a>
        </nav>
      </header>

      <main className={styles.main}>
        <h2 className={styles.title}>Available Services</h2>
        <div className={styles.servicesList}>
          {services.map((service) => (
            <div key={service.id} className={styles.serviceCard}>
              <h3 className={styles.serviceName}>{service.name}</h3>
              <p className={styles.serviceDescription}>{service.description}</p>
              <button className={styles.serviceButton}>Learn More</button>
            </div>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© 2024 AREA. All rights reserved.</p>
      </footer>
    </div>
  );
}
