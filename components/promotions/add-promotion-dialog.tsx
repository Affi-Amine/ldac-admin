'use client'

import { useState, useEffect } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { addPromotion, getPartners, Partner } from '@/app/actions/promotions'

interface AddPromotionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const PACK_TYPES = [
  "Absolute",
  "Evolution",
  "Origin"
]

export function AddPromotionDialog({ open, onOpenChange }: AddPromotionDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [partners, setPartners] = useState<Partner[]>([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pack_type: '',
    valid_from: '',
    valid_until: '',
    usage_limit: '',
    partner_name: '',
    image: null as File | null,
  })

  useEffect(() => {
    async function fetchPartners() {
      const fetchedPartners = await getPartners()
      setPartners(fetchedPartners)
    }
    fetchPartners()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const formDataToSend = new FormData()
      
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          if (key === 'image' && value instanceof File) {
            formDataToSend.append('image', value)
          } else {
            formDataToSend.append(key, value.toString())
          }
        }
      })

      const result = await addPromotion(formDataToSend)

      if (result.success) {
        setMessage('Promotion added successfully')
        router.refresh()
        setTimeout(() => {
          onOpenChange(false)
        }, 1500)
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error('Error adding promotion:', error)
      setMessage(error instanceof Error ? error.message : 'Failed to add promotion')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] w-[600px] h-[800px] bg-white text-black overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Ajouter Promotion</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nom de la promotion</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="h-12"
              required
              maxLength={100}
            />
            <p className="text-sm text-gray-500">{formData.name.length}/100 caractères</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="min-h-[100px] resize-none"
              required
            />
            <p className="text-sm text-gray-500">{formData.description.length} caractères</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pack_type">Type de pack</Label>
            <Select
              value={formData.pack_type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, pack_type: value }))}
              required
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Sélectionner un type de pack" />
              </SelectTrigger>
              <SelectContent className='bg-white'>
                {PACK_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valid_from">Date de début</Label>
              <Input
                id="valid_from"
                type="date"
                value={formData.valid_from}
                onChange={(e) => setFormData(prev => ({ ...prev, valid_from: e.target.value }))}
                className="h-12"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valid_until">Date de fin</Label>
              <Input
                id="valid_until"
                type="date"
                value={formData.valid_until}
                onChange={(e) => setFormData(prev => ({ ...prev, valid_until: e.target.value }))}
                className="h-12"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="usage_limit">Limite d'utilisation</Label>
            <Input
              id="usage_limit"
              type="number"
              min="1"
              value={formData.usage_limit}
              onChange={(e) => setFormData(prev => ({ ...prev, usage_limit: e.target.value }))}
              className="h-12"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="partner_name">Partenaire</Label>
            <Select
              value={formData.partner_name}
              onValueChange={(value) => setFormData(prev => ({ ...prev, partner_name: value }))}
              required
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Sélectionner un partenaire" />
              </SelectTrigger>
              <SelectContent className='bg-white'>
                {partners.map((partner) => (
                  <SelectItem key={partner.id} value={partner.name}>
                    {partner.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="h-12"
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
              {loading ? 'Ajout...' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

