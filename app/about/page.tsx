'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Construction, ArrowLeft, Github, Heart } from "lucide-react"

export default function About() {
  // Estado para a animação de escrita
  const [text, setText] = useState("")
  const fullText = "Ainda estou a cozinhar" 

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(interval)
      }
    }, 50) 

    return () => clearInterval(interval)
  }, [])

  return (
    // relative: Necessário para o rodapé absoluto se posicionar em relação a este main
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4">
      
      {/* CARD INTERATIVO (Fica perfeitamente centrado) */}
      <div className="group relative flex flex-col items-center gap-6 rounded-2xl border border-white/5 bg-card/30 px-12 py-16 text-center transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_30px_-10px_var(--color-primary)]">
        
        {/* ÍCONE */}
        <div className="rounded-full bg-white/5 p-4 transition-all duration-500 group-hover:bg-primary/20 group-hover:scale-110">
          <Construction className="h-10 w-10 text-muted-foreground transition-colors duration-500 group-hover:text-primary animate-pulse" />
        </div>

        {/* TÍTULO E ANIMAÇÃO */}
        <div className="space-y-2">
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Em Construção
          </h1>
          
          {/* Área do Texto "Typewriter" */}
          <div className="h-6"> 
            <p className="font-mono text-sm text-muted-foreground mx-0">
              {text}
              <span className="animate-blink text-muted-foreground">_</span>
            </p>
          </div>
        </div>

        {/* BOTÃO VOLTAR */}
        <Button 
          variant="ghost" 
          asChild
          className="mt-4 text-muted-foreground hover:text-foreground"
        >
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        </Button>

      </div>

      {/* --- RODAPÉ / CRÉDITOS --- 
          absolute: Remove do fluxo normal
          bottom-4: Cola ao fundo com margem
      */}
      <div className="absolute bottom-4 flex items-center gap-1.5 text-sm text-muted-foreground font-sans opacity-60 transition-opacity hover:opacity-100">
          
          {/* Link do Repositório */}
          <Link 
              href="https://github.com/Louraes202/pei" 
              target="_blank" 
              className="flex items-center gap-1 hover:text-primary transition-colors"
          >
              PortalEI
              <Github className="h-4 w-4" />
          </Link>

          <span>by</span>

          {/* Link do LinkedIn */}
          <Link 
              href="https://www.linkedin.com/in/martim-loureiro-5b3135237/" 
              target="_blank"
              className="font-medium hover:text-primary transition-colors"
          >
              Martim Loureiro
          </Link>

          <span>with</span>

          {/* Coração */}
          <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" />
      </div>

    </main>
  )
}