import Link from 'next/link';
import styles from './page.module.css';

export default function Navbar() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <h1>AREA</h1>
      </div>
      <nav className={styles.nav}>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/services">Services</Link>
        <Link href="/ar-editor">AR Editor</Link>
      </nav>
    </header>
  );
}
