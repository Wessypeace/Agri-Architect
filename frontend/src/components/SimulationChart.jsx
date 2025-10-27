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

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: title, font: { size: 16 } },
    },
    scales: {
      y: {
        title: { display: true, text: t('chart.yAxisLabel') },
        min: 0,
        max: 100,
      },
      x: {
        title: { display: true, text: t('chart.xAxisLabel') },
        ticks: {
          callback: function(value, index) {
            if (window.innerWidth < 768) {
              return index % 4 === 0 ? this.getLabelForValue(value) : '';
            } else {
              return this.getLabelForValue(value);
            }
          },
          maxRotation: 45,
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

  return (
    <div id="results-simulation" className="results-card chart-container">
      <div style={{ position: 'relative', height: '400px' }}>
        <Line options={options} data={data} />
      </div>
    </div>
  );
}

export default SimulationChart;