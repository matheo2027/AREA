"use client";

import { useState } from 'react';
import styles from './page.module.css';

export default function Services() {
  const [modalContent, setModalContent] = useState(null);

  const actions = [
    {
      id: 'githubStar',
      name: 'GitHub - New Star',
      description: 'Triggered when a repository gets a new star.',
    },
    {
      id: 'discordMsg',
      name: 'Discord - New Message',
      description: 'Triggered when a new message is received on a Discord channel.',
    },
    {
      id: 'youtubeNewVideo',
      name: 'YouTube - New Video',
      description: 'Triggered when a new video is uploaded to a specified YouTube channel.',
    },
    {
      id: 'weatherRain',
      name: 'Weather - Rain Forecast',
      description: 'Triggered when rain is forecasted in a specific location.',
    },
  ];

  const reactions = [
    {
      id: 'sendEmail',
      name: 'Send an Email',
      description: 'Send an email notification to a specified recipient.',
    },
    {
      id: 'discordNotify',
      name: 'Send Discord Message',
      description: 'Send a private message to a specific Discord user.',
    },
  ];

  const openModal = (content) => {
    setModalContent(content);
  };

  const closeModal = () => {
    setModalContent(null);
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
        <h2 className={styles.title}>Available Actions</h2>
        <div className={styles.servicesList}>
          {actions.map((action) => (
            <div key={action.id} className={styles.serviceCard}>
              <h3 className={styles.serviceName}>{action.name}</h3>
              <button
                className={styles.serviceButton}
                onClick={() => openModal(action)}
              >
                Learn More
              </button>
            </div>
          ))}
        </div>

        <h2 className={styles.title}>Available Reactions</h2>
        <div className={styles.servicesList}>
          {reactions.map((reaction) => (
            <div key={reaction.id} className={styles.serviceCard}>
              <h3 className={styles.serviceName}>{reaction.name}</h3>
              <button
                className={styles.serviceButton}
                onClick={() => openModal(reaction)}
              >
                Learn More
              </button>
            </div>
          ))}
        </div>
      </main>

      {modalContent && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>{modalContent.name}</h3>
            <p className={styles.modalDescription}>{modalContent.description}</p>
            <button className={styles.closeButton} onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}

      <footer className={styles.footer}>
        <p>© 2024 AREA. All rights reserved.</p>
      </footer>
    </div>
  );
}
