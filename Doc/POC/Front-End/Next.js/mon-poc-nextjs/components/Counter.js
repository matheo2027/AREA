// components/Counter.js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);

  return (
    <div>
      <p>Compteur: {count}</p>
      <button onClick={increment}>Ajouter</button>
      <button onClick={decrement}>Soustraire</button>
    </div>
  );
}
