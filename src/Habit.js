import React from 'react';

function Habit({ habit, incrementCount, decrementCount, deleteHabit }) {
  const panelColor = habit.trackingType === 'daily' ? 'rgba(54, 162, 235, 0.5)' : 'rgba(255, 206, 86, 0.5)';

  return (
    <tr style={{ backgroundColor: panelColor }}>
      <td>{habit.text}</td>
      <td>{habit.count}</td>
      <td>{habit.streak}</td>
      <td>{new Date(habit.createdDate).toLocaleDateString()}</td>
      <td>
        <button onClick={incrementCount}>+</button>
        <button onClick={decrementCount} disabled={habit.count === 0}>-</button>
        <button onClick={deleteHabit}>Delete</button>
      </td>
    </tr>
  );
}

export default Habit;
