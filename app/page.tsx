import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center bg-background cursor-default">
      
      {/* BLOCO 1: LOGO E SUBTÍTULO */}
      <div className="mb-3 flex flex-col items-center gap-0">
        {/* Ajusta o width/height conforme o tamanho real do teu SVG */}
        <Image 
          src="/logo-complete.svg" 
          alt="Logo Portal EI" 
          width={180} 
          height={180} 
          priority 
        />
        <p className="text-muted-foreground tracking-wide uppercase text-sm font-medium">
          Portal de Engenharia Informática
        </p>
      </div>

      {/* BLOCO 2: TÍTULO PRINCIPAL */}
      <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-7 max-w-2xl">
        Se és de <span className="hover:text-primary transition-all cursor-default">EI</span>, não vais querer perder.
      </h1>

      {/* BLOCO 3: LISTA DE BENEFÍCIOS */}
      {/* space-y-2: Dá espaçamento vertical entre as linhas */}
      <div className="space-y-3 text-muted-foreground text-lg md:text-lg max-w-3xl mb-7">
        <p>
          <span className="text-foreground font-semibold hover:text-primary transition-all cursor-default">Resumos e exercícios resolvidos</span> de todas as cadeiras,
        </p>
        <p>
          <span className="text-foreground font-semibold hover:text-primary transition-all cursor-default">Exames e frequências</span> filtrados por ano, cadeira ou tópico,
        </p>
        <p>
          <span className="text-foreground font-semibold hover:text-primary transition-all cursor-default">Calendário de avaliações/eventos</span> sincronizado com o telemóvel,
        </p>
        <p className="pt-2">E mais... </p>
        

      </div>

      {/* BLOCO 4: BOTÃO (CTA) */}
      <Button 
        variant="cta" 
        size="lg"
        className="text-lg px-8 py-6 rounded-30 transition-all"
        asChild
      >
        <Link href="/about">
          Quero saber mais
        </Link>
      </Button>

    </main>
  );
}