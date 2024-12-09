import Image from 'next/image';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <h1>AREA</h1>
        </div>
        <nav className={styles.nav}>
          <a href="#dashboard">Dashboard</a>
          <a href="#services">Services</a>
          <a href="#ar-editor">AR Editor</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>
      <main className={styles.main}>
        <section className={styles.hero}>
          <Image
            src="/images/hero-illustration.svg"
            alt="No Areas Yet Illustration"
            width={400}
            height={300}
          />
          <h2>No Areas yet...</h2>
          <p>
            <a href="#how-it-works" className={styles.link}>
              How does it work?
            </a>
          </p>
        </section>
      </main>
      <footer className={styles.footer}>
        <p>© 2024 AREA. All rights reserved.</p>
      </footer>
    </div>
  );
}
