'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Partner } from '@/types/partner'
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
import { EditPartnerDialog } from './edit-partner-dialog'
import { deletePartner } from '@/app/actions/partners'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface PartnersTableProps {
  partners: Partner[]
}

export function PartnersTable({ partners }: PartnersTableProps) {
  const router = useRouter()
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [deletingPartner, setDeletingPartner] = useState<Partner | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const handleDelete = async () => {
    if (!deletingPartner) return

    setLoading(deletingPartner.firebase_uid)
    setMessage('')
    try {
      const result = await deletePartner(deletingPartner.firebase_uid)
      
      if (result.success) {
        setMessage('Partner deleted successfully')
        console.log('Partner deleted:', deletingPartner)
        router.refresh()
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error('Error deleting partner:', error)
      setMessage(error instanceof Error ? error.message : 'Failed to delete partner')
    } finally {
      setLoading(null)
      setDeletingPartner(null)
    }
  }

  return (
    <>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partners.map((partner) => (
              <TableRow key={partner.partner_id}>
                <TableCell>{partner.name}</TableCell>
                <TableCell>{partner.contact_email}</TableCell>
                <TableCell>{partner.phone_number}</TableCell>
                <TableCell>{partner.firebase_uid}</TableCell>
                <TableCell>
                  {new Date(partner.created_at).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingPartner(partner)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={loading === partner.firebase_uid}
                      onClick={() => setDeletingPartner(partner)}
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
      {message && (
        <div className={`mt-4 text-sm ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </div>
      )}
      {editingPartner && (
        <EditPartnerDialog
          partner={editingPartner}
          open={true}
          onOpenChange={(open) => {
            if (!open) setEditingPartner(null)
          }}
        />
      )}
      <Dialog open={!!deletingPartner} onOpenChange={(open) => !open && setDeletingPartner(null)}>
        <DialogContent className='bg-white text-black'>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le partenaire {deletingPartner?.name} ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingPartner(null)}>
              Annuler
            </Button>
            <Button className='bg-red-400 hover:bg-red-500 text-white' variant="destructive" onClick={handleDelete} disabled={loading === deletingPartner?.firebase_uid}>
              {loading === deletingPartner?.firebase_uid ? 'Suppression...' : 'Supprimer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

