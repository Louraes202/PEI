'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StarBackground } from "@/components/star-background";
import { motion } from "framer-motion";

// Configuração das animações (Framer Motion)
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

export default function Home() {
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    // Verifica se o utilizador já visitou a página nesta sessão
    const hasVisited = sessionStorage.getItem("hasVisitedHome");

    if (hasVisited) {
      setShouldAnimate(false); // Evita repetir a animação de entrada
    } else {
      sessionStorage.setItem("hasVisitedHome", "true");
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center bg-background cursor-default overflow-hidden relative">
      
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <StarBackground resistance={300} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-background)_0%,transparent_50%)] opacity-90 pointer-events-none" />
      </div>

      {/* Conteúdo Principal */}
      <motion.div 
        className="relative z-10 flex flex-col items-center w-full"
        // Define o estado inicial com base na visita (evita flash de animação se já visitou)
        initial={shouldAnimate ? "hidden" : "visible"}
        animate="visible"
        variants={staggerContainer}
      >
        
        {/* BLOCO 1: LOGO */}
        <motion.div 
          className="mb-3 flex flex-col items-center gap-0"
          variants={fadeInUp}
        >
          <div className="relative drop-shadow-2xl">
            <Image
              src="/logo-complete.svg"
              alt="Logo Portal EI"
              width={180}
              height={180}
              priority
              className=""
            />
          </div>
          <p className="text-muted-foreground tracking-wide uppercase text-sm font-medium mt-2">
            Portal de Engenharia Informática
          </p>
        </motion.div>

        {/* BLOCO 2: TÍTULO */}
        <motion.h1 
          className="font-heading text-2xl md:text-2xl font-bold text-foreground mb-7 max-w-2xl"
          variants={fadeInUp}
        >
          <span className="hover:text-primary transition-all cursor-default">
            Se és de EI
          </span>
          , não vais querer perder.
        </motion.h1>

        {/* BLOCO 3: BENEFÍCIOS */}
        <motion.div 
          className="space-y-3 text-muted-foreground text-lg md:text-lg max-w-3xl mb-7"
          variants={fadeInUp}
        >
          <p>
            <span className="text-foreground font-semibold hover:text-primary transition-all cursor-default">
              Resumos e exercícios resolvidos
            </span>{" "}
            de todas as cadeiras,
          </p>
          <p>
            <span className="text-foreground font-semibold hover:text-primary transition-all cursor-default">
              Exames e frequências
            </span>{" "}
            filtrados por ano, cadeira ou tópico,
          </p>
          <p>
            <span className="text-foreground font-semibold hover:text-primary transition-all cursor-default">
              Calendário de avaliações/eventos
            </span>{" "}
            sincronizado com o telemóvel,
          </p>
          
          <p className="pt-2 flex items-center justify-center gap-1">
            E mais... 
          </p>
        </motion.div>

        {/* BLOCO 4: BOTÃO */}
        <motion.div variants={fadeInUp}>
          <Button
            variant="cta"
            size="lg"
            className="text-lg px-8 py-6 rounded-20 transition-all shadow-lg hover:shadow-primary/25"
            asChild
          >
            <Link href="/about">Quero saber mais</Link>
          </Button>
        </motion.div>

      </motion.div>
    </main>
  );
}