import { Dg5iLogo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <Link href="https://dg5.com.br/?utm_source=app_maturidade_inovacao&utm_medium=web&utm_campaign=diagnostico_gratuito" target="_blank" rel="noopener noreferrer">
              <Dg5iLogo className="h-12 w-auto mx-auto lg:mx-0" />
            </Link>
            <h1 className="text-3xl sm:text-5xl font-headline font-bold tracking-tight text-foreground">
              Avalie sua Maturidade em Inovação
            </h1>
            <p className="text-lg text-muted-foreground">
              Descubra os pontos fortes e as oportunidades de melhoria da sua organização com nosso teste abrangente. Obtenha uma análise detalhada e insights acionáveis com o poder da Inteligência Artificial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="font-semibold">
                <Link href="/test">Começar o Teste Gratuito</Link>
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center items-center">
            <Card className="w-full max-w-md shadow-2xl transform-gpu hover:scale-105 transition-transform duration-300 bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                  <Zap className="text-pioneer" />
                  O que você vai descobrir?
                </CardTitle>
                <CardDescription>
                  Nosso teste analisa quatro dimensões cruciais da inovação.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-pioneer flex items-center justify-center text-pioneer-foreground font-bold font-headline text-xl">A</div>
                  <div>
                    <h3 className="font-semibold text-foreground">Perfil e Valores Pessoais</h3>
                    <p className="text-sm text-muted-foreground">Autopercepção, motivações e colaboração.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                   <div className="w-10 h-10 rounded-lg bg-driver flex items-center justify-center text-driver-foreground font-bold font-headline text-xl">B</div>
                  <div>
                    <h3 className="font-semibold text-foreground">Estilo Cognitivo</h3>
                    <p className="text-sm text-muted-foreground">Abordagem a problemas, tomada de decisão e inovação.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                   <div className="w-10 h-10 rounded-lg bg-integrator flex items-center justify-center text-integrator-foreground font-bold font-headline text-xl">C</div>
                  <div>
                    <h3 className="font-semibold text-foreground">Maturidade em Inovação</h3>
                    <p className="text-sm text-muted-foreground">Práticas, processos e investimentos em inovação.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                   <div className="w-10 h-10 rounded-lg bg-guardian flex items-center justify-center text-guardian-foreground font-bold font-headline text-xl">D</div>
                  <div>
                    <h3 className="font-semibold text-foreground">Ambiente de Negócio e Governança</h3>
                    <p className="text-sm text-muted-foreground">Suporte da liderança, governança e incentivos.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <footer className="w-full max-w-5xl mx-auto text-center pt-8 mt-16 border-t border-border">
        <p className="text-xs text-muted-foreground max-w-3xl mx-auto">
          <strong>Fundamentação Metodológica:</strong> Nosso teste de maturidade em inovação é fundamentado em metodologias reconhecidas internacionalmente, incluindo Business Chemistry™ (Deloitte), Kirton Adaption-Innovation Inventory (KAI), Manual de Oslo (OCDE) e o Deloitte Innovation Maturity Model.
        </p>
      </footer>
    </main>
  );
}
