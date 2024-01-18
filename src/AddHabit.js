import React, { useState } from 'react';

function AddHabit({ addHabit }) {
  const [input, setInput] = useState('');
  const [allowsMultiple, setAllowsMultiple] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    addHabit(input, allowsMultiple);
    setInput('');
    setAllowsMultiple(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <br></br>
      <label>
        Allow multiple increments per day:
        <input
          type="checkbox"
          checked={allowsMultiple}
          onChange={(e) => setAllowsMultiple(e.target.checked)}
        />
      </label>
      <br></br>
      <button type="submit">Add Habit</button>
    </form>
  );
}

export default AddHabit;
