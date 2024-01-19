import React from 'react';
import Habit from './Habit';

function HabitList({ habits, incrementCount, decrementCount, deleteHabit }) {
  return (
    <div>
      {habits.map((habit, index) => (
        <Habit 
          key={habit.id} 
          habit={habit} 
          index={index} 
          incrementCount={incrementCount} 
          decrementCount={decrementCount} 
          deleteHabit={deleteHabit} 
        />
      ))}
    </div>
  );
}

export default HabitList;
