"use client"

import { useState, useRef, useCallback } from "react"
import { QRCodeSVG } from "qrcode.react"
import { useReactToPrint } from "react-to-print"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { RefreshCw, Download } from 'lucide-react'
import { jsPDF } from "jspdf"

const PACK_TYPES = ["Origin", "Evolution", "High Privilege"]

export function QRCodeGenerator() {
  const [qrCodeId, setQrCodeId] = useState("")
  const [packType, setPackType] = useState("")
  const qrCodeRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    documentTitle: "QR Code",
    onAfterPrint: () => console.log("Print successful"),
  })

  const printRef = useCallback(() => qrCodeRef.current, [])

  const generateUniqueId = () => {
    // Combine timestamp with random string for uniqueness
    const timestamp = Date.now().toString(36)
    const randomStr = Math.random().toString(36).substring(2, 8)
    const uniqueId = `LDC-${timestamp}-${randomStr}`.toUpperCase()
    setQrCodeId(uniqueId)
  }

  const qrCodeData = JSON.stringify({
    qr_code_id: qrCodeId,
    pack_type: packType,
  })

  const onPrintClick = useCallback(() => {
    handlePrint(printRef)
  }, [handlePrint, printRef])

  const handleDownloadPDF = useCallback(() => {
    if (qrCodeRef.current) {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const qrCodeElement = qrCodeRef.current
      const canvas = document.createElement("canvas")
      canvas.width = qrCodeElement.offsetWidth * 2
      canvas.height = qrCodeElement.offsetHeight * 2
      const ctx = canvas.getContext("2d")

      if (ctx) {
        ctx.scale(2, 2)
        ctx.fillStyle = "white"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const svgData = new XMLSerializer().serializeToString(qrCodeElement.querySelector("svg")!)
        const img = new Image()
        img.onload = () => {
          ctx.drawImage(img, 0, 0)
          const imgData = canvas.toDataURL("image/png")
          pdf.addImage(imgData, "PNG", 10, 10, 190, 190)
          pdf.text(`ID: ${qrCodeId}`, 10, 205)
          pdf.text(`Pack: ${packType}`, 10, 215)
          pdf.save(`qrcode_${qrCodeId}.pdf`)
        }
        img.src = "data:image/svg+xml;base64," + btoa(svgData)
      }
    }
  }, [qrCodeId, packType])

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-8">
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-6 items-start">
            <div className="space-y-2">
              <Label htmlFor="qr-code-id">ID du QR Code</Label>
              <div className="flex gap-2">
                <Input
                  id="qr-code-id"
                  value={qrCodeId}
                  readOnly
                  placeholder="Cliquez sur Générer ID"
                  className="h-12 bg-gray-50"
                />
                <Button onClick={generateUniqueId} className="flex-shrink-0 h-12" variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Générer ID
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pack-type">Type de Pack</Label>
              <Select value={packType} onValueChange={setPackType}>
                <SelectTrigger id="pack-type" className="h-12">
                  <SelectValue placeholder="Sélectionnez le type de pack" />
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
          </div>

          <div className="flex justify-center">
            <div ref={qrCodeRef} className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center space-y-6">
              {qrCodeId && packType ? (
                <>
                  <QRCodeSVG value={qrCodeData} size={400} level="H" includeMargin={true} />
                  <div className="text-center space-y-2">
                    <p className="font-medium">ID: {qrCodeId}</p>
                    <p className="font-medium">Pack: {packType}</p>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500 py-20">
                  Générez un ID et sélectionnez un type de pack pour générer le QR Code
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <Button onClick={onPrintClick} disabled={!qrCodeId || !packType} className="w-48 h-12 bg-black hover:bg-black/90 text-white">
              Imprimer le QR Code
            </Button>
            <Button onClick={handleDownloadPDF} disabled={!qrCodeId || !packType} className="w-48 h-12 bg-black hover:bg-black/90 text-white">
              <Download className="mr-2 h-4 w-4" />
              Télécharger PDF
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
