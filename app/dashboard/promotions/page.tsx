import { PromotionsManagement } from "@/components/promotions/prmotions-management"
import { BarChart3 } from "lucide-react"

export default function PromotionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">Promotions</h1>
          <BarChart3 className="h-6 w-6" />
        </div>
      </div>
      <PromotionsManagement />
    </div>
  )
}

