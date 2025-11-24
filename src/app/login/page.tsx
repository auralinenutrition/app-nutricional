'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import { ChevronLeft } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email, password)
      router.push('/dashboard')
    } catch (err) {
      setError('Email ou senha incorretos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto px-6 py-8">
        <Button
          onClick={() => router.push('/')}
          variant="ghost"
          className="mb-8 p-2"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Bem-vindo de volta
            </h1>
            <p className="text-gray-600 mt-2">
              Entre para continuar sua jornada
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                E-mail
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="h-12 border-2"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Senha
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-12 border-2"
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 text-lg bg-[#00C974] hover:bg-[#00B368] text-white rounded-full"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="text-center">
            <button className="text-[#00C974] hover:underline">
              Esqueci minha senha
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
