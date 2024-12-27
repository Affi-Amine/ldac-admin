'use client'

import { Promotion } from '@/types/promotion'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PromotionsTableProps {
  promotions: Promotion[]
}

export function PromotionsTable({ promotions }: PromotionsTableProps) {
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>Nom de Promotion</TableHead>
            <TableHead>Partenaire</TableHead>
            <TableHead>Pack Type</TableHead>
            <TableHead>Date de début</TableHead>
            <TableHead>Date de fin</TableHead>
            <TableHead>ID</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promotions.map((promotion) => (
            <TableRow key={promotion.promotion_id}>
              <TableCell>{promotion.name}</TableCell>
              <TableCell>{promotion.partner || '-'}</TableCell>
              <TableCell>{promotion.pack_type}</TableCell>
              <TableCell>{new Date(promotion.valid_from).toLocaleDateString('fr-FR')}</TableCell>
              <TableCell>{new Date(promotion.valid_until).toLocaleDateString('fr-FR')}</TableCell>
              <TableCell>{promotion.promotion_id}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {}}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {}}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

