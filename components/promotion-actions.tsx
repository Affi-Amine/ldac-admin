'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Promotion } from '@/types/promotion'
import { AddPromotionDialog } from './add-promotion-dialog'

interface PromotionActionsProps {
  promotions: Promotion[]
}

export function PromotionActions({ promotions }: PromotionActionsProps) {
  const [isAddPromotionOpen, setIsAddPromotionOpen] = useState(false)

  const exportToCSV = () => {
    const headers = ['Nom', 'Partenaire', 'Pack Type', 'Date de début', 'Date de fin', 'ID']
    const csvData = promotions.map(promotion => [
      promotion.name,
      promotion.partner_name || '-', // Use partner_name instead of partner
      promotion.pack_type,
      new Date(promotion.valid_from).toLocaleDateString('fr-FR'),
      new Date(promotion.valid_until).toLocaleDateString('fr-FR'),
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'promotions.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex gap-2">
      <Button 
        className="bg-black hover:bg-black/90 text-white" 
        onClick={exportToCSV}
      >
        Export CSV
      </Button>
      <Button 
        className="bg-black hover:bg-black/90 text-white"
        onClick={() => setIsAddPromotionOpen(true)}
      >
        Ajouter Promotion
      </Button>
      <AddPromotionDialog
        open={isAddPromotionOpen}
        onOpenChange={setIsAddPromotionOpen}
      />
    </div>
  )
}

