import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          created_at: string
          peso_atual: number | null
          peso_inicial: number | null
          peso_desejado: number | null
          altura: number | null
          objetivo: string | null
          sexo: string | null
          nivel_treino: string | null
          frequencia_semanal: string | null
        }
        Insert: {
          id?: string
          email: string
          name: string
          created_at?: string
          peso_atual?: number | null
          peso_inicial?: number | null
          peso_desejado?: number | null
          altura?: number | null
          objetivo?: string | null
          sexo?: string | null
          nivel_treino?: string | null
          frequencia_semanal?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string
          created_at?: string
          peso_atual?: number | null
          peso_inicial?: number | null
          peso_desejado?: number | null
          altura?: number | null
          objetivo?: string | null
          sexo?: string | null
          nivel_treino?: string | null
          frequencia_semanal?: string | null
        }
      }
      quiz_responses: {
        Row: {
          id: string
          user_id: string
          objetivo: string
          nivel_treino: string
          frequencia_treino: string
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
          peso_atual: number
          altura: number
          peso_desejado: number
          alergias: string[]
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          objetivo: string
          nivel_treino: string
          frequencia_treino: string
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
          peso_atual: number
          altura: number
          peso_desejado: number
          alergias: string[]
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          objetivo?: string
          nivel_treino?: string
          frequencia_treino?: string
          horario_treino?: string
          alimentacao_atual?: string
          refeicoes_dia?: string
          rotina_trabalho?: string[]
          nivel_disciplina?: string
          dificuldade_principal?: string[]
          horario_dificil?: string
          agua?: string
          sono?: string
          tentou_dieta?: string
          expectativa?: string
          prazo_resultado?: string
          peso_atual?: number
          altura?: number
          peso_desejado?: number
          alergias?: string[]
          created_at?: string
        }
      }
      preferences: {
        Row: {
          id: string
          user_id: string
          alergias: string[]
          outras_alergias: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          alergias: string[]
          outras_alergias?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          alergias?: string[]
          outras_alergias?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
