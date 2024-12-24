'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Partner } from '@/types/partner'
import { AddPartnerDialog } from './add-partner-dialog'

interface PartnerActionsProps {
  partners: Partner[]
}

export function PartnerActions({ partners }: PartnerActionsProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isAddPartnerOpen, setIsAddPartnerOpen] = useState(false)

  const exportToCSV = () => {
    setIsExporting(true)
    try {
      const headers = ['Name', 'Email', 'Phone', 'ID', 'Date de création']
      const csvData = partners.map(partner => [
        partner.name,
        partner.contact_email,
        partner.phone_number,
        partner.firebase_uid,
        new Date(partner.created_at).toLocaleDateString('fr-FR')
      ])

      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'partners.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error exporting CSV:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button 
        className="bg-black hover:bg-black/90 text-white" 
        onClick={exportToCSV}
        disabled={isExporting}
      >
        {isExporting ? 'Exporting...' : 'Export CSV'}
      </Button>
      <Button 
        className="bg-black hover:bg-black/90 text-white"
        onClick={() => setIsAddPartnerOpen(true)}
      >
        Ajouter Partenaire
      </Button>
      <AddPartnerDialog
        open={isAddPartnerOpen}
        onOpenChange={setIsAddPartnerOpen}
      />
    </div>
  )
}

