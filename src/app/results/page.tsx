"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lightbulb, Target, Bot, BarChart, RotateCcw, Sparkles, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Results } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Dg5iLogo } from '@/components/ui/logo';
import { Badge } from '@/components/ui/badge';

function ResultsDisplay() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const data = searchParams.get('data');
  const [isShareSupported, setIsShareSupported] = useState(false);

  useEffect(() => {
    if (navigator.share) {
      setIsShareSupported(true);
    }
  }, []);

  if (!data) {
    return (
      <div className="text-center space-y-4">
          <p className="text-destructive-foreground">Não foi possível carregar os resultados.</p>
          <Button onClick={() => router.push('/')}>Voltar para o Início</Button>
      </div>
    );
  }

  const results: Omit<Results, 'userInfo' | 'traits_compartilhados' | 'subtipos_internos'> = JSON.parse(decodeURIComponent(data));

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const shareText = `Meu resultado no Teste de Maturidade em Inovação da DG5i: Nível ${results.maturityLevel} (IVR ${results.ivr.toFixed(1)}) e perfil ${results.perfil_dominante}! Faça o teste você também e descubra o seu.`;
        await navigator.share({
          title: 'Resultado do Teste de Maturidade em Inovação - DG5i',
          text: shareText,
          url: window.location.origin,
        });
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
      }
    }
  };

  const ScoreCard = ({ title, score, color, icon: Icon }: { title: string; score: number; color: string; icon: React.ElementType }) => (
    <Card className="flex-1 min-w-[200px] bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-5 w-5 text-muted-foreground ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-xl sm:text-2xl font-bold">{score.toFixed(0)}/100</div>
        <Progress value={score} className="h-2 mt-2" indicatorClassName={color.replace('text-', 'bg-')} />
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <header className="text-center space-y-4">
        <Link href="https://dg5.com.br/?utm_source=app_maturidade_inovacao&utm_medium=web&utm_campaign=diagnostico_gratuito" target="_blank" rel="noopener noreferrer">
          <Dg5iLogo className="h-12 w-auto mx-auto"/>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-headline font-bold tracking-tight">Seu Relatório de Maturidade em Inovação</h1>
        <p className="text-lg sm:text-xl text-muted-foreground">Aqui está a análise detalhada dos seus resultados.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 shadow-lg bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target />
              Índice de Maturidade (IVR)
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-6xl sm:text-7xl font-bold text-primary">{results.ivr.toFixed(1)}</div>
            <p className="text-xl sm:text-2xl font-semibold">{results.maturityLevel}</p>
            <p className="text-muted-foreground">Seu nível de maturidade em inovação.</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-lg bg-card">
           <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart />
              Pontuação por Dimensão
            </CardTitle>
            <CardDescription>Sua performance em cada área chave da inovação.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ScoreCard title="Perfil e Valores (Pioneer)" score={results.scores.perfil_valores} color="text-pioneer" icon={Lightbulb} />
            <ScoreCard title="Estilo Cognitivo (Driver)" score={results.scores.estilo_cognitivo} color="text-driver" icon={Lightbulb} />
            <ScoreCard title="Maturidade (Integrator)" score={results.scores.maturidade_inovacao} color="text-integrator" icon={Lightbulb} />
            <ScoreCard title="Governança (Guardian)" score={results.scores.ambiente_governanca} color="text-guardian" icon={Lightbulb} />
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-lg bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 font-headline text-2xl">
              <Sparkles className="text-primary" />
              Seu Perfil Dominante: <span className="text-primary">{results.perfil_dominante}</span>
            </CardTitle>
            <CardDescription>
              Características do seu perfil, segundo o framework Business Chemistry.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-6">
            <div className='flex-1'>
              <h3 className="font-semibold text-foreground mb-3">Traços Únicos</h3>
              <div className="flex flex-wrap gap-2">
                {results.unique_traits.map((trait) => (
                  <Badge key={trait} variant="secondary" className="text-sm py-1 px-3">{trait}</Badge>
                ))}
              </div>
            </div>
            {results.shared_traits.length > 0 && (
            <div className='flex-1'>
              <h3 className="font-semibold text-foreground mb-3">Traços Compartilhados</h3>
              <div className="flex flex-wrap gap-2">
                {results.shared_traits.map((trait) => (
                  <Badge key={trait} variant="outline" className="text-sm py-1 px-3">{trait}</Badge>
                ))}
              </div>
            </div>
            )}
          </CardContent>
      </Card>


      <Card className="shadow-lg bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-2xl">
            <Bot className="text-primary" />
            Análise e Recomendações
          </CardTitle>
          <CardDescription>Insights gerados pela nossa exclusiva inteligência artificial para guiar seus próximos passos.</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-lg dark:prose-invert max-w-none text-foreground text-opacity-90 whitespace-pre-wrap">
          <p>{results.analise_final}</p>
        </CardContent>
      </Card>

      <div className="text-center flex flex-col sm:flex-row justify-center items-center gap-4">
        <Button asChild size="lg">
          <Link href="/test"><RotateCcw className="mr-2 h-4 w-4" /> Fazer o teste novamente</Link>
        </Button>
        {isShareSupported && (
          <Button onClick={handleShare} size="lg" variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Compartilhar Resultado
          </Button>
        )}
      </div>
    </div>
  );
}

function ResultsSkeleton() {
    return (
        <div className="w-full max-w-6xl mx-auto space-y-8">
            <header className="text-center space-y-2">
                <Skeleton className="h-10 w-3/4 mx-auto" />
                <Skeleton className="h-6 w-1/2 mx-auto" />
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="lg:col-span-1"><CardContent className="p-6 space-y-4"><Skeleton className="h-24 w-1/2 mx-auto" /><Skeleton className="h-8 w-1/3 mx-auto" /></CardContent></Card>
                <Card className="lg:col-span-1"><CardContent className="p-6 grid grid-cols-2 gap-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></CardContent></Card>
            </div>
            <Card>
                <CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader>
                <CardContent className="space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3" /></CardContent>
            </Card>
        </div>
    );
}

export default function ResultsPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-8">
      <Suspense fallback={<ResultsSkeleton />}>
        <ResultsDisplay />
      </Suspense>
    </main>
  );
}
