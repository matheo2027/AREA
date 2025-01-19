'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function AREditor() {
  const [action, setAction] = useState('');
  const [reaction, setReaction] = useState('');
  const [discordUsername, setDiscordUsername] = useState('');
  const [youtubeChannelId, setYoutubeChannelId] = useState('');
  const [githubRepoLink, setGithubRepoLink] = useState('');
  const [weatherCity, setWeatherCity] = useState('');
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

      // Handle GitHub action
      if (action === 'githubStar' && githubRepoLink) {
        const actionResponse = await fetch('http://localhost:8080/actions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': userId,
          },
          body: JSON.stringify({
            user_id: userId,
            name: 'githubStar',
            parameters: githubRepoLink,
          }),
        });

        if (!actionResponse.ok) {
          const errorData = await actionResponse.json();
          throw new Error(errorData.message || 'Failed to create ACTION for GitHub');
        }

        const actionData = await actionResponse.json();
        console.log('GitHub ACTION created:', actionData);
      }

      // Handle YouTube action
      if (action === 'youtubeNewVideo' && youtubeChannelId) {
        const actionResponse = await fetch('http://localhost:8080/actions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': userId,
          },
          body: JSON.stringify({
            user_id: userId,
            name: 'youtubeNewVideo',
            parameters: youtubeChannelId,
          }),
        });

        if (!actionResponse.ok) {
          const errorData = await actionResponse.json();
          throw new Error(errorData.message || 'Failed to create ACTION for YouTube');
        }

        const actionData = await actionResponse.json();
        console.log('YouTube ACTION created:', actionData);
      }

      // Handle Weather action
      if (action === 'weatherRain' && weatherCity) {
        const actionResponse = await fetch('http://localhost:8080/actions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': userId,
          },
          body: JSON.stringify({
            user_id: userId,
            name: 'weatherRain',
            parameters: weatherCity,
          }),
        });

        if (!actionResponse.ok) {
          const errorData = await actionResponse.json();
          throw new Error(errorData.message || 'Failed to create ACTION for Weather');
        }

        const actionData = await actionResponse.json();
        console.log('Weather ACTION created:', actionData);
      }

      // Always insert AREA
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

      // Handle Discord reaction
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
            username: discordUsername,
          }),
        });

        if (!reactionResponse.ok) {
          const errorData = await reactionResponse.json();
          throw new Error(errorData.message || 'Failed to create REACTION');
        }

        const reactionData = await reactionResponse.json();
        console.log('REACTION created:', reactionData);
      }

      setMessage('AREA successfully created!');
    } catch (error) {
      console.error('Error:', error);
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
                <option value="youtubeNewVideo">YouTube - New Video</option>
                <option value="weatherRain">Weather - Rain Forecast</option>
              </select>
            </div>

            {action === 'githubStar' && (
              <div className={styles.selectRow}>
                <label htmlFor="githubRepoLink" className={styles.selectLabel}>
                  GitHub Repository Link
                </label>
                <input
                  type="text"
                  id="githubRepoLink"
                  className={styles.selectInput}
                  value={githubRepoLink}
                  onChange={(e) => setGithubRepoLink(e.target.value)}
                  placeholder="Ex: https://github.com/octocat/Hello-World"
                  required
                />
              </div>
            )}

            {action === 'youtubeNewVideo' && (
              <div className={styles.selectRow}>
                <label htmlFor="youtubeChannelId" className={styles.selectLabel}>
                  YouTube Channel ID
                </label>
                <input
                  type="text"
                  id="youtubeChannelId"
                  className={styles.selectInput}
                  value={youtubeChannelId}
                  onChange={(e) => setYoutubeChannelId(e.target.value)}
                  placeholder="Ex: UC_x5XG1OV2P6uZZ5FSM9Ttw"
                  required
                />
              </div>
            )}

            {action === 'weatherRain' && (
              <div className={styles.selectRow}>
                <label htmlFor="weatherCity" className={styles.selectLabel}>
                  City for Weather Forecast
                </label>
                <input
                  type="text"
                  id="weatherCity"
                  className={styles.selectInput}
                  value={weatherCity}
                  onChange={(e) => setWeatherCity(e.target.value)}
                  placeholder="Ex: Paris"
                  required
                />
              </div>
            )}

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
              </select>
            </div>

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
