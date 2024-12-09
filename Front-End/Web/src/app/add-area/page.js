'use client';

import { useState } from 'react';
import styles from './add-area.module.css';

export default function AddArea() {
  const [selectedAction, setSelectedAction] = useState(''); // Main action selected
  const [subAction, setSubAction] = useState(''); // Specific sub-action selected
  const [timerSeconds, setTimerSeconds] = useState(''); // Timer duration in seconds
  const [message, setMessage] = useState('');
  const [selectedReactions, setSelectedReactions] = useState([]); // Array to store multiple reactions

  // Actions and Subactions
  const actions = [
    { id: 1, name: 'Timer', subActions: ['Start a timer', 'Start a countdown'] },
    // Add other actions here if needed
  ];

  const allReactions = [
    { id: 1, name: 'Send a Notification' },
    { id: 2, name: 'Trigger a Webhook' },
    { id: 3, name: 'Save to Google Drive' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate input
    if (!selectedAction || (selectedAction === 'Timer' && !subAction) || !selectedReactions.length) {
      setMessage('Please complete all required fields.');
      return;
    }
  
    // Prepare the action string
    let actionString = selectedAction;
  
    if (selectedAction === 'Timer') {
      actionString += `, ${subAction}`;
      if (subAction === 'Start a countdown' && timerSeconds) {
        actionString += `, Timer duration: ${timerSeconds} seconds`;
      }
    }
  
    // Prepare the reactions string
    const reactionString = selectedReactions.join(', ');
  
    try {
      const response = await fetch('/api/areas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: actionString,
          reactions: reactionString,
        }),
      });
  
      // Log the response to see what is returned
      const responseText = await response.text();
      console.log('Response:', responseText);
  
      // Try parsing the JSON if it's a valid response
      const data = JSON.parse(responseText);
  
      if (data.success) {
        setMessage('AREA created successfully!');
        setSelectedAction('');
        setSubAction('');
        setTimerSeconds('');
        setSelectedReactions([]);
      } else {
        setMessage(data.message || 'An error occurred.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again later.');
    }
  };
  

  const handleAddReaction = (reaction) => {
    if (!selectedReactions.includes(reaction)) {
      setSelectedReactions((prevReactions) => [...prevReactions, reaction]);
    }
  };

  const handleRemoveReaction = (reaction) => {
    setSelectedReactions((prevReactions) =>
      prevReactions.filter((item) => item !== reaction)
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create a New AREA</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Action Selector */}
        <div className={styles.field}>
          <label htmlFor="action" className={styles.fieldLabel}>
            Select an Action:
          </label>
          <select
            id="action"
            value={selectedAction}
            onChange={(e) => {
              setSelectedAction(e.target.value);
              setSubAction('');
              setTimerSeconds('');
            }}
            className={styles.select}
          >
            <option value="">-- Choose an Action --</option>
            {actions.map((action) => (
              <option key={action.id} value={action.name}>
                {action.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sub-Actions for Timer */}
        {selectedAction === 'Timer' && (
          <div className={styles.field}>
            <label htmlFor="sub-action" className={styles.fieldLabel}>
              Select a Timer Option:
            </label>
            <select
              id="sub-action"
              value={subAction}
              onChange={(e) => {
                setSubAction(e.target.value);
                setTimerSeconds(''); // Reset timerSeconds when subAction changes
              }}
              className={styles.select}
            >
              <option value="">-- Choose a Timer Option --</option>
              {actions
                .find((action) => action.name === 'Timer')
                .subActions.map((sub, index) => (
                  <option key={index} value={sub}>
                    {sub}
                  </option>
                ))}
            </select>
          </div>
        )}

        {/* Timer Seconds Input */}
        {subAction === 'Start a countdown' && (
          <div className={styles.field}>
            <label htmlFor="timer-seconds" className={styles.fieldLabel}>
              Enter Time (1-100 seconds):
            </label>
            <input
              id="timer-seconds"
              type="number"
              min="1"
              max="100"
              value={timerSeconds}
              onChange={(e) => setTimerSeconds(e.target.value)}
              className={styles.input}
              required
            />
          </div>
        )}

        {/* Reaction Selector */}
        <div className={styles.field}>
          <label htmlFor="reaction" className={styles.fieldLabel}>
            Select a Reaction:
          </label>
          <select
            id="reaction"
            onChange={(e) => handleAddReaction(e.target.value)}
            className={styles.select}
          >
            <option value="">-- Choose a Reaction --</option>
            {allReactions.map((reaction) => (
              <option key={reaction.id} value={reaction.name}>
                {reaction.name}
              </option>
            ))}
          </select>
        </div>

        {/* Display selected reactions */}
        {selectedReactions.length > 0 && (
          <div className={styles.selectedReactions}>
            <h3>Selected Reactions:</h3>
            <ul>
              {selectedReactions.map((reaction, index) => (
                <li key={index}>
                  {reaction}{' '}
                  <button
                    type="button"
                    onClick={() => handleRemoveReaction(reaction)}
                    className={styles.removeButton}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button type="submit" className={styles.button}>
          Create AREA
        </button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
