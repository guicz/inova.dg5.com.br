"use client";

import { useState, useMemo, useActionState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Loader2, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { SECTIONS } from "@/lib/test-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StarRating } from "@/components/ui/star-rating";
import { submitTest } from "./actions";
import { useToast } from "@/hooks/use-toast";
import type { SectionKey, UserInfo } from "@/types";
import { Dg5iLogo } from "@/components/ui/logo";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const initialState = {
  message: "",
};

export default function TestPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0); // 0: User Info, 1-6: Sections
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: '', role: '', company: '', email: '' });
  const [answers, setAnswers] = useState<(number | null)[][]>(
    Array(SECTIONS.length).fill(null).map((_, sectionIndex) => Array(SECTIONS[sectionIndex].statements.length).fill(null))
  );
  
  const [state, formAction, isPending] = useActionState(submitTest, initialState);
  const { toast } = useToast();

  // Handle successful form submission
  useEffect(() => {
    if (state?.success && state?.results) {
      const encodedResults = encodeURIComponent(JSON.stringify(state.results));
      router.push(`/results?data=${encodedResults}`);
    } else if (state?.message) {
      toast({
        title: "Informações",
        description: state.message,
        variant: "default",
      });
    }
  }, [state, router, toast]);

  const totalSteps = SECTIONS.length + 1;
  const progressValue = currentStep > 0 ? ((currentStep) / (totalSteps-1)) * 100 : 0;


  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAnswerChange = (sectionIndex: number, statementIndex: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[sectionIndex][statementIndex] = value;
    setAnswers(newAnswers);
  };
  
  const isUserInfoComplete = useMemo(() => {
    return userInfo.name && userInfo.role && userInfo.company && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email);
  }, [userInfo]);

  const isCurrentSectionComplete = useMemo(() => {
    if (currentStep === 0) return isUserInfoComplete;
    if (currentStep > SECTIONS.length) return false; // Beyond the last section
    const sectionIndex = currentStep - 1;
    if (!answers[sectionIndex]) return false;
    return answers[sectionIndex].every((answer) => answer !== null);
  }, [answers, currentStep, isUserInfoComplete]);

  const handleNext = () => {
    if (!isCurrentSectionComplete) {
      const message = currentStep === 0 
        ? "Por favor, preencha todos os campos corretamente."
        : "Por favor, avalie todas as afirmações antes de prosseguir.";
      toast({
        title: "Informações Incompletas",
        description: message,
        variant: "destructive",
      });
      return;
    }
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isCurrentSectionComplete) {
      toast({
        title: "Respostas pendentes",
        description: "Por favor, avalie todas as afirmações antes de submeter.",
        variant: "destructive",
      });
      return;
    }
    
    const formData = new FormData();
    formData.append('userInfo', JSON.stringify(userInfo));
    formData.append('answers', JSON.stringify(answers));
    formAction(formData);
  }

  const sectionColors: Record<SectionKey, string> = {
    perfil_valores: 'text-pioneer',
    estilo_cognitivo: 'text-driver',
    maturidade_inovacao: 'text-integrator',
    ambiente_governanca: 'text-guardian',
    traits_compartilhados: 'text-trait',
    subtipos_internos: 'text-subtype',
  };

  const renderContent = () => {
    if (currentStep === 0) {
      return (
        <>
          <CardHeader>
              <Progress value={progressValue} indicatorClassName="bg-primary" />
              <div className="flex justify-between items-baseline pt-4">
                <CardTitle className="font-headline text-2xl sm:text-3xl text-primary">Suas Informações</CardTitle>
                <span className="text-sm font-medium text-muted-foreground">
                    Etapa 1 de {totalSteps}
                </span>
              </div>
              <CardDescription>Preencha seus dados para receber o relatório completo por e-mail e começar o teste.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" name="name" value={userInfo.name} onChange={handleUserInfoChange} placeholder="Seu nome" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Cargo</Label>
                <Input id="role" name="role" value={userInfo.role} onChange={handleUserInfoChange} placeholder="Seu cargo" required />
              </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <Input id="company" name="company" value={userInfo.company} onChange={handleUserInfoChange} placeholder="Nome da sua empresa" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" name="email" type="email" value={userInfo.email} onChange={handleUserInfoChange} placeholder="seu.email@empresa.com" required />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between p-4 sm:p-6 border-t">
              <Button type="button" variant="outline" onClick={() => window.location.href='/'}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              <Button type="button" onClick={handleNext} disabled={!isUserInfoComplete || isPending}>
                Começar o Teste
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
        </>
      );
    }
    
    const sectionIndex = currentStep - 1;
    const currentSection = SECTIONS[sectionIndex];
    const colorKey = currentSection.key;
    
    const textColorClassName = sectionColors[colorKey];

    return (
      <form onSubmit={handleSubmit}>
        <CardHeader className="p-4 sm:p-6">
          <Progress value={progressValue} indicatorClassName={currentSection.color} />
          <div className="flex justify-between items-baseline pt-4">
            <CardTitle className={`font-headline text-2xl sm:text-3xl ${textColorClassName}`}>
              {currentSection.title}
            </CardTitle>
            <span className="text-sm font-medium text-muted-foreground">
              Etapa {currentStep + 1} de {totalSteps}
            </span>
          </div>
          <CardDescription>{currentSection.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-4 sm:p-6">
          {currentSection.statements.map((statement, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50">
              <p className="flex-1 text-sm sm:text-base font-medium text-foreground">{index + 1}. {statement}</p>
              <StarRating
                value={answers[sectionIndex]?.[index]}
                onChange={(value) => handleAnswerChange(sectionIndex, index, value)}
                colorClassName={textColorClassName}
              />
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-between p-4 sm:p-6 border-t">
          <Button type="button" variant="outline" onClick={handleBack} disabled={currentStep === 0 || isPending}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>

          {currentStep < totalSteps - 1 ? (
            <Button type="button" onClick={handleNext} disabled={!isCurrentSectionComplete || isPending}>
              Próximo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={!isCurrentSectionComplete || isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Ver Resultado
                </>
              )}
            </Button>
          )}
        </CardFooter>
        {state?.message && <p className="p-4 text-sm text-integrator">{state.message}</p>}
      </form>
    );
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 relative">
      {isPending && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
          <p className="mt-4 text-lg font-semibold text-foreground">Analisando seus resultados...</p>
          <p className="text-muted-foreground">Isso pode levar alguns segundos.</p>
        </div>
      )}
      <div className="absolute top-6 left-6">
          <Link href="https://dg5.com.br/?utm_source=app_maturidade_inovacao&utm_medium=web&utm_campaign=diagnostico_gratuito" target="_blank" rel="noopener noreferrer">
              <Dg5iLogo className="h-8 w-auto" />
          </Link>
      </div>
      <Card className="w-full max-w-4xl shadow-xl bg-card">
        {renderContent()}
      </Card>
    </main>
  );
}
