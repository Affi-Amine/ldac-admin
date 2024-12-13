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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
      position: 'top' as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
}

const labels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil']

const data = {
  labels,
  datasets: [
    {
      label: 'Leads générés',
      data: [120, 190, 300, 500, 200, 350, 400],
      borderColor: 'rgba(255, 99, 132, 1)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'QR codes scannés',
      data: [200, 300, 400, 600, 300, 450, 500],
      borderColor: 'rgba(53, 162, 235, 1)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
}

export function PartnerPerformanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance des partenaires</CardTitle>
      </CardHeader>
      <CardContent>
        <Line options={options} data={data} />
      </CardContent>
    </Card>
  )
}

