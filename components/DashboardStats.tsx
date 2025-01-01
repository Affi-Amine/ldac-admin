'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Users, BarChart, QrCode, TrendingUp } from 'lucide-react'
import { getDashboardStats } from '@/app/actions/dashboard'
import type { DashboardStats as DashboardStatsType } from '@/app/actions/dashboard'
import { Alert, AlertDescription } from './ui/alert'

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStatsType>({
    active_users_count: 0,
    used_promotions_count: 0,
    conversion_rate: 0,
    leads_generated: 0
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getDashboardStats()
        setStats(data)
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        setError('Erreur lors du chargement des statistiques')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 60000)
    return () => clearInterval(interval)
  }, [])

  const statsConfig = [
    {
      title: "Nombre d'utilisateurs actifs",
      value: stats.active_users_count.toLocaleString(),
      icon: Users,
      description: null
    },
    {
      title: "Nombre de promotions utilisées",
      value: stats.used_promotions_count.toLocaleString(),
      icon: BarChart,
      description: null
    },
    {
      title: "Taux de conversion des promotions",
      value: `${stats.conversion_rate}%`,
      icon: QrCode,
      description: "QR codes scannés chez les partenaires"
    },
    {
      title: "Performances des partenaires",
      value: stats.leads_generated.toLocaleString(),
      icon: TrendingUp,
      description: "Nombre de leads générés"
    }
  ]

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsConfig.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className={`relative overflow-hidden ${loading ? 'opacity-60' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-gray-600" />
                <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold">{stat.value}</div>
                {stat.description && (
                  <p className="text-sm text-gray-500 mt-1">
                    {stat.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

