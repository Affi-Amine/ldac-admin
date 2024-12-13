import { Users } from 'lucide-react'

export default function UsersPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Utilisateurs</h1>
        <Users className="h-6 w-6" />
      </div>
      <p className="text-lg">
        Bienvenue sur la page de gestion des utilisateurs. Ici, vous pouvez voir et gérer tous les utilisateurs de La Dame au Chignon.
      </p>
      {/* Add more user management content here */}
    </div>
  )
}

