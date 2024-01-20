import React from 'react';
import Habit from './Habit';

function HabitList({ habits, incrementCount, decrementCount, deleteHabit }) {
  return (
    <div className="habitListContainer">
    <div className="legend">
      <span className="daily">Daily Habit</span>
      <span className="weekly">Weekly Habit</span>
    </div>
    <table className="habitTable">
      <thead>
        <tr>
          <th>Habit</th>
          <th>Count</th>
          <th>Streak</th>
          <th>Habit Start Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {habits.map((habit) => (
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
    </div>
  );
}


export default HabitList;

