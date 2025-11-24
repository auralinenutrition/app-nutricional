"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  Leaf, 
  ArrowRight, 
  Check, 
  ChevronLeft,
  Home,
  TrendingUp,
  Camera,
  Bell,
  Settings,
  Plus,
  Crown,
  Sparkles,
  Droplet,
  Coffee,
  Sun,
  Moon,
  Apple
} from "lucide-react";

// Types
type Screen = 
  | "welcome"
  | "quiz"
  | "quiz-result"
  | "signup"
  | "login"
  | "plans"
  | "dashboard"
  | "photos"
  | "progress"
  | "reminders"
  | "settings";

interface QuizAnswers {
  objetivo?: string;
  nivel?: string;
  treino?: string;
  horarioTreino?: string;
  alimentacao?: string;
  refeicoes?: string;
  rotina?: string[];
  disciplina?: string;
  dificuldades?: string[];
  horarioDificil?: string;
  agua?: string;
  sono?: string;
  dietaAnterior?: string;
  expectativa?: string;
  prazo?: string;
}

interface User {
  name: string;
  email: string;
  plan: "free" | "premium" | "lifetime";
}

const quizQuestions = [
  {
    id: 1,
    question: "Qual é seu objetivo principal?",
    options: ["Emagrecer", "Ganhar massa muscular", "Manter peso", "Melhorar hábitos", "Ter mais energia"],
    key: "objetivo"
  },
  {
    id: 2,
    question: "Qual seu nível atual?",
    options: ["Iniciante", "Intermediário", "Avançado"],
    key: "nivel"
  },
  {
    id: 3,
    question: "Como você treina?",
    options: ["Não treino", "1–2x por semana", "3–4x por semana", "5–6x por semana", "Todos os dias"],
    key: "treino"
  },
  {
    id: 4,
    question: "Quando você treina?",
    options: ["Manhã", "Tarde", "Noite", "Varia muito", "Não treino"],
    key: "horarioTreino"
  },
  {
    id: 5,
    question: "Como você se alimenta atualmente?",
    options: ["Muito mal", "Ruim", "Mediana", "Boa", "Muito boa"],
    key: "alimentacao"
  },
  {
    id: 6,
    question: "Quantas refeições faz por dia?",
    options: ["2", "3", "4", "5 ou mais"],
    key: "refeicoes"
  },
  {
    id: 7,
    question: "Como é sua rotina de trabalho/estudo?",
    options: ["Sentado o dia todo", "Em pé o dia todo", "Muito movimento", "Trabalha/estuda e não cozinha", "Rotina corrida", "Bastante tempo livre"],
    key: "rotina",
    multiple: true
  },
  {
    id: 8,
    question: "Nível de disciplina atual",
    options: ["Muito baixa", "Baixa", "Média", "Alta", "Muito alta"],
    key: "disciplina"
  },
  {
    id: 9,
    question: "Dificuldade principal",
    options: ["Falta de disciplina", "Falta de organização", "Não sei o que comer", "Esqueço de registrar", "Falta de tempo"],
    key: "dificuldades",
    multiple: true
  },
  {
    id: 10,
    question: "Qual é o seu horário mais difícil do dia?",
    options: ["Manhã", "Tarde", "Noite", "Madrugada"],
    key: "horarioDificil"
  },
  {
    id: 11,
    question: "Bebe água regularmente?",
    options: ["Quase nada", "Pouco", "Moderado", "Muito", "Bebo o suficiente"],
    key: "agua"
  },
  {
    id: 12,
    question: "Como está seu sono?",
    options: ["Muito ruim", "Ruim", "Normal", "Bom", "Excelente"],
    key: "sono"
  },
  {
    id: 13,
    question: "Já tentou seguir dieta antes?",
    options: ["Sim, muitas vezes", "Algumas vezes", "Poucas vezes", "Nunca"],
    key: "dietaAnterior"
  },
  {
    id: 14,
    question: "O que você espera do app?",
    options: ["Organização", "Motivação", "Simplicidade", "Acompanhamento", "Tudo acima"],
    key: "expectativa"
  },
  {
    id: 15,
    question: "Em quanto tempo quer ver resultados?",
    options: ["2 semanas", "1 mês", "2 meses", "3 meses", "Sem prazo definido"],
    key: "prazo"
  }
];

export default function AuralineNutrition() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome");
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({});
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  // Quiz handlers
  const handleQuizAnswer = (key: string, value: string, multiple?: boolean) => {
    if (multiple) {
      const current = (quizAnswers[key as keyof QuizAnswers] as string[]) || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      setQuizAnswers({ ...quizAnswers, [key]: updated });
    } else {
      setQuizAnswers({ ...quizAnswers, [key]: value });
    }
  };

  const nextQuizStep = () => {
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      setCurrentScreen("quiz-result");
    }
  };

  const prevQuizStep = () => {
    if (quizStep > 0) {
      setQuizStep(quizStep - 1);
    }
  };

  // Auth handlers
  const handleSignup = () => {
    setUser({ name: formData.name, email: formData.email, plan: "free" });
    setCurrentScreen("plans");
  };

  const handleLogin = () => {
    setUser({ name: "Usuário", email: formData.email, plan: "premium" });
    setCurrentScreen("dashboard");
  };

  const selectPlan = (plan: "free" | "premium" | "lifetime") => {
    if (user) {
      setUser({ ...user, plan });
      setCurrentScreen("dashboard");
    }
  };

  // Welcome Screen
  if (currentScreen === "welcome") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-[#00C974] rounded-full flex items-center justify-center">
                <Leaf className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Auraline Nutrition</h1>
            <p className="text-gray-600">Sua jornada para uma vida mais saudável começa aqui</p>
          </div>

          <div className="space-y-4 pt-8">
            <Button
              onClick={() => setCurrentScreen("quiz")}
              className="w-full h-14 bg-[#00C974] hover:bg-[#00b368] text-white rounded-full text-lg font-medium transition-all duration-300 hover:scale-105"
            >
              Vamos começar
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            <Button
              onClick={() => setCurrentScreen("login")}
              variant="outline"
              className="w-full h-14 border-2 border-[#00C974] text-[#00C974] hover:bg-[#00C974]/5 rounded-full text-lg font-medium transition-all duration-300"
            >
              Já possuo cadastro
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Screen
  if (currentScreen === "quiz") {
    const currentQuestion = quizQuestions[quizStep];
    const progress = ((quizStep + 1) / quizQuestions.length) * 100;
    const currentAnswer = quizAnswers[currentQuestion.key as keyof QuizAnswers];

    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevQuizStep}
              disabled={quizStep === 0}
              className="rounded-full"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <span className="text-sm font-medium text-gray-600">
              {quizStep + 1} de {quizQuestions.length}
            </span>
          </div>

          {/* Progress */}
          <Progress value={progress} className="h-2" />

          {/* Question */}
          <div className="pt-8 space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
              {currentQuestion.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                const isSelected = currentQuestion.multiple
                  ? (currentAnswer as string[] || []).includes(option)
                  : currentAnswer === option;

                return (
                  <button
                    key={option}
                    onClick={() => handleQuizAnswer(currentQuestion.key, option, currentQuestion.multiple)}
                    className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                      isSelected
                        ? "border-[#00C974] bg-[#00C974]/5"
                        : "border-gray-200 hover:border-[#00C974]/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{option}</span>
                      {isSelected && (
                        <div className="w-6 h-6 bg-[#00C974] rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <Button
              onClick={nextQuizStep}
              disabled={!currentAnswer || (currentQuestion.multiple && (currentAnswer as string[]).length === 0)}
              className="w-full h-14 bg-[#00C974] hover:bg-[#00b368] text-white rounded-full text-lg font-medium transition-all duration-300 disabled:opacity-50"
            >
              {quizStep === quizQuestions.length - 1 ? "Finalizar" : "Próxima"}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Result Screen
  if (currentScreen === "quiz-result") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-[#00C974] rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Seu plano inicial está pronto!
            </h1>
            <p className="text-gray-600 text-lg">
              Com base nas suas respostas, montamos recomendações ideais para você.
            </p>
          </div>

          <Card className="p-6 md:p-8 space-y-6 border-2 border-[#00C974]/20">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#00C974]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-[#00C974]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Objetivo</p>
                  <p className="text-gray-600">{quizAnswers.objetivo}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#00C974]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Apple className="w-5 h-5 text-[#00C974]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Refeições recomendadas</p>
                  <p className="text-gray-600">{quizAnswers.refeicoes} refeições por dia</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#00C974]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sun className="w-5 h-5 text-[#00C974]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Horário de treino</p>
                  <p className="text-gray-600">{quizAnswers.horarioTreino}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#00C974]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-[#00C974]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Dificuldade principal</p>
                  <p className="text-gray-600">
                    {Array.isArray(quizAnswers.dificuldades) 
                      ? quizAnswers.dificuldades.join(", ")
                      : "Não informado"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#00C974]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-[#00C974]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Recomendação de rotina ideal</p>
                  <p className="text-gray-600">
                    Rotina {quizAnswers.nivel?.toLowerCase()} com foco em {quizAnswers.objetivo?.toLowerCase()}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Button
            onClick={() => setCurrentScreen("signup")}
            className="w-full h-14 bg-[#00C974] hover:bg-[#00b368] text-white rounded-full text-lg font-medium transition-all duration-300"
          >
            Criar minha conta para continuar
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  }

  // Signup Screen
  if (currentScreen === "signup") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Criar conta</h1>
            <p className="text-gray-600">Preencha seus dados para continuar</p>
          </div>

          <Card className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-12"
                />
              </div>
            </div>

            <Button
              onClick={handleSignup}
              disabled={!formData.name || !formData.email || !formData.password}
              className="w-full h-12 bg-[#00C974] hover:bg-[#00b368] text-white rounded-full font-medium transition-all duration-300"
            >
              Finalizar cadastro
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Login Screen
  if (currentScreen === "login") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-[#00C974] rounded-full flex items-center justify-center">
                <Leaf className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Bem-vindo de volta</h1>
            <p className="text-gray-600">Entre com sua conta</p>
          </div>

          <Card className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">E-mail</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Senha</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-12"
                />
              </div>

              <button className="text-sm text-[#00C974] hover:underline">
                Esqueci minha senha
              </button>
            </div>

            <Button
              onClick={handleLogin}
              disabled={!formData.email || !formData.password}
              className="w-full h-12 bg-[#00C974] hover:bg-[#00b368] text-white rounded-full font-medium transition-all duration-300"
            >
              Entrar
            </Button>
          </Card>

          <div className="text-center">
            <button
              onClick={() => setCurrentScreen("welcome")}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Voltar ao início
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Plans Screen
  if (currentScreen === "plans") {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-6xl mx-auto space-y-8 py-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Escolha seu plano</h1>
            <p className="text-gray-600">Selecione o plano ideal para sua jornada</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Free Plan */}
            <Card className="p-6 space-y-6 border-2 border-[#00C974] hover:shadow-xl transition-all duration-300">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">Gratuito</h3>
                <div className="text-3xl font-bold text-[#00C974]">R$ 0</div>
                
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#00C974] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">Registrar até 2 refeições</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#00C974] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">1 rotina básica</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#00C974] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">Gráfico simples</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#00C974] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">1 lembrete diário</span>
                  </li>
                </ul>
              </div>

              <Button
                onClick={() => selectPlan("free")}
                variant="outline"
                className="w-full h-12 border-2 border-[#00C974] text-[#00C974] hover:bg-[#00C974]/5 rounded-full font-medium"
              >
                Continuar grátis
              </Button>
            </Card>

            {/* Premium Plan */}
            <Card className="p-6 space-y-6 border-2 border-[#00C974] bg-[#00C974]/5 hover:shadow-xl transition-all duration-300 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00C974] text-white px-4 py-1 rounded-full text-sm font-medium">
                Mais usado
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">Premium</h3>
                <div>
                  <div className="text-3xl font-bold text-[#00C974]">R$ 14,90</div>
                  <div className="text-sm text-gray-600">por mês ou R$ 99/ano</div>
                </div>
                
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#00C974] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">Refeições ilimitadas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#00C974] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">Todas as rotinas completas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#00C974] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">Fotos ilimitadas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#00C974] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">Gráficos avançados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#00C974] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">Lembretes ilimitados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#00C974] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">Resumo semanal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#00C974] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">Badges e motivação inteligente</span>
                  </li>
                </ul>
              </div>

              <Button
                onClick={() => selectPlan("premium")}
                className="w-full h-12 bg-[#00C974] hover:bg-[#00b368] text-white rounded-full font-medium"
              >
                Assinar Premium
              </Button>
            </Card>

            {/* Lifetime Plan */}
            <Card className="p-6 space-y-6 border-2 border-amber-500 hover:shadow-xl transition-all duration-300 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Crown className="w-4 h-4" />
                VIP
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">Vitalício</h3>
                <div>
                  <div className="text-3xl font-bold text-amber-600">R$ 99</div>
                  <div className="text-sm text-gray-600">pagamento único</div>
                </div>
                
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">Tudo do Premium</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">Acesso vitalício</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">Temas exclusivos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">Diário pessoal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">Rotinas avançadas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">Receitas exclusivas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">Badge VIP</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">Acesso antecipado a novas funções</span>
                  </li>
                </ul>
              </div>

              <Button
                onClick={() => selectPlan("lifetime")}
                className="w-full h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-full font-medium"
              >
                Acessar Vitalício
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Screen
  if (currentScreen === "dashboard") {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#00C974] rounded-full flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Auraline Nutrition</h1>
                  <p className="text-sm text-gray-600">Olá, {user?.name || "Usuário"}!</p>
                </div>
              </div>
              {user?.plan === "lifetime" && (
                <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  <Crown className="w-4 h-4" />
                  VIP
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Resumo do dia */}
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Resumo do dia</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#00C974]/5 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Consistência</p>
                <p className="text-2xl font-bold text-[#00C974]">85%</p>
              </div>
              <div className="p-4 bg-[#00C974]/5 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Refeições registradas</p>
                <p className="text-2xl font-bold text-[#00C974]">3/4</p>
              </div>
            </div>
            <Button className="w-full h-12 bg-[#00C974] hover:bg-[#00b368] text-white rounded-full">
              <Plus className="w-5 h-5 mr-2" />
              Registrar refeição
            </Button>
          </Card>

          {/* Rotina de hoje */}
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Rotina de hoje</h2>
            <div className="space-y-3">
              {[
                { icon: Coffee, label: "Café da manhã", time: "07:00", done: true },
                { icon: Sun, label: "Almoço", time: "12:00", done: true },
                { icon: Moon, label: "Jantar", time: "19:00", done: false },
                { icon: Apple, label: "Lanches", time: "15:00", done: true },
                { icon: Droplet, label: "Água (2L)", time: "Todo dia", done: false }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    item.done ? "bg-[#00C974]" : "bg-gray-200"
                  }`}>
                    <item.icon className={`w-5 h-5 ${item.done ? "text-white" : "text-gray-400"}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-600">{item.time}</p>
                  </div>
                  {item.done && <Check className="w-5 h-5 text-[#00C974]" />}
                </div>
              ))}
            </div>
          </Card>

          {/* Atalhos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { icon: Home, label: "Rotinas", screen: "dashboard" as Screen },
              { icon: TrendingUp, label: "Progresso", screen: "progress" as Screen },
              { icon: Camera, label: "Fotos", screen: "photos" as Screen },
              { icon: Bell, label: "Lembretes", screen: "reminders" as Screen },
              { icon: Settings, label: "Configurações", screen: "settings" as Screen }
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => setCurrentScreen(item.screen)}
                className="p-6 bg-white rounded-2xl border-2 border-gray-100 hover:border-[#00C974] transition-all duration-300 hover:shadow-lg"
              >
                <item.icon className="w-8 h-8 text-[#00C974] mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Photos Screen
  if (currentScreen === "photos") {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentScreen("dashboard")}
              className="rounded-full"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Fotos de Evolução</h1>
          </div>

          {/* Carrossel de fotos */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-[3/4] bg-gray-100 rounded-2xl flex items-center justify-center">
                  <Camera className="w-12 h-12 text-gray-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Botão adicionar */}
          <Button className="w-full h-14 bg-[#00C974] hover:bg-[#00b368] text-white rounded-full text-lg">
            <Plus className="w-6 h-6 mr-2" />
            Adicionar foto
          </Button>

          {/* Instruções com manequim */}
          <Card className="p-6 space-y-4 bg-[#00C974]/5 border-[#00C974]/20">
            <h3 className="font-bold text-gray-900">Como tirar suas fotos</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center space-y-2">
                <div className="aspect-[3/4] bg-white rounded-xl flex items-center justify-center border-2 border-[#00C974]">
                  <div className="w-16 h-32 bg-[#00C974]/20 rounded-full relative">
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#00C974]/40 rounded-full" />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900">Frente</p>
              </div>
              <div className="text-center space-y-2">
                <div className="aspect-[3/4] bg-white rounded-xl flex items-center justify-center border-2 border-[#00C974]">
                  <div className="w-8 h-32 bg-[#00C974]/20 rounded-full relative">
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#00C974]/40 rounded-full" />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900">Lado</p>
              </div>
              <div className="text-center space-y-2">
                <div className="aspect-[3/4] bg-white rounded-xl flex items-center justify-center border-2 border-[#00C974]">
                  <div className="w-16 h-32 bg-[#00C974]/20 rounded-full relative">
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#00C974]/40 rounded-full" />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900">Costas</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Progress Screen
  if (currentScreen === "progress") {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentScreen("dashboard")}
              className="rounded-full"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Progresso</h1>
          </div>

          <div className="space-y-6">
            {/* Peso */}
            <Card className="p-6 space-y-4">
              <h3 className="font-bold text-gray-900">Peso</h3>
              <div className="h-48 bg-gray-50 rounded-xl flex items-center justify-center">
                <p className="text-gray-400">Gráfico de peso</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Atual</p>
                  <p className="text-2xl font-bold text-[#00C974]">75 kg</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Meta</p>
                  <p className="text-2xl font-bold text-gray-900">70 kg</p>
                </div>
              </div>
            </Card>

            {/* Medidas */}
            <Card className="p-6 space-y-4">
              <h3 className="font-bold text-gray-900">Medidas</h3>
              <div className="space-y-3">
                {[
                  { label: "Cintura", value: "80 cm" },
                  { label: "Quadril", value: "95 cm" },
                  { label: "Braço", value: "32 cm" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="font-medium text-gray-900">{item.label}</span>
                    <span className="text-[#00C974] font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Consistência */}
            <Card className="p-6 space-y-4">
              <h3 className="font-bold text-gray-900">Consistência</h3>
              <div className="h-48 bg-gray-50 rounded-xl flex items-center justify-center">
                <p className="text-gray-400">Gráfico de consistência</p>
              </div>
            </Card>

            <Button className="w-full h-12 bg-[#00C974] hover:bg-[#00b368] text-white rounded-full">
              <Plus className="w-5 h-5 mr-2" />
              Registrar peso ou medida
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Reminders Screen
  if (currentScreen === "reminders") {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentScreen("dashboard")}
              className="rounded-full"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Lembretes</h1>
          </div>

          <div className="space-y-4">
            {[
              { icon: Droplet, label: "Beber água", time: "A cada 2 horas", active: true },
              { icon: Apple, label: "Registrar refeição", time: "12:00, 19:00", active: true },
              { icon: Camera, label: "Foto semanal", time: "Domingo 08:00", active: false },
              { icon: TrendingUp, label: "Pesagem", time: "Segunda 07:00", active: true },
              { icon: TrendingUp, label: "Medidas", time: "1º dia do mês", active: false }
            ].map((item, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    item.active ? "bg-[#00C974]/10" : "bg-gray-100"
                  }`}>
                    <item.icon className={`w-6 h-6 ${item.active ? "text-[#00C974]" : "text-gray-400"}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-600">{item.time}</p>
                  </div>
                  <button className={`w-12 h-6 rounded-full transition-colors ${
                    item.active ? "bg-[#00C974]" : "bg-gray-200"
                  }`}>
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      item.active ? "translate-x-6" : "translate-x-0.5"
                    }`} />
                  </button>
                </div>
              </Card>
            ))}
          </div>

          <Button className="w-full h-12 bg-[#00C974] hover:bg-[#00b368] text-white rounded-full">
            <Plus className="w-5 h-5 mr-2" />
            Criar novo lembrete
          </Button>
        </div>
      </div>
    );
  }

  // Settings Screen
  if (currentScreen === "settings") {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentScreen("dashboard")}
              className="rounded-full"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          </div>

          <div className="space-y-2">
            {[
              { label: "Editar dados", action: () => {} },
              { label: "Notificações", action: () => {} },
              { label: "Tipo de plano", action: () => setCurrentScreen("plans") },
              { label: "Termos de uso", action: () => {} },
              { label: "Política de privacidade", action: () => {} },
              { label: "Sair", action: () => setCurrentScreen("welcome"), danger: true }
            ].map((item, i) => (
              <button
                key={i}
                onClick={item.action}
                className={`w-full p-4 text-left rounded-xl border-2 border-gray-100 hover:border-[#00C974] transition-all ${
                  item.danger ? "text-red-600 hover:border-red-600" : "text-gray-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
