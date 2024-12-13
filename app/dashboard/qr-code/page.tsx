import { QrCode } from 'lucide-react'

export default function QRCodePage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">QR Code</h1>
        <QrCode className="h-6 w-6" />
      </div>
      <p className="text-lg">
        Bienvenue sur la page de gestion des QR codes. Ici, vous pouvez générer et gérer les QR codes pour les promotions de La Dame au Chignon.
      </p>
      {/* Add more QR code management content here */}
    </div>
  )
}

