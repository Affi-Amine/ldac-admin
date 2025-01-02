'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
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
import { modifyPromotion, getPartners, Partner } from '@/app/actions/promotions'
import { Promotion } from '@/types/promotion'

interface EditPromotionDialogProps {
  promotion: Promotion
  open: boolean
  onOpenChange: (open: boolean) => void
}

const PACK_TYPES = [
    "Absolute",
    "Evolution",
    "Origin"
  ]
  

export function EditPromotionDialog({ promotion, open, onOpenChange }: EditPromotionDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [partners, setPartners] = useState<Partner[]>([])
  const [formData, setFormData] = useState({
    promotion_id: promotion.promotion_id,
    name: promotion.name,
    description: promotion.description,
    pack_type: promotion.pack_type,
    valid_from: promotion.valid_from.split('T')[0],
    valid_until: promotion.valid_until.split('T')[0],
    usage_limit: promotion.usage_limit.toString(),
    partner_name: promotion.partner_name || '',
    image: null as File | null,
  })
  const [imagePreview, setImagePreview] = useState<string | null>(promotion.image || null)

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

      const result = await modifyPromotion(formDataToSend)

      if (result.success) {
        setMessage('Promotion modified successfully')
        router.refresh()
        setTimeout(() => {
          onOpenChange(false)
        }, 1500)
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error('Error modifying promotion:', error)
      setMessage(error instanceof Error ? error.message : 'Failed to modify promotion')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormData(prev => ({ ...prev, image: file }))

      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] w-[600px] h-[800px] bg-white text-black overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Modifier Promotion</DialogTitle>
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
              <SelectContent>
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
            <Label htmlFor="usage_limit">Limite d&apos;utilisation</Label>
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
              <SelectContent>
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
            {imagePreview && (
              <div className="mt-2">
                <Image src={imagePreview} alt="Image preview" width={200} height={200} objectFit="contain" />
              </div>
            )}
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

