import { Share } from 'lucide-react'
import { DashboardStats } from '@/components/DashboardStats'
import { WeeklyStatsChart } from '@/components/WeeklyStatsChart'
import { PartnerPerformanceChart } from '@/components/PartnerPerformanceChart'

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Accueil</h1>
        <button className="rounded-lg p-2 hover:bg-gray-100">
          <Share className="h-5 w-5" />
        </button>
      </div>
      <div className="space-y-6">
        <DashboardStats />
        <div className="grid gap-6 lg:grid-cols-2">
          <WeeklyStatsChart />
          <PartnerPerformanceChart />
        </div>
      </div>
    </div>
  )
}

