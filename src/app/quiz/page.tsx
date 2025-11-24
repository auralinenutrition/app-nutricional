'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronLeft, Check } from 'lucide-react'

type QuizData = {
  objetivo: string
  nivel_treino: string
  frequencia_treino: string
  peso_atual: string
  altura: string
  peso_desejado: string
  dia_nascimento: string
  mes_nascimento: string
  ano_nascimento: string
  horario_treino: string
  alimentacao_atual: string
  refeicoes_dia: string
  rotina_trabalho: string[]
  nivel_disciplina: string
  dificuldade_principal: string[]
  horario_dificil: string
  agua: string
  sono: string
  tentou_dieta: string
  expectativa: string
  prazo_resultado: string
  alergias: string[]
  outras_alergias: string
}

export default function QuizPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const totalSteps = 22
  
  const [quizData, setQuizData] = useState<QuizData>({
    objetivo: '',
    nivel_treino: '',
    frequencia_treino: '',
    peso_atual: '',
    altura: '',
    peso_desejado: '',
    dia_nascimento: '',
    mes_nascimento: '',
    ano_nascimento: '',
    horario_treino: '',
    alimentacao_atual: '',
    refeicoes_dia: '',
    rotina_trabalho: [],
    nivel_disciplina: '',
    dificuldade_principal: [],
    horario_dificil: '',
    agua: '',
    sono: '',
    tentou_dieta: '',
    expectativa: '',
    prazo_resultado: '',
    alergias: [],
    outras_alergias: ''
  })

  // Estado para os pickers
  const [pesoAtual, setPesoAtual] = useState(70)
  const [altura, setAltura] = useState(170)
  const [pesoDesejado, setPesoDesejado] = useState(65)

  const handleMultiSelect = (field: 'rotina_trabalho' | 'dificuldade_principal' | 'alergias', value: string) => {
    setQuizData(prev => {
      const current = prev[field]
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(item => item !== value) }
      } else {
        return { ...prev, [field]: [...current, value] }
      }
    })
  }

  // Validação para permitir avançar
  const canProceed = () => {
    switch (step) {
      case 1: return quizData.objetivo !== ''
      case 2: return quizData.nivel_treino !== ''
      case 3: return quizData.frequencia_treino !== ''
      case 4: return pesoAtual > 0
      case 5: return altura > 0
      case 6: return pesoDesejado > 0
      case 7: return quizData.dia_nascimento !== '' && quizData.mes_nascimento !== '' && quizData.ano_nascimento !== ''
      case 8: return quizData.horario_treino !== ''
      case 9: return quizData.alimentacao_atual !== ''
      case 10: return quizData.refeicoes_dia !== ''
      case 11: return quizData.rotina_trabalho.length > 0
      case 12: return quizData.nivel_disciplina !== ''
      case 13: return quizData.dificuldade_principal.length > 0
      case 14: return quizData.horario_dificil !== ''
      case 15: return quizData.agua !== ''
      case 16: return quizData.sono !== ''
      case 17: return quizData.tentou_dieta !== ''
      case 18: return quizData.expectativa !== ''
      case 19: return quizData.prazo_resultado !== ''
      case 20: return true // Alergias é opcional
      default: return true
    }
  }

  const handleNext = () => {
    if (!canProceed()) {
      return // Não permite avançar se não respondeu
    }

    // Salvar valores dos pickers antes de avançar
    if (step === 4) {
      setQuizData({ ...quizData, peso_atual: `${pesoAtual}` })
    }
    if (step === 5) {
      setQuizData({ ...quizData, altura: `${altura}` })
    }
    if (step === 6) {
      setQuizData({ ...quizData, peso_desejado: `${pesoDesejado}` })
    }

    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      localStorage.setItem('quizData', JSON.stringify(quizData))
      router.push('/quiz-result')
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      router.push('/')
    }
  }

  const progress = (step / totalSteps) * 100

  // Gerar arrays para os pickers
  const gerarArrayPeso = () => Array.from({ length: 171 }, (_, i) => 30 + i) // 30 a 200 kg
  const gerarArrayAltura = () => Array.from({ length: 121 }, (_, i) => 100 + i) // 100 a 220 cm

  const dias = Array.from({ length: 31 }, (_, i) => i + 1)
  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
  const anos = Array.from({ length: 100 }, (_, i) => 2024 - i)

  // Componente Picker Vertical
  const PickerVertical = ({ 
    value, 
    onChange, 
    options, 
    unit 
  }: { 
    value: number | string
    onChange: (val: number | string) => void
    options: (number | string)[]
    unit: string 
  }) => {
    const selectedIndex = options.indexOf(value)
    
    return (
      <div className="flex flex-col items-center">
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Item selecionado com fundo cinza claro */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-12 bg-gray-100 rounded-lg border border-gray-200" />
            
            <div className="flex flex-col items-center">
              {options.map((option, index) => {
                const distance = Math.abs(index - selectedIndex)
                const opacity = distance === 0 ? 1 : distance === 1 ? 0.5 : 0.3
                const scale = distance === 0 ? 1 : 0.8
                const isVisible = distance <= 2
                
                if (!isVisible) return null
                
                return (
                  <button
                    key={index}
                    onClick={() => onChange(option)}
                    className="h-12 flex items-center justify-center transition-all duration-200"
                    style={{
                      opacity,
                      transform: `scale(${scale})`,
                      zIndex: distance === 0 ? 10 : 1
                    }}
                  >
                    <span className={`text-2xl ${distance === 0 ? 'font-bold text-black' : 'font-normal text-gray-400'}`}>
                      {option}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
        <span className="text-sm text-gray-500 mt-2">{unit}</span>
      </div>
    )
  }

  const renderQuestion = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 text-left">
              Qual é seu objetivo principal?
            </h2>
            <div className="space-y-3">
              {['Emagrecer', 'Ganhar massa muscular', 'Manter peso', 'Melhorar hábitos', 'Ter mais energia'].map(option => (
                <button
                  key={option}
                  onClick={() => setQuizData({ ...quizData, objetivo: option })}
                  className={`w-full h-14 px-6 text-left flex items-center justify-between rounded-xl transition-all ${
                    quizData.objetivo === option 
                      ? 'bg-white border-2 border-[#00C974] shadow-sm' 
                      : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-gray-900 font-medium">{option}</span>
                  {quizData.objetivo === option && (
                    <Check className="w-5 h-5 text-[#00C974]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 text-left">
              Qual é o seu nível de treino atual?
            </h2>
            <div className="space-y-3">
              {['Iniciante', 'Intermediário', 'Avançado'].map(option => (
                <button
                  key={option}
                  onClick={() => setQuizData({ ...quizData, nivel_treino: option })}
                  className={`w-full h-14 px-6 text-left flex items-center justify-between rounded-xl transition-all ${
                    quizData.nivel_treino === option 
                      ? 'bg-white border-2 border-[#00C974] shadow-sm' 
                      : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-gray-900 font-medium">{option}</span>
                  {quizData.nivel_treino === option && (
                    <Check className="w-5 h-5 text-[#00C974]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 text-left">
              Quantas vezes você treina na semana?
            </h2>
            <div className="space-y-3">
              {['Não treino', '1–2x por semana', '3–4x por semana', '5–6x por semana', 'Todos os dias'].map(option => (
                <button
                  key={option}
                  onClick={() => setQuizData({ ...quizData, frequencia_treino: option })}
                  className={`w-full h-14 px-6 text-left flex items-center justify-between rounded-xl transition-all ${
                    quizData.frequencia_treino === option 
                      ? 'bg-white border-2 border-[#00C974] shadow-sm' 
                      : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-gray-900 font-medium">{option}</span>
                  {quizData.frequencia_treino === option && (
                    <Check className="w-5 h-5 text-[#00C974]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 text-left">
                Qual é o seu peso atual?
              </h2>
              <p className="text-sm text-gray-500 mt-2 text-left">
                Ajuste usando o seletor abaixo
              </p>
            </div>
            
            <div className="flex justify-center items-center py-8">
              <PickerVertical
                value={pesoAtual}
                onChange={(val) => setPesoAtual(val as number)}
                options={gerarArrayPeso()}
                unit="kg"
              />
            </div>

            <div className="text-center">
              <p className="text-4xl font-bold text-gray-900">
                {pesoAtual} kg
              </p>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 text-left">
                Qual é a sua altura?
              </h2>
              <p className="text-sm text-gray-500 mt-2 text-left">
                Ajuste usando o seletor abaixo
              </p>
            </div>
            
            <div className="flex justify-center items-center py-8">
              <PickerVertical
                value={altura}
                onChange={(val) => setAltura(val as number)}
                options={gerarArrayAltura()}
                unit="cm"
              />
            </div>

            <div className="text-center">
              <p className="text-4xl font-bold text-gray-900">
                {altura} cm
              </p>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 text-left">
                Qual peso você deseja atingir?
              </h2>
              <p className="text-sm text-gray-500 mt-2 text-left">
                Ajuste usando o seletor abaixo
              </p>
            </div>
            
            <div className="flex justify-center items-center py-8">
              <PickerVertical
                value={pesoDesejado}
                onChange={(val) => setPesoDesejado(val as number)}
                options={gerarArrayPeso()}
                unit="kg"
              />
            </div>

            <div className="text-center">
              <p className="text-4xl font-bold text-gray-900">
                {pesoDesejado} kg
              </p>
              {pesoAtual > 0 && (
                <p className="text-sm text-red-500 mt-2">
                  {pesoDesejado < pesoAtual ? '-' : '+'}{Math.abs(pesoDesejado - pesoAtual)} kg
                </p>
              )}
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 text-left">
                Quando você nasceu?
              </h2>
              <p className="text-sm text-gray-500 mt-2 text-left">
                Selecione sua data de nascimento
              </p>
            </div>
            
            <div className="flex justify-center items-center gap-3 py-8">
              <PickerVertical
                value={quizData.dia_nascimento || 1}
                onChange={(val) => setQuizData({ ...quizData, dia_nascimento: String(val) })}
                options={dias}
                unit="Dia"
              />
              
              <PickerVertical
                value={quizData.mes_nascimento || 'Janeiro'}
                onChange={(val) => setQuizData({ ...quizData, mes_nascimento: String(val) })}
                options={meses}
                unit="Mês"
              />
              
              <PickerVertical
                value={quizData.ano_nascimento || 2000}
                onChange={(val) => setQuizData({ ...quizData, ano_nascimento: String(val) })}
                options={anos}
                unit="Ano"
              />
            </div>
          </div>
        )

      case 8:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 text-left">
              Quando você treina?
            </h2>
            <div className="space-y-3">
              {['Manhã', 'Tarde', 'Noite', 'Varia muito', 'Não treino'].map(option => (
                <button
                  key={option}
                  onClick={() => setQuizData({ ...quizData, horario_treino: option })}
                  className={`w-full h-14 px-6 text-left flex items-center justify-between rounded-xl transition-all ${
                    quizData.horario_treino === option 
                      ? 'bg-white border-2 border-[#00C974] shadow-sm' 
                      : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-gray-900 font-medium">{option}</span>
                  {quizData.horario_treino === option && (
                    <Check className="w-5 h-5 text-[#00C974]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )

      case 9:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 text-left">
              Como você se alimenta atualmente?
            </h2>
            <div className="space-y-3">
              {['Muito mal', 'Ruim', 'Mediana', 'Boa', 'Muito boa'].map(option => (
                <button
                  key={option}
                  onClick={() => setQuizData({ ...quizData, alimentacao_atual: option })}
                  className={`w-full h-14 px-6 text-left flex items-center justify-between rounded-xl transition-all ${
                    quizData.alimentacao_atual === option 
                      ? 'bg-white border-2 border-[#00C974] shadow-sm' 
                      : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-gray-900 font-medium">{option}</span>
                  {quizData.alimentacao_atual === option && (
                    <Check className="w-5 h-5 text-[#00C974]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )

      case 10:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 text-left">
              Quantas refeições faz por dia?
            </h2>
            <div className="space-y-3">
              {['2', '3', '4', '5 ou mais'].map(option => (
                <button
                  key={option}
                  onClick={() => setQuizData({ ...quizData, refeicoes_dia: option })}
                  className={`w-full h-14 px-6 text-left flex items-center justify-between rounded-xl transition-all ${
                    quizData.refeicoes_dia === option 
                      ? 'bg-white border-2 border-[#00C974] shadow-sm' 
                      : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-gray-900 font-medium">{option}</span>
                  {quizData.refeicoes_dia === option && (
                    <Check className="w-5 h-5 text-[#00C974]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )

      case 11:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 text-left">
                Como é sua rotina de trabalho/estudo?
              </h2>
              <p className="text-sm text-gray-500 mt-2 text-left">
                Você pode escolher mais de uma opção.
              </p>
            </div>
            <div className="space-y-3">
              {['Sentado o dia todo', 'Em pé o dia todo', 'Muito movimento', 'Trabalha/estuda e não cozinha', 'Rotina corrida', 'Bastante tempo livre'].map(option => (
                <button
                  key={option}
                  onClick={() => handleMultiSelect('rotina_trabalho', option)}
                  className={`w-full h-14 px-6 text-left flex items-center justify-between rounded-xl transition-all ${
                    quizData.rotina_trabalho.includes(option)
                      ? 'bg-white border-2 border-[#00C974] shadow-sm' 
                      : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-gray-900 font-medium">{option}</span>
                  {quizData.rotina_trabalho.includes(option) && (
                    <Check className="w-5 h-5 text-[#00C974]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )

      case 12:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 text-left">
              Nível de disciplina atual
            </h2>
            <div className="space-y-3">
              {['Muito baixa', 'Baixa', 'Média', 'Alta', 'Muito alta'].map(option => (
                <button
                  key={option}
                  onClick={() => setQuizData({ ...quizData, nivel_disciplina: option })}
                  className={`w-full h-14 px-6 text-left flex items-center justify-between rounded-xl transition-all ${
                    quizData.nivel_disciplina === option 
                      ? 'bg-white border-2 border-[#00C974] shadow-sm' 
                      : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-gray-900 font-medium">{option}</span>
                  {quizData.nivel_disciplina === option && (
                    <Check className="w-5 h-5 text-[#00C974]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )

      case 13:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 text-left">
                Dificuldade principal
              </h2>
              <p className="text-sm text-gray-500 mt-2 text-left">
                Você pode escolher mais de uma opção.
              </p>
            </div>
            <div className="space-y-3">
              {['Falta de disciplina', 'Falta de organização', 'Não sei o que comer', 'Esqueço de registrar', 'Falta de tempo'].map(option => (
                <button
                  key={option}
                  onClick={() => handleMultiSelect('dificuldade_principal', option)}
                  className={`w-full h-14 px-6 text-left flex items-center justify-between rounded-xl transition-all ${
                    quizData.dificuldade_principal.includes(option)
                      ? 'bg-white border-2 border-[#00C974] shadow-sm' 
                      : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-gray-900 font-medium">{option}</span>
                  {quizData.dificuldade_principal.includes(option) && (
                    <Check className="w-5 h-5 text-[#00C974]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )

      case 14:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 text-left">
              Qual é o seu horário mais difícil do dia?
            </h2>
            <div className="space-y-3">
              {['Manhã', 'Tarde', 'Noite', 'Madrugada'].map(option => (
                <button
                  key={option}
                  onClick={() => setQuizData({ ...quizData, horario_dificil: option })}
                  className={`w-full h-14 px-6 text-left flex items-center justify-between rounded-xl transition-all ${
                    quizData.horario_dificil === option 
                      ? 'bg-white border-2 border-[#00C974] shadow-sm' 
                      : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-gray-900 font-medium">{option}</span>
                  {quizData.horario_dificil === option && (
                    <Check className="w-5 h-5 text-[#00C974]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )

      case 15:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 text-left">
              Bebe água regularmente?
            </h2>
            <div className="space-y-3">
              {['Quase nada', 'Pouco', 'Moderado', 'Muito', 'Bebo o suficiente'].map(option => (
                <button
                  key={option}
                  onClick={() => setQuizData({ ...quizData, agua: option })}
                  className={`w-full h-14 px-6 text-left flex items-center justify-between rounded-xl transition-all ${
                    quizData.agua === option 
                      ? 'bg-white border-2 border-[#00C974] shadow-sm' 
                      : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-gray-900 font-medium">{option}</span>
                  {quizData.agua === option && (
                    <Check className="w-5 h-5 text-[#00C974]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )

      case 16:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 text-left">
              Como está seu sono?
            </h2>
            <div className="space-y-3">
              {['Muito ruim', 'Ruim', 'Normal', 'Bom', 'Excelente'].map(option => (
                <button
                  key={option}
                  onClick={() => setQuizData({ ...quizData, sono: option })}
                  className={`w-full h-14 px-6 text-left flex items-center justify-between rounded-xl transition-all ${
                    quizData.sono === option 
                      ? 'bg-white border-2 border-[#00C974] shadow-sm' 
                      : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-gray-900 font-medium">{option}</span>
                  {quizData.sono === option && (
                    <Check className="w-5 h-5 text-[#00C974]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )

      case 17:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 text-left">
              Já tentou seguir dieta antes?
            </h2>
            <div className="space-y-3">
              {['Sim, muitas vezes', 'Algumas vezes', 'Poucas vezes', 'Nunca'].map(option => (
                <button
                  key={option}
                  onClick={() => setQuizData({ ...quizData, tentou_dieta: option })}
                  className={`w-full h-14 px-6 text-left flex items-center justify-between rounded-xl transition-all ${
                    quizData.tentou_dieta === option 
                      ? 'bg-white border-2 border-[#00C974] shadow-sm' 
                      : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-gray-900 font-medium">{option}</span>
                  {quizData.tentou_dieta === option && (
                    <Check className="w-5 h-5 text-[#00C974]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )

      case 18:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 text-left">
              O que você espera do app?
            </h2>
            <div className="space-y-3">
              {['Organização', 'Motivação', 'Simplicidade', 'Acompanhamento', 'Tudo acima'].map(option => (
                <button
                  key={option}
                  onClick={() => setQuizData({ ...quizData, expectativa: option })}
                  className={`w-full h-14 px-6 text-left flex items-center justify-between rounded-xl transition-all ${
                    quizData.expectativa === option 
                      ? 'bg-white border-2 border-[#00C974] shadow-sm' 
                      : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-gray-900 font-medium">{option}</span>
                  {quizData.expectativa === option && (
                    <Check className="w-5 h-5 text-[#00C974]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )

      case 19:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 text-left">
              Em quanto tempo quer ver resultados?
            </h2>
            <div className="space-y-3">
              {['2 semanas', '1 mês', '2 meses', '3 meses', 'Sem prazo definido'].map(option => (
                <button
                  key={option}
                  onClick={() => setQuizData({ ...quizData, prazo_resultado: option })}
                  className={`w-full h-14 px-6 text-left flex items-center justify-between rounded-xl transition-all ${
                    quizData.prazo_resultado === option 
                      ? 'bg-white border-2 border-[#00C974] shadow-sm' 
                      : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-gray-900 font-medium">{option}</span>
                  {quizData.prazo_resultado === option && (
                    <Check className="w-5 h-5 text-[#00C974]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )

      case 20:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 text-left">
                Você possui alguma alergia ou intolerância?
              </h2>
              <p className="text-sm text-gray-500 mt-2 text-left">
                Você pode escolher mais de uma opção.
              </p>
            </div>
            <div className="space-y-3">
              {['Glúten', 'Lactose', 'Frutos do mar', 'Ovos', 'Amendoim', 'Corantes/conservantes'].map(option => (
                <button
                  key={option}
                  onClick={() => handleMultiSelect('alergias', option)}
                  className={`w-full h-14 px-6 text-left flex items-center justify-between rounded-xl transition-all ${
                    quizData.alergias.includes(option)
                      ? 'bg-white border-2 border-[#00C974] shadow-sm' 
                      : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-gray-900 font-medium">{option}</span>
                  {quizData.alergias.includes(option) && (
                    <Check className="w-5 h-5 text-[#00C974]" />
                  )}
                </button>
              ))}
            </div>
            <div className="pt-4">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Outras (especifique):
              </label>
              <Input
                type="text"
                placeholder="Digite outras alergias..."
                value={quizData.outras_alergias}
                onChange={(e) => setQuizData({ ...quizData, outras_alergias: e.target.value })}
                className="h-12 border-2"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={handleBack}
              variant="ghost"
              className="p-2"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <span className="text-sm text-gray-600">
              {step} de {totalSteps}
            </span>
          </div>
          {/* Barra de progresso verde #00C974 */}
          <div className="w-full h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#00C974] transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {renderQuestion()}

        <div className="mt-8">
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`w-full h-14 text-lg rounded-full transition-all ${
              canProceed()
                ? 'bg-[#00C974] hover:bg-[#00B368] text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {step === totalSteps ? 'Finalizar' : 'Continuar'}
          </Button>
        </div>
      </div>
    </div>
  )
}
