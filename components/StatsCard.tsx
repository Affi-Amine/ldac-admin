export function StatsCard() {
  return (
    <div className="rounded-lg border bg-white p-6">
      <h3 className="mb-4 text-lg font-medium">les stats a afichher :</h3>
      <ul className="space-y-2 text-sm text-gray-600">
        <li>• Nombre d&apos;utilisateurs actifs.</li>
        <li>• Nombre de promotions utilisées.</li>
        <li>
          • Taux de conversion des promotions (combien de QR codes ont été scannés
          chez les partenaires).
        </li>
        <li>
          • Performances des partenaires (nombre de leads générés)
        </li>
      </ul>
    </div>
  )
}

