'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function QuizResultPage() {
  const router = useRouter()
  const [quizData, setQuizData] = useState<any>(null)

  useEffect(() => {
    const data = localStorage.getItem('quizData')
    if (data) {
      setQuizData(JSON.parse(data))
    }
  }, [])

  if (!quizData) {
    return <div className="min-h-screen bg-white flex items-center justify-center">
      <p>Carregando...</p>
    </div>
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-[#00C974] rounded-full mx-auto flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            Seu plano inicial está pronto!
          </h1>
          
          <p className="text-gray-600">
            Com base nas suas respostas, montamos recomendações ideais para você.
          </p>

          <div className="bg-gray-50 rounded-2xl p-6 space-y-4 text-left">
            <div>
              <h3 className="font-semibold text-gray-900">Objetivo</h3>
              <p className="text-gray-600">{quizData.objetivo}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">Refeições recomendadas</h3>
              <p className="text-gray-600">{quizData.refeicoes_dia} refeições por dia</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">Nível de treino</h3>
              <p className="text-gray-600">{quizData.nivel_treino}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">Frequência semanal</h3>
              <p className="text-gray-600">{quizData.frequencia_treino}</p>
            </div>

            {quizData.dificuldade_principal.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900">Principais desafios</h3>
                <p className="text-gray-600">{quizData.dificuldade_principal.join(', ')}</p>
              </div>
            )}
          </div>

          <Button
            onClick={() => router.push('/register')}
            className="w-full h-14 text-lg bg-[#00C974] hover:bg-[#00B368] text-white rounded-full"
          >
            Criar minha conta para continuar
          </Button>
        </div>
      </div>
    </div>
  )
}
