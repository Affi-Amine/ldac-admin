"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Pencil, Trash2, Plus } from "lucide-react"
import type { Promotion } from "@/types/promotion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getPromotions, deletePromotion, modifyPromotion, getPartners, addPromotion } from "@/app/actions/promotions"

const PACK_TYPES = ["Standard", "Premium", "VIP", "Origin"]

export function PromotionsManagement() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [partners, setPartners] = useState<{ id: number; name: string }[]>([])
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null)
  const [deletingPromotion, setDeletingPromotion] = useState<Promotion | null>(null)
  const [isAddingPromotion, setIsAddingPromotion] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pack_type: "",
    valid_from: "",
    valid_until: "",
    usage_limit: "",
    partner_name: "",
    image: null as File | null,
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    fetchPromotions()
    fetchPartners()
  }, [])

  useEffect(() => {
    if (editingPromotion) {
      setFormData({
        name: editingPromotion.name || "",
        description: editingPromotion.description || "",
        pack_type: editingPromotion.pack_type || "",
        valid_from: editingPromotion.valid_from ? editingPromotion.valid_from.split("T")[0] : "",
        valid_until: editingPromotion.valid_until ? editingPromotion.valid_until.split("T")[0] : "",
        usage_limit: typeof editingPromotion.usage_limit === "number" ? editingPromotion.usage_limit.toString() : "",
        partner_name: editingPromotion.partner_name || "",
        image: null,
      })
      setImagePreview(editingPromotion.image || null)
    } else {
      // Reset form when not editing
      setFormData({
        name: "",
        description: "",
        pack_type: "",
        valid_from: "",
        valid_until: "",
        usage_limit: "",
        partner_name: "",
        image: null,
      })
      setImagePreview(null)
    }
  }, [editingPromotion])

  const fetchPromotions = async () => {
    try {
      const data = await getPromotions()
      setPromotions(data)
    } catch (error) {
      console.error("Error fetching promotions:", error)
      setError("Failed to load promotions")
    }
  }

  const fetchPartners = async () => {
    try {
      const data = await getPartners()
      setPartners(data)
    } catch (error) {
      console.error("Error fetching partners:", error)
      setError("Failed to load partners")
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPromotion) return
  
    setLoading(true)
    setError(null)
  
    try {
      const formDataToSend = new FormData()
      formDataToSend.append("promotion_id", editingPromotion.promotion_id.toString())
  
      // Explicitly append all fields
      formDataToSend.append("name", formData.name)
      formDataToSend.append("description", formData.description)
      formDataToSend.append("pack_type", formData.pack_type)
      formDataToSend.append("valid_from", formData.valid_from)
      formDataToSend.append("valid_until", formData.valid_until)
      // Ensure usage_limit and partner_name are always included
      formDataToSend.append("usage_limit", formData.usage_limit || "0")
      formDataToSend.append("partner_name", formData.partner_name || "")
  
      if (formData.image instanceof File) {
        formDataToSend.append("image", formData.image)
      }
  
      const result = await modifyPromotion(formDataToSend)
  
      if (result.success) {
        await fetchPromotions()
        setEditingPromotion(null)
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error("Error modifying promotion:", error)
      setError(error instanceof Error ? error.message : "Failed to modify promotion")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingPromotion) return

    setLoading(true)
    setError(null)

    try {
      const result = await deletePromotion(deletingPromotion.promotion_id)

      if (result.success) {
        await fetchPromotions()
        setDeletingPromotion(null)
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error("Error deleting promotion:", error)
      setError(error instanceof Error ? error.message : "Failed to delete promotion")
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormData((prev) => ({ ...prev, image: file }))

      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleExportCSV = () => {
    const headers = ["Nom", "Partenaire", "Pack Type", "Date de début", "Date de fin", "Limite d'utilisation"]
    const csvData = promotions.map((promotion) => [
      promotion.name,
      promotion.partner_name || "-",
      promotion.pack_type,
      new Date(promotion.valid_from).toLocaleDateString("fr-FR"),
      new Date(promotion.valid_until).toLocaleDateString("fr-FR"),
      promotion.usage_limit,
    ])

    const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "promotions.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const formDataToSend = new FormData()

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          if (key === "image" && value instanceof File) {
            formDataToSend.append("image", value)
          } else {
            formDataToSend.append(key, value.toString())
          }
        }
      })

      const result = await addPromotion(formDataToSend)

      if (result.success) {
        await fetchPromotions()
        setIsAddingPromotion(false)
        setFormData({
          name: "",
          description: "",
          pack_type: "",
          valid_from: "",
          valid_until: "",
          usage_limit: "",
          partner_name: "",
          image: null,
        })
        setImagePreview(null)
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error("Error adding promotion:", error)
      setError(error instanceof Error ? error.message : "Failed to add promotion")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <Button onClick={handleExportCSV}>Export CSV</Button>
          <Button onClick={() => setIsAddingPromotion(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter Promotion
          </Button>
        </div>
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
              <TableHead>Limite d&apos;utilisation</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {
  promotions.map((promotion) => (
    <TableRow key={promotion.promotion_id}>
      <TableCell>{promotion.name}</TableCell>
      <TableCell>{promotion.partner_name || "-"}</TableCell>
      <TableCell>{promotion.pack_type}</TableCell>
      <TableCell>{new Date(promotion.valid_from).toLocaleDateString("fr-FR")}</TableCell>
      <TableCell>{new Date(promotion.valid_until).toLocaleDateString("fr-FR")}</TableCell>
      <TableCell>{promotion.usage_limit !== null ? promotion.usage_limit : "-"}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" size="icon" onClick={() => setEditingPromotion(promotion)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDeletingPromotion(promotion)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  ))
}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingPromotion} onOpenChange={(open) => !open && setEditingPromotion(null)}>
        <DialogContent className="sm:max-w-[600px] w-[600px] max-h-[80vh] bg-white text-black overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle>Modifier la promotion</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-6">
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de la promotion</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="min-h-[100px] resize-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pack_type">Type de pack</Label>
                <Select
                  value={formData.pack_type}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, pack_type: value }))}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Sélectionner un type" />
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
                    onChange={(e) => setFormData((prev) => ({ ...prev, valid_from: e.target.value }))}
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
                    onChange={(e) => setFormData((prev) => ({ ...prev, valid_until: e.target.value }))}
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
                  onChange={(e) => setFormData((prev) => ({ ...prev, usage_limit: e.target.value }))}
                  className="h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="partner">Partenaire</Label>
                <Select
                  value={formData.partner_name}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, partner_name: value }))}
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
                <Input id="image" type="file" accept="image/*" onChange={handleFileChange} className="h-12" />
                {imagePreview && (
                  <div className="mt-2">
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      width={200}
                      height={200}
                      className="rounded-md object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setEditingPromotion(null)}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Modification..." : "Modifier"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
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
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog
        open={isAddingPromotion}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddingPromotion(false)
            setFormData({
              name: "",
              description: "",
              pack_type: "",
              valid_from: "",
              valid_until: "",
              usage_limit: "",
              partner_name: "",
              image: null,
            })
            setImagePreview(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px] w-[600px] max-h-[80vh] bg-white text-black overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle>Ajouter une promotion</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-6">
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de la promotion</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="min-h-[100px] resize-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pack_type">Type de pack</Label>
                <Select
                  value={formData.pack_type}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, pack_type: value }))}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Sélectionner un type" />
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
                    onChange={(e) => setFormData((prev) => ({ ...prev, valid_from: e.target.value }))}
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
                    onChange={(e) => setFormData((prev) => ({ ...prev, valid_until: e.target.value }))}
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
                  onChange={(e) => setFormData((prev) => ({ ...prev, usage_limit: e.target.value }))}
                  className="h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="partner">Partenaire</Label>
                <Select
                  value={formData.partner_name}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, partner_name: value }))}
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
                <Input id="image" type="file" accept="image/*" onChange={handleFileChange} className="h-12" />
                {imagePreview && (
                  <div className="mt-2">
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      width={200}
                      height={200}
                      className="rounded-md object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddingPromotion(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Ajout..." : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

