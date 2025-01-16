'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function AREditor() {
  const [action, setAction] = useState('');
  const [reaction, setReaction] = useState('');
  const [discordUsername, setDiscordUsername] = useState('');
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      if (!userId) {
        throw new Error('No userId found in localStorage');
      }

      // Toujours insérer l’AREA
      const areaResponse = await fetch('http://localhost:8080/areas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({ action, reaction }),
      });
      if (!areaResponse.ok) {
        const errorData = await areaResponse.json();
        throw new Error(errorData.message || 'Failed to create AREA');
      }
      const areaData = await areaResponse.json();
      console.log('AREA created:', areaData);

      // Si la réaction choisie est discordNotify, on fait une insertion en plus
      if (reaction === 'discordNotify') {
        const reactionResponse = await fetch('http://localhost:8080/reactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': userId,
          },
          body: JSON.stringify({
            user_id: userId,
            name: 'discordNotify',
            username: discordUsername, // identifiant Discord
          }),
        });
        if (!reactionResponse.ok) {
          const errorData = await reactionResponse.json();
          throw new Error(errorData.message || 'Failed to create REACTION');
        }
        const reactionData = await reactionResponse.json();
        console.log('REACTION created:', reactionData);

        setMessage('AREA + Reaction successfully created!');
      } else {
        setMessage('AREA successfully created (no Discord reaction).');
      }
    } catch (error) {
      console.error('Error creating AREA or REACTION:', error);
      setMessage(error.message);
    }
  };

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
          Welcome to the Automation and Reaction (AR) Editor. Create your custom automated workflows.
        </p>

        <div className={styles.editorContainer}>
          <form onSubmit={handleSubmit}>
            <div className={styles.selectRow}>
              <label htmlFor="ifSelect" className={styles.selectLabel}>
                If
              </label>
              <select
                id="ifSelect"
                className={styles.selectInput}
                value={action}
                onChange={(e) => setAction(e.target.value)}
              >
                <option value="">-- Choose an Action --</option>
                <option value="githubStar">GitHub - New Star</option>
                <option value="discordMsg">Discord - New Message</option>
                <option value="newTweet">Twitter - New Tweet</option>
                <option value="youtubeNewVideo">YouTube - New Video</option> {/* Ajouté ici */}
              </select>
            </div>

            <div className={styles.selectRow}>
              <label htmlFor="thenSelect" className={styles.selectLabel}>
                Then
              </label>
              <select
                id="thenSelect"
                className={styles.selectInput}
                value={reaction}
                onChange={(e) => setReaction(e.target.value)}
              >
                <option value="">-- Choose a Reaction --</option>
                <option value="sendEmail">Send an Email</option>
                <option value="discordNotify">Send Discord Message</option>
                <option value="postTweet">Post a Tweet</option>
              </select>
            </div>

            {/* Si la réaction = discordNotify, on affiche un champ "Identifiant Discord" */}
            {reaction === 'discordNotify' && (
              <div className={styles.selectRow}>
                <label htmlFor="discordUsername" className={styles.selectLabel}>
                  Discord Username
                </label>
                <input
                  type="text"
                  id="discordUsername"
                  className={styles.selectInput}
                  value={discordUsername}
                  onChange={(e) => setDiscordUsername(e.target.value)}
                  placeholder="Ex: babacar#1234"
                  required
                />
              </div>
            )}

            <button type="submit" className={styles.submitButton}>
              Create AREA
            </button>
          </form>
        </div>

        {message && <p style={{ marginTop: '1rem', color: 'green' }}>{message}</p>}
      </main>

      <footer className={styles.footer}>
        <p>© 2024 AREA. All rights reserved.</p>
      </footer>
    </div>
  );
}
