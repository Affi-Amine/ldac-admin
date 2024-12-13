import { Logo } from '@/components/Logo'
import { LoginForm } from '@/components/LoginForm'
import { Footer } from '@/components/Footer'

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between py-8 px-4 bg-gray-50">
      <Logo />
      <LoginForm />
      <Footer />
    </div>
  )
}

