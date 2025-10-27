import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function SimulationChart({ simulationData, title, t }) {
  if (!simulationData) {
    return null;
  }

  // --- NEW RESPONSIVE CHART OPTIONS ---
  const options = {
    responsive: true,
    maintainAspectRatio: false, // IMPORTANT: Allows the chart to shrink vertically
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16, // Slightly smaller title for mobile
        },
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: t('chart.yAxisLabel'),
        },
        min: 0,
        max: 100,
      },
      x: {
        title: {
          display: true,
          text: t('chart.xAxisLabel'),
        },
        // THIS IS THE MAGIC FOR MOBILE RESPONSIVENESS:
        ticks: {
          callback: function(value, index) {
            // If the screen is small (less than 768px wide), only show a label every 4 days.
            // Otherwise, show all labels.
            if (window.innerWidth < 768) {
              return index % 4 === 0 ? this.getLabelForValue(value) : '';
            } else {
              return this.getLabelForValue(value);
            }
          },
          maxRotation: 45, // Rotate labels slightly if they still overlap
          minRotation: 0,
        }
      }
    }
  };

  const data = {
    labels: simulationData.labels,
    datasets: [
      {
        label: t('chart.normalSoil'),
        data: simulationData.normalSoil,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: t('chart.aquaSpngeSoil'),
        data: simulationData.aquaSpngeSoil,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  // The 'return' statement is now wrapped in a div to control height
  return (
    <div className="results-card chart-container">
      <div style={{ position: 'relative', height: '400px' }}>
        <Line options={options} data={data} />
      </div>
    </div>
  );
}

export default SimulationChart;