'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Home, Users, Building2, BarChart3, QrCode, LogOut } from 'lucide-react'
import { Logo } from './Logo'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Accueil', href: '/dashboard', icon: Home },
  { name: 'Partenaires', href: '/dashboard/partners', icon: Building2 },
  { name: 'Utilisateurs', href: '/dashboard/users', icon: Users },
  { name: 'Promotions', href: '/dashboard/promotions', icon: BarChart3 },
  { name: 'QR code', href: '/dashboard/qr-code', icon: QrCode },
]

export function Sidebar() {
  const router = useRouter()

  const handleLogout = () => {
    // Clear the isLoggedIn cookie
    document.cookie = 'isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    // Redirect to login page
    router.push('/login')
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="p-4">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="p-4">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </div>
  )
}

