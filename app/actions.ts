'use server'

import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

// Schema de validação para o email
const schema = z.object({
  email: z.string().email({ message: "Por favor insere um email válido." }),
})

export async function subscribeToWaitingList(formData: FormData) {
  const email = formData.get('email')

  // Validação dos dados
  const result = schema.safeParse({ email })

  if (!result.success) {
    return { success: false, message: result.error.issues[0].message }
  }

  // Conexão ao Supabase (Server-side)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY! 
  )

  const { error } = await supabase
    .from('waiting_list')
    .insert({ email: result.data.email })

  if (error) {
    // Código 23505: Unique Violation (Email duplicado na BD)
    if (error.code === '23505') {
      return { success: false, message: "Este email já está na lista de espera!" }
    }
    
    console.error("Erro Supabase:", error)
    return { success: false, message: "Algo não correu bem. Tenta novamente mais tarde." }
  }

  return { success: true, message: "Foste inscrito! Serás avisado quando lançarmos o portal." }
}

// Schema para sugestões com campo Honeypot (Anti-Spam)
const suggestionSchema = z.object({
  suggestion: z.string().min(5, { message: "A sugestão é muito curta." }).max(500, { message: "A sugestão é muito longa." }),
  honeypot: z.string().optional(),
})

export async function submitSuggestion(formData: FormData) {
  const suggestion = formData.get('suggestion')
  // 'confirm_field' é um campo escondido no frontend para enganar bots
  const honeypot = formData.get('confirm_field') 

  // Verificação Anti-Spam (Honeypot)
  // Se o campo escondido vier preenchido, simulamos sucesso para não alertar o bot
  if (honeypot && honeypot.toString().length > 0) {
    return { success: true, message: "Obrigado pela sugestão!" }
  }

  const result = suggestionSchema.safeParse({ suggestion, honeypot })

  if (!result.success) {
    return { success: false, message: result.error.issues[0].message }
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
  )

  const { error } = await supabase
    .from('suggestions')
    .insert({ content: result.data.suggestion })

  if (error) {
    console.error("Erro Sugestão:", error)
    return { success: false, message: "Erro ao enviar. Tenta mais tarde." }
  }

  return { success: true, message: "Recebido! Obrigado pelo feedback. 🤘" }
}