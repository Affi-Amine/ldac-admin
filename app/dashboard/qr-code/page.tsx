import { QrCode } from 'lucide-react'
import { QRCodeGenerator } from '@/components/qr-code/qr-code-generator'

export default function QRCodePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">Générateur de QR Code</h1>
          <QrCode className="h-6 w-6" />
        </div>
      </div>
      <QRCodeGenerator />
    </div>
  )
}

