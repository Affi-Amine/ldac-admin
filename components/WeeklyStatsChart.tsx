'use client'

import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
}

const labels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

const data = {
  labels,
  datasets: [
    {
      label: 'Promotions utilisées',
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Utilisateurs actifs',
      data: [28, 48, 40, 19, 86, 27, 90],
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
}

export function WeeklyStatsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistiques hebdomadaires</CardTitle>
      </CardHeader>
      <CardContent>
        <Bar options={options} data={data} />
      </CardContent>
    </Card>
  )
}

