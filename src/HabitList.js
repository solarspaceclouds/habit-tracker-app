import React from 'react';
import Habit from './Habit';

function HabitList({ habits, incrementCount, decrementCount, deleteHabit }) {
  return (
    <div>
      {habits.map((habit) => (
        <Habit 
          key={habit.id} 
          habit={habit} 
          incrementCount={() => incrementCount(habit.id)} 
          decrementCount={() => decrementCount(habit.id)} 
          deleteHabit={() => deleteHabit(habit.id)} 
        />
      ))}
    </div>
  );
}

export default HabitList;
