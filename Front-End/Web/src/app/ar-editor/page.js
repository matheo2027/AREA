// src/app/ar-editor/page.js
import styles from './page.module.css';

export default function AREditor() {
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
        <h2 className={styles.title}>AR Editor</h2>
        <p className={styles.description}>
          Welcome to the Automation and Reaction (AR) Editor. Here you can create and customize your automated workflows with ease.
        </p>
        <div className={styles.editorContainer}>
          <p className={styles.placeholder}>AR Editor functionality coming soon!</p>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© 2024 AREA. All rights reserved.</p>
      </footer>
    </div>
  );
}
