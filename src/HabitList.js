import React from 'react';
import Habit from './Habit';

function HabitList({ habits, incrementCount, decrementCount, deleteHabit }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Habit</th>
          <th>Count</th>
          <th>Streak</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {habits.map((habit, index) => (
          <Habit 
            key={habit.id} 
            habit={habit} 
            incrementCount={() => incrementCount(habit.id)} 
            decrementCount={() => decrementCount(habit.id)} 
            deleteHabit={() => deleteHabit(habit.id)} 
          />
        ))}
      </tbody>
    </table>
  );
}

export default HabitList;