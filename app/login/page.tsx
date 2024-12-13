'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/Logo'
import { LoginForm } from '@/components/LoginForm'
import { Footer } from '@/components/Footer'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Clear any existing session
    document.cookie = 'isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'

    const isLoggedIn = document.cookie.includes('isLoggedIn=true')
    if (isLoggedIn) {
      router.push('/dashboard')
    }
  }, [router])

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between py-8 px-4 bg-gray-50">
      <Logo />
      <LoginForm />
      <Footer />
    </div>
  )
}

