import React, { useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function StreakChart({ habits }) {
  const [view, setView] = useState('daily'); // 'daily' or 'weekly'

  const chartData = useMemo(() => {
    const filterType = view === 'daily' ? 'daily' : 'weekly';
    const filteredHabits = habits.filter(habit => habit.trackingType === filterType);

    return {
      labels: filteredHabits.map(habit => habit.text),
      datasets: [
        {
          label: `${filterType.charAt(0).toUpperCase() + filterType.slice(1)} Streaks`,
          data: filteredHabits.map(habit => habit.streak),
          backgroundColor: filterType === 'daily' ? 'rgba(54, 162, 235, 0.5)' : 'rgba(255, 206, 86, 0.5)',
        }
      ]
    };
  }, [habits, view]);

  const options = {
    scales: {
      y: {
        beginAtZero: true
      }
    },
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Habit Streaks',
      },
    },
  };

  return (
    <div>
      <div>
        <button onClick={() => setView('daily')}>Daily</button>
        <button onClick={() => setView('weekly')}>Weekly</button>
      </div>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default StreakChart;
