// pages/index.js
import Head from 'next/head';
import Counter from '../components/Counter';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Mon POC Next.js</title>
        <meta name="description" content="POC avec Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Bienvenue sur mon POC Next.js !</h1>
        <Counter />
      </main>
    </div>
  );
}
