import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Users, BarChart, QrCode, TrendingUp } from 'lucide-react'

const stats = [
  {
    title: "Nombre d'utilisateurs actifs",
    value: "1,234",
    icon: Users,
  },
  {
    title: "Nombre de promotions utilisées",
    value: "5,678",
    icon: BarChart,
  },
  {
    title: "Taux de conversion des promotions",
    value: "23%",
    description: "QR codes scannés chez les partenaires",
    icon: QrCode,
  },
  {
    title: "Performances des partenaires",
    value: "3,456",
    description: "Nombre de leads générés",
    icon: TrendingUp,
  },
]

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              <stat.icon className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">{stat.title}</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.description && (
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

