import React from 'react';
import Habit from './Habit';
import styles from './Table.module.css';

function HabitList({ habits, toggleComplete, deleteHabit }) {
  if (habits.length === 0) {
    return <p>No habits added yet.</p>;
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Habit</th>
          <th>Number of Times Completed</th>
          <th>Multiple or Single</th>
          <th>Streak (Across Days)</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {habits.map((habit, index) => (
          <Habit
            key={index}
            index={index}
            habit={habit}
            toggleComplete={toggleComplete}
            deleteHabit={deleteHabit}
          />
        ))}
      </tbody>
    </table>
  );
}

export default HabitList;
