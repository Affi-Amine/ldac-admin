import { Building2 } from 'lucide-react'
import { getPartners } from '@/app/actions/partners'
import { PartnersTable } from '@/components/partners/partners-table'
import { PartnerActions } from '@/components/partners/partner-actions'

export default async function PartnersPage() {
  try {
    const partners = await getPartners()
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">Partenaires</h1>
            <Building2 className="h-6 w-6" />
          </div>
          <PartnerActions partners={partners} />
        </div>
        <PartnersTable partners={partners} />
      </div>
    )
  } catch (error) {
    console.error('Error loading partners:', error)
    return <div>Une erreur s&apos;est produite lors du chargement des partenaires.</div>
  }
}

