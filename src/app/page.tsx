'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function Home() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-900">
            Auraline Nutrition
          </h1>
          <p className="text-lg text-gray-600">
            Seu guia personalizado para uma vida mais saudável
          </p>
        </div>

        <div className="space-y-4 pt-8">
          <Button
            onClick={() => router.push('/quiz')}
            className="w-full h-14 text-lg bg-[#00C974] hover:bg-[#00B368] text-white rounded-full"
          >
            Vamos começar
          </Button>

          <Button
            onClick={() => router.push('/login')}
            variant="outline"
            className="w-full h-14 text-lg border-2 border-[#00C974] text-[#00C974] hover:bg-[#00C974] hover:text-white rounded-full"
          >
            Já possuo cadastro
          </Button>
        </div>
      </div>
    </div>
  )
}
