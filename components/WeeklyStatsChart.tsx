'use client'

import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getWeeklyStats } from '@/app/actions/dashboard'
import type { WeeklyStats } from '@/app/actions/dashboard'

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

const labels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

export function WeeklyStatsChart() {
  const [stats, setStats] = useState<WeeklyStats>({
    promotions_used: [],
    active_users: []
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getWeeklyStats()
        setStats(data)
      } catch (error) {
        console.error('Error fetching weekly stats:', error)
        setError('Erreur lors du chargement des statistiques hebdomadaires')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 60000)
    return () => clearInterval(interval)
  }, [])

  const data = {
    labels,
    datasets: [
      {
        label: 'Promotions utilisées',
        data: Array.isArray(stats.promotions_used) ? stats.promotions_used : new Array(7).fill(0),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Utilisateurs actifs',
        data: Array.isArray(stats.active_users) ? stats.active_users : new Array(7).fill(0),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgba(53, 162, 235, 1)',
        borderWidth: 1,
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
        <CardTitle className="text-lg font-medium">Statistiques hebdomadaires</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Bar options={options} data={data} />
        </div>
      </CardContent>
    </Card>
  )
}

