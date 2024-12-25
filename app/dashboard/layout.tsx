'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = document.cookie.includes('isLoggedIn=true')
    if (!isLoggedIn) {
      router.push('/login')
    }
  }, [router])

  const handleLogout = () => {
    document.cookie = 'isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    router.push('/login')
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </header>
        <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

