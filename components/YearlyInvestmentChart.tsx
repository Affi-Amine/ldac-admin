'use client'

import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (tickValue: string | number) => {
          // Ensure tickValue is a number before formatting
          if (typeof tickValue === 'number') {
            return `$${tickValue.toLocaleString()}` // Format with dollar sign
          }
          return tickValue
        },
      },
    },
  },
}

const data = {
  labels: ['2016', '2017', '2018', '2019', '2020', '2021'],
  datasets: [
    {
      label: 'Yearly Investment',
      data: [5000, 20000, 15000, 35000, 20000, 25000],
      borderColor: 'rgb(249, 115, 22)',
      tension: 0.4,
    },
  ],
}

export function YearlyInvestmentChart() {
  return (
    <div className="rounded-lg border bg-white p-6">
      <h3 className="mb-4 text-lg font-medium">Yearly Total Investment</h3>
      <Line options={options} data={data} height={200} />
    </div>
  )
}