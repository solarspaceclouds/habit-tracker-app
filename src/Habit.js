import React from 'react';

function Habit({ habit, incrementCount, decrementCount, deleteHabit }) {
  return (
    <div>
      <span>{habit.text} - {habit.count} times - ({habit.trackingType})</span>
      <button onClick={incrementCount}>+</button>
      <button onClick={decrementCount} disabled={habit.count === 0}>-</button>
      <button onClick={deleteHabit}>Delete</button>
    </div>
  );
}

export default Habit;
