'use client'

import { useState, useRef, useCallback } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useReactToPrint } from 'react-to-print'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from '@/components/ui/card'

const PACK_TYPES = ["Origin", "Absolute", "Evolution"]

export function QRCodeGenerator() {
  const [qrCodeId, setQrCodeId] = useState('')
  const [packType, setPackType] = useState('')
  const qrCodeRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    documentTitle: 'QR Code',
    onAfterPrint: () => console.log('Print successful'),
  })

  const printRef = useCallback(() => qrCodeRef.current, [])

  const qrCodeData = JSON.stringify({
    qr_code_id: qrCodeId,
    pack_type: packType,
  })

  const onPrintClick = useCallback(() => {
    handlePrint(printRef)
  }, [handlePrint, printRef])

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-8">
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="qr-code-id">ID du QR Code</Label>
              <Input
                id="qr-code-id"
                value={qrCodeId}
                onChange={(e) => setQrCodeId(e.target.value)}
                placeholder="Entrez l'ID du QR Code"
                className="h-12"
              />
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
            <div 
              ref={qrCodeRef} 
              className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center space-y-6"
            >
              {qrCodeId && packType ? (
                <>
                  <QRCodeSVG 
                    value={qrCodeData}
                    size={400}
                    level="H"
                    includeMargin={true}
                  />
                  <div className="text-center space-y-2">
                    <p className="font-medium">ID: {qrCodeId}</p>
                    <p className="font-medium">Pack: {packType}</p>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500 py-20">
                  Remplissez les champs pour générer le QR Code
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <Button 
              onClick={onPrintClick}
              disabled={!qrCodeId || !packType}
              className="w-48 h-12 bg-black text-white hover:bg-white hover:text-black"
            >
              Imprimer le QR Code
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

