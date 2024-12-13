import { Building2 } from 'lucide-react'

export default function PartnersPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Partenaires</h1>
        <Building2 className="h-6 w-6" />
      </div>
      <p className="text-lg">
        Bienvenue sur la page de gestion des partenaires. Ici, vous pouvez voir et gérer tous les partenaires de La Dame au Chignon.
      </p>
      {/* Add more partner management content here */}
    </div>
  )
}

