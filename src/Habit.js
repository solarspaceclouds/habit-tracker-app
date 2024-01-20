import React from 'react';

function Habit({ habit, incrementCount, decrementCount, deleteHabit }) {
  const panelColor = habit.trackingType === 'daily' ? 'lightblue' : 'lightgreen';

  return (
    <tr style={{ backgroundColor: panelColor }}>
      <td>{habit.text}</td>
      <td>{habit.count}</td>
      <td>{habit.streak}</td>
      <td>
        <button onClick={incrementCount}>+</button>
        <button onClick={decrementCount} disabled={habit.count === 0}>-</button>
        <button onClick={deleteHabit}>Delete</button>
      </td>
    </tr>
  );
}

export default Habit;