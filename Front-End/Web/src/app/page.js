import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <Image
          src="/images/welcome-illustration.svg"
          alt="Welcome Illustration"
          width={300}
          height={300}
        />
        <h1>Configure your Automation Space</h1>
        <p>Explore all the existing services roles based on your interest</p>
        <div className={styles.buttons}>
          <Link href="/login">
            <button className={styles.login}>Login</button>
          </Link>
          <Link href="/register">
            <button className={styles.register}>Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
