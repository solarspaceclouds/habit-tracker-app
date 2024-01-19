import React, { useState } from 'react';

function AddHabit({ addHabit }) {
  const [habitText, setHabitText] = useState('');
  const [trackingType, setTrackingType] = useState('daily');

  const handleSubmit = (e) => {
    e.preventDefault();
    addHabit(habitText, false, trackingType);
    setHabitText('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="habitInput">Enter a habit to track:</label>
        <input 
          id="habitInput"
          type="text" 
          placeholder="E.g., Drink water, Exercise" 
          value={habitText} 
          onChange={(e) => setHabitText(e.target.value)} 
        />
        <p>Please enter the habit you wish to track in the field above.</p>
      </div>
      <select value={trackingType} onChange={(e) => setTrackingType(e.target.value)}>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
      </select>
      <button type="submit">Add Habit</button>
    </form>
  );
}

export default AddHabit;
