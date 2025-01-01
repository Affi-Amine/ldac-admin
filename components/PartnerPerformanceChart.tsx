'use client'

import { useEffect, useState } from 'react'
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getMonthlyPerformance } from '@/app/actions/dashboard'
import type { MonthlyPerformance } from '@/app/actions/dashboard'

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
  maintainAspectRatio: false,
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

export function PartnerPerformanceChart() {
  const [performance, setPerformance] = useState<MonthlyPerformance>({
    leads_generated: [],
    qr_codes_scanned: []
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getMonthlyPerformance()
        setPerformance(data)
      } catch (error) {
        console.error('Error fetching monthly performance:', error)
        setError('Erreur lors du chargement des performances mensuelles')
      } finally {
        setLoading(false)
      }
    }

    fetchPerformance()
    const interval = setInterval(fetchPerformance, 60000)
    return () => clearInterval(interval)
  }, [])

  const data = {
    labels,
    datasets: [
      {
        label: 'Leads générés',
        data: Array.isArray(performance.leads_generated) ? performance.leads_generated : new Array(7).fill(0),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.4,
      },
      {
        label: 'QR codes scannés',
        data: Array.isArray(performance.qr_codes_scanned) ? performance.qr_codes_scanned : new Array(7).fill(0),
        borderColor: 'rgba(53, 162, 235, 1)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.4,
      },
    ],
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className={loading ? 'opacity-60' : ''}>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Performance des partenaires</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Line options={options} data={data} />
        </div>
      </CardContent>
    </Card>
  )
}

