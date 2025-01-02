'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Promotion } from '@/types/promotion'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getPromotions, addPromotion, modifyPromotion, deletePromotion, getPartners } from '@/app/actions/promotions'

const PACK_TYPES = ["Standard", "Premium", "VIP", "Origin"]

export function PromotionsTable() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [partners, setPartners] = useState<{ id: number; name: string }[]>([])
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null)
  const [isAddingPromotion, setIsAddingPromotion] = useState(false)
  const [deletingPromotion, setDeletingPromotion] = useState<Promotion | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
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
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    fetchPromotions()
    fetchPartners()
  }, [])

  const fetchPromotions = async () => {
    const fetchedPromotions = await getPromotions()
    setPromotions(fetchedPromotions)
  }

  const fetchPartners = async () => {
    const fetchedPartners = await getPartners()
    setPartners(fetchedPartners)
  }

  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion)
    setFormData({
      name: promotion.name,
      description: promotion.description,
      pack_type: promotion.pack_type,
      valid_from: promotion.valid_from.split('T')[0],
      valid_until: promotion.valid_until.split('T')[0],
      usage_limit: promotion.usage_limit.toString(),
      partner_name: promotion.partner_name || '',
      image: null,
    })
    setImagePreview(promotion.image || null)
  }

  const handleDelete = (promotion: Promotion) => {
    setDeletingPromotion(promotion)
  }

  const confirmDelete = async () => {
    if (!deletingPromotion) return

    setLoading(true)
    setMessage('')
    try {
      const result = await deletePromotion(deletingPromotion.promotion_id)
      if (result.success) {
        setMessage('Promotion deleted successfully')
        fetchPromotions()
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error('Error deleting promotion:', error)
      setMessage(error instanceof Error ? error.message : 'Failed to delete promotion')
    } finally {
      setLoading(false)
      setDeletingPromotion(null)
    }
  }

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

      if (editingPromotion) {
        formDataToSend.append('promotion_id', editingPromotion.promotion_id.toString())
        const result = await modifyPromotion(formDataToSend)
        if (result.success) {
          setMessage('Promotion modified successfully')
          fetchPromotions()
        } else {
          throw new Error(result.message)
        }
      } else {
        const result = await addPromotion(formDataToSend)
        if (result.success) {
          setMessage('Promotion added successfully')
          fetchPromotions()
        } else {
          throw new Error(result.message)
        }
      }

      setEditingPromotion(null)
      setIsAddingPromotion(false)
    } catch (error) {
      console.error('Error submitting promotion:', error)
      setMessage(error instanceof Error ? error.message : 'Failed to submit promotion')
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
    <>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold">Promotions</h1>
        <Button onClick={() => setIsAddingPromotion(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Promotion
        </Button>
      </div>
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
                <TableCell>{promotion.partner_name || '-'}</TableCell>
                <TableCell>{promotion.pack_type}</TableCell>
                <TableCell>{new Date(promotion.valid_from).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell>{new Date(promotion.valid_until).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell>{promotion.promotion_id}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(promotion)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(promotion)}
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
      <Dialog open={!!editingPromotion || isAddingPromotion} onOpenChange={(open) => {
        if (!open) {
          setEditingPromotion(null)
          setIsAddingPromotion(false)
        }
      }}>
        <DialogContent className="sm:max-w-[600px] w-[600px] h-[800px] bg-white text-black overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {editingPromotion ? 'Modifier Promotion' : 'Ajouter Promotion'}
            </DialogTitle>
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

            <div className="flex justify-center pt-4">
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-black hover:bg-black/90 text-white px-12 py-6 text-lg h-auto"
              >
                {loading ? 'Traitement...' : (editingPromotion ? 'Modifier' : 'Ajouter')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={!!deletingPromotion} onOpenChange={(open) => !open && setDeletingPromotion(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer la promotion {deletingPromotion?.name} ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingPromotion(null)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={loading}>
              {loading ? 'Suppression...' : 'Supprimer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

