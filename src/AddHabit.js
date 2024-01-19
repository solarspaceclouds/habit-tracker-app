import React, { useState } from 'react';

function AddHabit({ addHabit }) {
  const [habitText, setHabitText] = useState('');
  const [trackingType, setTrackingType] = useState('daily');

  const handleSubmit = (e) => {
    e.preventDefault();
    addHabit(habitText, trackingType);
    setHabitText('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Add new habit" 
        value={habitText} 
        onChange={(e) => setHabitText(e.target.value)} 
      />
      <select value={trackingType} onChange={(e) => setTrackingType(e.target.value)}>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
      </select>
      <button type="submit">Add Habit</button>
    </form>
  );
}

export default AddHabit;
