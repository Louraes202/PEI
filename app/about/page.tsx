"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { subscribeToWaitingList, submitSuggestion } from "../actions";
import { StarBackground } from "@/components/star-background";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Library,
  CalendarDays,
  Users,
  Book,
  Briefcase,
  ChevronRight,
  Github,
  Heart,
  MapPin,
  CheckCircle2,
  Loader2,
  LucideIcon,
} from "lucide-react";

// Componente SVG local para o logótipo do Discord
const DiscordLogo = ({ className }: { className?: string }) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    className={className}
  >
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
  </svg>
);

// Configuração do cliente Supabase para fetch de dados públicos
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Mapeamento de chaves de texto da BD para componentes Lucide
const iconMap: Record<string, LucideIcon> = {
  repo: Library,
  calendar: CalendarDays,
  guides: Book,
  briefcase: Briefcase,
  forum: Users,
  default: Library,
};

interface Feature {
  id: string;
  title: string;
  description: string;
  long_description: string;
  icon_key: string;
  status: string;
  col_span: number;
  benefits: string[];
}

export default function AboutPage() {
  const [email, setEmail] = useState("");
  const [suggestion, setSuggestion] = useState("");

  const [isWaitingListPending, startWaitingListTransition] = useTransition();
  const [isSuggestionPending, startSuggestionTransition] = useTransition();

  const [features, setFeatures] = useState<Feature[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentYear = new Date().getFullYear();

  // Fetch das features da base de dados ao carregar
  useEffect(() => {
    async function fetchFeatures() {
      try {
        const { data, error } = await supabase
          .from("features")
          .select("*")
          .order("order", { ascending: true });

        if (error) throw error;
        if (data) setFeatures(data);
      } catch (error) {
        console.error("Erro ao carregar features:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchFeatures();
  }, []);

  // Handler de submissão da Waiting List
  async function handleWaitingListSubmit(formData: FormData) {
    startWaitingListTransition(async () => {
      const result = await subscribeToWaitingList(formData);
      if (result.success) {
        toast.success(result.message);
        const form = document.getElementById(
          "waiting-list-form"
        ) as HTMLFormElement;
        form?.reset();
        setEmail("");
      } else {
        toast.error(result.message);
      }
    });
  }

  // Handler de submissão de Sugestões
  async function handleSuggestionSubmit(formData: FormData) {
    startSuggestionTransition(async () => {
      const result = await submitSuggestion(formData);
      if (result.success) {
        toast.success(result.message);
        const form = document.getElementById(
          "suggestion-form"
        ) as HTMLFormElement;
        form?.reset();
        setSuggestion("");
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <main className="relative min-h-screen bg-background overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      
      {/* Background: Estrelas com movimento lento (resistência alta) */}
      <div className="fixed inset-0 z-0">
        <StarBackground resistance={450} starCount={15} />
        <div className="absolute inset-0 bg-background/70 backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-10 md:py-20 flex flex-col items-center">
        
        {/* 1. HEADER / NAVEGAÇÃO */}
        <div className="w-full flex justify-between items-center mb-12 md:mb-20 animate-fade-in">
          <Button
            variant="ghost"
            asChild
            className="text-muted-foreground hover:text-foreground -ml-4"
          >
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Voltar à Home</span>
              <span className="sm:hidden">Voltar</span>
            </Link>
          </Button>

          <Link 
            href="https://www.di.estgv.ipv.pt/dep/di/web/?pagina=-EI-" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Badge 
              variant="outline" 
              className="border-primary/20 text-primary bg-primary/5 px-3 py-1 flex gap-1.5 items-center cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-colors"
            >
              <MapPin className="h-3 w-3" />
              LEI @ ESTGV
            </Badge>
          </Link>
        </div>

        {/* 2. HERO SECTION: Manifesto */}
        <div className="text-center max-w-4xl mb-16 md:mb-24 space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-heading text-3xl sm:text-4xl md:text-6xl font-bold text-foreground leading-tight"
          >
            O espaço dos Alunos de <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
              Engenharia Informática
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-2xl mx-auto space-y-6"
          >
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed px-4">
              O <span className="text-foreground font-medium">Portal EI</span> é
              uma iniciativa independente criada para ajudar os alunos de
              Engenharia Informática da ESTGV. Combatemos a dispersão da
              informação e juntamos todos os recursos e ferramentas num só
              lugar.
            </p>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="link"
                  className="text-primary hover:text-primary/80 p-0 h-auto font-medium"
                >
                  Ler o nosso manifesto &rarr;
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-zinc-950/95 border-white/10 sm:max-w-lg backdrop-blur-xl">
                <DialogHeader>
                  <DialogTitle className="font-heading text-2xl mb-4">
                    A Nossa Missão
                  </DialogTitle>
                  <DialogDescription
                    className="text-base space-y-4 text-left text-muted-foreground"
                    asChild
                  >
                    <div>
                      <p>
                        Engenharia Informática é um desafio. Mas encontrar o
                        material de estudo ou as ferramentas ideais não deve ser.
                      </p>
                      <p>
                        A falta de recursos de organização e a dispersão de
                        apontamentos criam obstáculos desnecessários no nosso
                        percurso.
                      </p>
                      <p>
                        <strong className="text-foreground">
                          O Portal EI nasce para mudar isto.
                        </strong>{" "}
                        Queremos criar uma plataforma que centralize tudo o que
                        precisas: desde material de estudo essencial até
                        ferramentas que automatizam processos e facilitam o teu
                        dia a dia no curso.
                      </p>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>

        {/* 3. FUNCIONALIDADES (Separador e Grelha) */}
        <div className="w-full max-w-5xl mb-10 flex items-center gap-4 opacity-60">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            Funcionalidades Principais
          </span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`${
                  i === 1 || i === 4 ? "md:col-span-2" : "md:col-span-1"
                } h-64 rounded-xl border border-white/5 bg-white/5 animate-pulse`}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl mb-8">
            {features.map((feature, index) => {
              const IconComponent =
                iconMap[feature.icon_key] || iconMap["default"];

              return (
                <Dialog key={feature.id}>
                  <DialogTrigger asChild>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className={`md:col-span-${feature.col_span} cursor-pointer group`}
                    >
                      <Card className="h-full border-white/5 bg-card/40 backdrop-blur-sm hover:bg-card/60 hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(var(--primary),0.15)] flex flex-col justify-between">
                        <CardHeader>
                          <div className="flex justify-between items-start mb-4">
                            <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                              <IconComponent className="h-6 w-6" />
                            </div>
                          </div>
                          <div>
                            <CardTitle className="font-heading text-xl text-foreground group-hover:text-primary transition-colors mb-2">
                              {feature.title}
                            </CardTitle>
                            <CardDescription className="text-sm md:text-base line-clamp-2">
                              {feature.description}
                            </CardDescription>
                          </div>
                        </CardHeader>
                        <CardContent className="flex justify-end pt-0 pb-6 pr-6">
                          <ChevronRight className="h-5 w-5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </CardContent>
                      </Card>
                    </motion.div>
                  </DialogTrigger>

                  {/* Modal de Detalhe da Feature */}
                  <DialogContent className="bg-zinc-950/95 border-white/10 w-[90%] sm:max-w-lg rounded-2xl backdrop-blur-xl">
                    <DialogHeader>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-primary/20 text-primary">
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <DialogTitle className="font-heading text-xl md:text-2xl text-left">
                          {feature.title}
                        </DialogTitle>
                      </div>
                      <DialogDescription className="text-sm md:text-base leading-relaxed pt-2 text-left">
                        {feature.long_description}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-6 flex flex-col gap-3">
                      {feature.benefits && feature.benefits.length > 0 ? (
                        feature.benefits.map((benefit, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 text-sm text-muted-foreground"
                          >
                            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            <span>{benefit}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-muted-foreground italic">
                          Mais detalhes em breve.
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              );
            })}
          </div>
        )}

        <p className="text-sm text-muted-foreground mb-24 opacity-60 italic">
          ...e outras novidades que estão a ser planeadas.
        </p>

        {/* 4. WAITING LIST (Inscrição) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-xl text-center mb-24"
        >
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4 md:mb-6">
            Entra na <span className="text-primary">Waiting List</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 px-4">
            Sê o primeiro a saber quando lançarmos a v1.0. <br className="hidden sm:block" />
            Sem spam, apenas atualizações importantes.
          </p>

          <form
            id="waiting-list-form"
            action={handleWaitingListSubmit}
            className="flex flex-col sm:flex-row gap-3 w-full px-2 sm:px-0"
          >
            <Input
              name="email"
              type="email"
              placeholder="alumni@alunos.estgv.ipv.pt"
              required
              disabled={isWaitingListPending}
              className="bg-white/5 border-white/10 h-12 text-lg focus-visible:ring-primary/50 w-full disabled:opacity-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="submit"
              size="lg"
              variant="cta"
              disabled={isWaitingListPending}
              className="h-12 px-8 text-base shadow-lg hover:shadow-primary/20 w-full sm:w-auto disabled:opacity-50"
            >
              {isWaitingListPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Inscrevendo...
                </>
              ) : (
                "Inscrever"
              )}
            </Button>
          </form>
        </motion.div>

        {/* 5. SECÇÃO DE FEEDBACK */}
        <Card className="w-full max-w-2xl mb-20 border-white/5 bg-card/40 backdrop-blur-sm">
          <CardContent className="p-6 md:p-8 text-center">
            <h3 className="font-heading text-xl md:text-2xl font-bold mb-3 text-foreground">
              A tua voz conta 🗣️
            </h3>
            <p className="text-sm md:text-base text-muted-foreground mb-6">
              Este portal é construído com base no feedback real dos alunos.{" "}
              <br className="hidden md:block" />
              Tens uma ideia, encontraste um bug ou queres sugerir uma feature?
            </p>

            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-center gap-2 text-sm font-mono text-primary bg-primary/10 p-2 rounded-md w-fit mx-auto border border-primary/20 select-all">
                <DiscordLogo className="h-4 w-4" />
                <span>louraes</span>
              </div>

              <form
                id="suggestion-form"
                action={handleSuggestionSubmit}
                className="space-y-3 text-left"
              >
                <Textarea
                  id="suggestion"
                  name="suggestion"
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  placeholder="Gostava que o portal tivesse..."
                  className="bg-white/5 border-white/10 min-h-[100px] focus-visible:ring-primary/50 resize-none"
                  required
                  minLength={5}
                  maxLength={500}
                />

                {/* Campo Honeypot anti-spam (escondido) */}
                <input
                  type="text"
                  name="confirm_field"
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <Button
                  type="submit"
                  variant="secondary"
                  className="w-full"
                  disabled={isSuggestionPending}
                >
                  {isSuggestionPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      A enviar...
                    </>
                  ) : (
                    "Enviar Sugestão"
                  )}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        {/* 6. RODAPÉ */}
        <div className="mt-auto pt-12 border-t border-white/5 w-full flex flex-col items-center gap-4 opacity-60 hover:opacity-100 transition-opacity">
          <div className="flex flex-wrap justify-center items-center gap-1.5 text-sm text-muted-foreground font-mono">
            <Link
              href="https://github.com/Louraes202/pei"
              target="_blank"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              Projeto <Github className="h-4 w-4" />
            </Link>
            <span>by</span>
            <Link
              href="https://www.linkedin.com/in/martim-loureiro-5b3135237/"
              target="_blank"
              className="font-bold hover:text-primary transition-colors"
            >
              Martim Loureiro
            </Link>
            <span>with</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" />
          </div>
          <p className="text-xs text-muted-foreground/50 font-mono text-center px-4">
            © {currentYear} Martim Loureiro · Feito para alunos de EI na ESTGV ·
            Não afiliado diretamente ao IPV
          </p>
        </div>
      </div>
    </main>
  );
}