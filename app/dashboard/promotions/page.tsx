import { BarChart3 } from 'lucide-react'

export default function PromotionsPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Promotions</h1>
        <BarChart3 className="h-6 w-6" />
      </div>
      <p className="text-lg">
        Bienvenue sur la page de gestion des promotions. Ici, vous pouvez créer, modifier et suivre toutes les promotions de La Dame au Chignon.
      </p>
      {/* Add more promotion management content here */}
    </div>
  )
}

