'use client'

import { Partner } from '@/types/partner'
import { Button } from '@/components/ui/button'

interface ExportPartnersProps {
  partners: Partner[]
}

export function ExportPartners({ partners }: ExportPartnersProps) {
  const exportToCSV = () => {
    // Convert partners data to CSV format
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

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'partners.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button variant="outline" onClick={exportToCSV}>
      Export CSV
    </Button>
  )
}

