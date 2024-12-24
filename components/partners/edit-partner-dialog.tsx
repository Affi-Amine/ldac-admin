'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Partner } from '@/types/partner'
import { modifyPartner } from '@/app/actions/partners'

interface EditPartnerDialogProps {
  partner: Partner
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditPartnerDialog({ partner, open, onOpenChange }: EditPartnerDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    name: partner.name,
    contact_email: partner.contact_email,
    phone_number: partner.phone_number,
    description: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const result = await modifyPartner({
        firebase_uid: partner.firebase_uid,
        name: formData.name,
        contact_email: formData.contact_email,
        phone_number: formData.phone_number,
      })

      if (result.success) {
        setMessage('Partner updated successfully')
        console.log('Partner updated:', result.partner)
        onOpenChange(false)
        router.refresh()
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error('Error updating partner:', error)
      setMessage(error instanceof Error ? error.message : 'Failed to update partner')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px text-black bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl">Modifier Partenaire</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du partenaire</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="h-12"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.contact_email}
              onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
              className="h-12"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telephone</Label>
            <Input
              id="phone"
              value={formData.phone_number}
              onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
              className="h-12"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="min-h-[100px] resize-none"
            />
          </div>

          {message && (
            <div className={`text-sm ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </div>
          )}

          <div className="flex justify-center pt-4">
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-black hover:bg-black/90 text-white px-12 py-6 text-lg h-auto"
            >
              {loading ? 'Modification...' : 'Modifier'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

