'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  const handleDiscordSignIn = () => {
    signIn('discord', { callbackUrl: '/dashboard' });
  };

  const handleGitHubSignIn = () => {
    signIn('github', { callbackUrl: '/dashboard' });
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1>Welcome to AREA</h1>
        <div className={styles.buttons}>

          <button
          className={styles.login}
          onClick={() => window.location.href = '/login'}>
            Login
          </button>

          <button
          className={styles.register}
          onClick={() => window.location.href = '/register'}>
            Register
          </button>

        </div>

          <button
            onClick={handleGoogleSignIn}
            className={styles.googleButton}
          >
            Continue with Google
          </button>

          <button
            onClick={handleDiscordSignIn}
            className={styles.discordButton}
          >
            Continue with Discord
          </button>

          <button
            onClick={handleGitHubSignIn}
            className={styles.githubButton}
          >
            Continue with GitHub
          </button>
      </div>
    </div>
  );
}
