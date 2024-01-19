import React, { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

function StreakChart({ habits }) {
  const [view, setView] = useState('daily'); // 'daily' or 'weekly'

  const chartData = useMemo(() => {
    const filterType = view === 'daily' ? 'daily' : 'weekly';
    const filteredHabits = habits.filter(habit => habit.trackingType === filterType);

    // Assuming that habits have an array of {date, count} for each completion
    const dataPoints = filteredHabits.map(habit => {
      return {
        label: habit.text,
        data: habit.completions.map(completion => ({ t: new Date(completion.date), y: completion.count })),
        fill: false,
        borderColor: filterType === 'daily' ? 'rgba(54, 162, 235)' : 'rgba(255, 206, 86)',
        tension: 0.1
      };
    });

    return {
      datasets: dataPoints
    };
  }, [habits, view]);

  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: view === 'daily' ? 'day' : 'week'
        }
      },
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
        text: 'Habit Completion Trends',
      },
    },
  };

  return (
    <div>
      <div>
        <button onClick={() => setView('daily')}>Daily</button>
        <button onClick={() => setView('weekly')}>Weekly</button>
      </div>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default StreakChart;
