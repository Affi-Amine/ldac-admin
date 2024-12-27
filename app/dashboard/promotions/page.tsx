import { BarChart3 } from 'lucide-react'
import { getPromotions } from '@/app/actions/promotions'
import { PromotionActions } from '@/components/promotions/promotion-actions'
import { PromotionsTable } from '@/components/promotions-table'

export default async function PromotionsPage() {
  const promotions = await getPromotions()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">Promotions</h1>
          <BarChart3 className="h-6 w-6" />
        </div>
        <PromotionActions promotions={promotions} />
      </div>
      <PromotionsTable promotions={promotions} />
    </div>
  )
}

