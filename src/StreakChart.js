import React, { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

function StreakChart({ habits }) {
  const [view, setView] = useState('daily');
  const chartData = useMemo(() => {
    const filterType = view === 'daily' ? 'daily' : 'weekly';
    const filteredHabits = habits.filter(habit => habit.trackingType === filterType);

    // Data structure for Line chart
    const datasets = filteredHabits.map(habit => {
      // You will need to ensure that 'completions' array exists and is properly formatted
      const completionData = habit.completions.map(completion => {
        return {
          x: completion.date,
          y: completion.count
        };
      });

      return {
        label: habit.text,
        data: completionData,
        fill: false,
        borderColor: filterType === 'daily' ? 'rgba(54, 162, 235)' : 'rgba(255, 206, 86)',
        tension: 0.1
      };
    });

    return {
      datasets: datasets
    };
  }, [habits, view]);

  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day'
        },
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count'
        }
      }
    },
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: `Habit Tracking (${view.charAt(0).toUpperCase() + view.slice(1)})`
      }
    }
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
