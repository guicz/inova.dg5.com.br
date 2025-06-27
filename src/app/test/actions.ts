
"use server";

import { z } from "zod";
import { analyzeInnovationMaturity } from "@/ai/flows/analyze-innovation-maturity";
import type { Results } from "@/types";
import { sendReportEmail } from "@/services/email";

const getMaturityLevel = (ivr: number): string => {
  if (ivr <= 25) return "Inicial";
  if (ivr <= 50) return "Emergente";
  if (ivr <= 75) return "Definido";
  if (ivr <= 90) return "Avançado";
  return "Otimizado";
};

const UserInfoSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  role: z.string().min(1, "Cargo é obrigatório"),
  company: z.string().min(1, "Empresa é obrigatória"),
  email: z.string().email("Email inválido"),
});

const submitTestSchema = z.object({
  answers: z.tuple([
    z.array(z.number().min(0).max(5)).length(8), // A: Perfil e Valores Pessoais
    z.array(z.number().min(0).max(5)).length(8), // B: Estilo Cognitivo
    z.array(z.number().min(0).max(5)).length(8), // C: Maturidade em Inovação
    z.array(z.number().min(0).max(5)).length(8), // D: Ambiente de Negócio e Governança
    z.array(z.number().min(0).max(5)).length(4), // E: Traits Compartilhados
    z.array(z.number().min(0).max(5)).length(8), // F: Subtipos Internos
  ]),
  userInfo: UserInfoSchema,
});

export async function submitTest(prevState: any, formData: FormData) {
  const rawAnswers = formData.get("answers");
  const rawUserInfo = formData.get("userInfo");

  if (typeof rawAnswers !== "string" || typeof rawUserInfo !== "string") {
    return { message: "Dados inválidos." };
  }
  
  let parsed;
  try {
    parsed = submitTestSchema.safeParse({ 
      answers: JSON.parse(rawAnswers),
      userInfo: JSON.parse(rawUserInfo) 
    });
  } catch (e) {
    return { message: "Erro ao processar dados. Tente novamente."}
  }


  if (!parsed.success) {
    return { message: "Formato de dados inválido." };
  }

  const { answers, userInfo } = parsed.data;
  const [
    perfilValoresScores, 
    estiloCognitivoScores, 
    maturidadeInovacaoScores, 
    ambienteGovernancaScores,
    traitsCompartilhadosScores,
    subtiposInternosScores
  ] = answers;

  const calculateScore = (scores: number[]) => {
    if (scores.length === 0) return 0;
    const sum = scores.reduce((acc, score) => acc + (score || 0), 0);
    const avg = sum / scores.length;
    return (avg / 5) * 100;
  };

  const scores = {
    perfil_valores: calculateScore(perfilValoresScores),
    estilo_cognitivo: calculateScore(estiloCognitivoScores),
    maturidade_inovacao: calculateScore(maturidadeInovacaoScores),
    ambiente_governanca: calculateScore(ambienteGovernancaScores),
  };

  const ivr = (scores.perfil_valores + scores.estilo_cognitivo + scores.maturidade_inovacao + scores.ambiente_governanca) / 4;
  const maturityLevel = getMaturityLevel(ivr);

  // --- Start of new dominance calculation logic ---
  const scoreEntries = Object.entries(scores);
  const maxScore = Math.max(...scoreEntries.map(([, score]) => score));
  
  // Find all dimensions with the max score (if the score is not 0)
  const highestScoringDimensions = scoreEntries
    .filter(([, score]) => score > 0 && score === maxScore)
    .map(([key]) => key);
  
  type ProfileKey = 'Pioneer' | 'Driver' | 'Integrator' | 'Guardian';

  const dimensionToProfileKey: Record<string, ProfileKey> = {
    'perfil_valores': 'Pioneer',
    'estilo_cognitivo': 'Driver',
    'maturidade_inovacao': 'Integrator',
    'ambiente_governanca': 'Guardian',
  };

  const dominantProfileKeys: ProfileKey[] = highestScoringDimensions.map(dim => dimensionToProfileKey[dim]);
  
  const dominantProfileTranslations: Record<ProfileKey, string> = {
      Pioneer: 'Pioneiro',
      Driver: 'Executor',
      Integrator: 'Integrador',
      Guardian: 'Guardião'
  };

  const dominantProfile = dominantProfileKeys.length > 0
    ? dominantProfileKeys.map(key => dominantProfileTranslations[key]).join(' / ')
    : 'Indeterminado';
    
  const UNIQUE_TRAITS_MAP: Record<ProfileKey, string[]> = {
    Pioneer: ["Extrovertido", "Espontâneo", "Aceita Riscos", "Adaptável", "Imaginativo"],
    Driver: ["Quantitativo", "Lógico", "Focado", "Competitivo", "Experimental"],
    Integrator: ["Colaborativo", "Confiável", "Empático", "Focado em Relacionamentos", "Diplomático"],
    Guardian: ["Metódico", "Reservado", "Focado em Detalhes", "Prático", "Estruturado"],
  };

  // Combine traits from all dominant profiles and remove duplicates
  const unique_traits = [...new Set(dominantProfileKeys.flatMap(key => UNIQUE_TRAITS_MAP[key] || []))];
  // --- End of new dominance calculation logic ---
  
  const SHARED_TRAIT_NAMES = [
    "Decisão Rápida e Risco (Pioneer/Driver)",
    "Disciplina e Velocidade (Driver/Guardian)",
    "Processo e Relacionamento (Guardian/Integrator)",
    "Empatia e Experimentação (Integrator/Pioneer)",
  ];
  const shared_traits: string[] = [];
  traitsCompartilhadosScores.forEach((score, index) => {
    if (score >= 4) { 
      shared_traits.push(SHARED_TRAIT_NAMES[index]);
    }
  });
  
  const isTestUser = userInfo.email.endsWith('@test.com');
  let resultsForPage;
  let aiResult: { analise_final: string };

  try {
    if (isTestUser) {
      console.log("MODO DE TESTE: Usando dados mockados para a análise de IA.");
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      aiResult = {
        analise_final: `(Esta é uma análise de teste) Como **${dominantProfile}**, seus traços únicos de *${unique_traits.join(', ')}* revelam uma forte inclinação para impulsionar a inovação com energia e novas perspectivas. Você se destaca em desafiar o status quo e iniciar mudanças. Para maximizar seu impacto, continue a alavancar essa força, criando ambientes onde a experimentação seja não apenas permitida, mas celebrada.\n\nSua próxima fronteira de crescimento está em desenvolver seus traços compartilhados: *${shared_traits.join(', ')}*. Focar em como você pode integrar mais planejamento estruturado e colaboração em suas iniciativas garantirá que suas excelentes ideias não apenas decolem, mas também se tornem sustentáveis a longo prazo. Seu nível de maturidade atual é **${maturityLevel}**, um excelente ponto de partida para essa jornada. Continue inovando!`,
      };
    } else {
      aiResult = await analyzeInnovationMaturity({
        perfil_valores: perfilValoresScores.map(v => v || 0),
        estilo_cognitivo: estiloCognitivoScores.map(v => v || 0),
        maturidade_inovacao: maturidadeInovacaoScores.map(v => v || 0),
        ambiente_governanca: ambienteGovernancaScores.map(v => v || 0),
        traits_compartilhados: traitsCompartilhadosScores.map(v => v || 0),
        subtipos_internos: subtiposInternosScores.map(v => v || 0),
        ivr,
        maturityLevel,
        perfil_dominante: dominantProfile,
        unique_traits,
        shared_traits,
      });
    }

  } catch (error) {
    console.error("Error during AI analysis:", error);
    return { message: "Resultados enviados para o seu e-mail" };
  }

  const fullResults: Results = {
    scores,
    ivr,
    maturityLevel,
    perfil_dominante: dominantProfile,
    unique_traits: unique_traits,
    shared_traits: shared_traits,
    analise_final: aiResult.analise_final,
    userInfo,
    traits_compartilhados: traitsCompartilhadosScores.map(v => v || 0),
    subtipos_internos: subtiposInternosScores.map(v => v || 0),
  };
  
  if (!isTestUser) {
      sendReportEmail(fullResults).catch(error => {
          console.error("Error in post-submission task:", error);
      });
  }

  resultsForPage = {
    scores,
    ivr,
    maturityLevel,
    perfil_dominante: dominantProfile,
    unique_traits: unique_traits,
    shared_traits: shared_traits,
    analise_final: aiResult.analise_final,
  };
  
  return { success: true, results: resultsForPage };
}
