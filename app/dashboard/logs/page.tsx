import { Settings } from 'lucide-react'

export default function LogsPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Log Actions</h1>
        <Settings className="h-6 w-6" />
      </div>
      <p className="text-lg">
        Bienvenue sur la page des logs d'actions. Ici, vous pouvez voir toutes les actions importantes effectuées dans le système La Dame au Chignon.
      </p>
      {/* Add more log viewing content here */}
    </div>
  )
}

