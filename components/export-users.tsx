'use client'

import { User } from '@/types/user'
import { Button } from '@/components/ui/button'

interface ExportUsersProps {
  users: User[]
}

export function ExportUsers({ users }: ExportUsersProps) {
  const exportToCSV = () => {
    const headers = ['Username', 'Email', 'Phone', 'ID', 'Date de création']
    const csvData = users.map(user => [
      user.username,
      user.email,
      user.phone,
      user.firebase_uid,
      new Date(user.created_at).toLocaleDateString('fr-FR')
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'users.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button 
      className="bg-black hover:bg-black/90 text-white" 
      onClick={exportToCSV}
    >
      Export CSV
    </Button>
  )
}

