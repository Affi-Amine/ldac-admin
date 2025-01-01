import { DashboardStats } from '@/components/DashboardStats'
import { WeeklyStatsChart } from '@/components/WeeklyStatsChart'
import { PartnerPerformanceChart } from '@/components/PartnerPerformanceChart'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Accueil</h1>
      <DashboardStats />
      <div className="grid gap-6 lg:grid-cols-2">
        <WeeklyStatsChart />
        <PartnerPerformanceChart />
      </div>
    </div>
  )
}

