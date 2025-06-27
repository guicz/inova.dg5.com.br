
// src/ai/flows/analyze-innovation-maturity.ts
'use server';

/**
 * @fileOverview Generates a final analysis for an innovation maturity test.
 *
 * - analyzeInnovationMaturity - A function that generates the final text analysis based on test results.
 * - AnalyzeInnovationMaturityInput - The input type for the analyzeInnovationMaturity function.
 * - AnalyzeInnovationMaturityOutput - The return type for the analyzeInnovationMaturity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeInnovationMaturityInputSchema = z.object({
  perfil_valores: z.array(z.number().min(0).max(5)).length(8),
  estilo_cognitivo: z.array(z.number().min(0).max(5)).length(8),
  maturidade_inovacao: z.array(z.number().min(0).max(5)).length(8),
  ambiente_governanca: z.array(z.number().min(0).max(5)).length(8),
  traits_compartilhados: z.array(z.number().min(0).max(5)).length(4),
  subtipos_internos: z.array(z.number().min(0).max(5)).length(8),
  ivr: z.number(),
  maturityLevel: z.string(),
  perfil_dominante: z.string(),
  unique_traits: z.array(z.string()),
  shared_traits: z.array(z.string()),
});

export type AnalyzeInnovationMaturityInput = z.infer<typeof AnalyzeInnovationMaturityInputSchema>;

const AnalyzeInnovationMaturityOutputSchema = z.object({
  analise_final: z.string().describe('Uma análise final detalhada e construtiva em português, incluindo a influência do perfil, pontos fortes, e recomendações de crescimento.'),
});
export type AnalyzeInnovationMaturityOutput = z.infer<typeof AnalyzeInnovationMaturityOutputSchema>;

export async function analyzeInnovationMaturity(input: AnalyzeInnovationMaturityInput): Promise<AnalyzeInnovationMaturityOutput> {
  return analyzeInnovationMaturityFlow(input);
}

const analyzeInnovationMaturityPrompt = ai.definePrompt({
  name: 'analyzeInnovationMaturityPrompt',
  input: {schema: AnalyzeInnovationMaturityInputSchema},
  output: {schema: AnalyzeInnovationMaturityOutputSchema},
  prompt: `Você é um assistente de inovação especialista em analisar resultados do framework Business Chemistry. Sua tarefa é gerar uma análise final, detalhada e construtiva em português, com base nos dados do teste de um usuário.

**Análise Requerida:**
O texto final deve ser um parágrafo contínuo e fluído. Comece analisando o **perfil dominante** do usuário.
- Se o perfil for **híbrido** (indicado por uma barra, como "Pioneiro / Executor"), descreva como a **combinação das características únicas** (listadas em \`unique_traits\`) cria um inovador versátil e equilibrado. Dê exemplos de como essa sinergia influencia positivamente o desempenho em inovação.
- Se for um **perfil único**, descreva como as características únicas desse perfil influenciam o desempenho.

Em ambos os casos, use um tom positivo e ofereça sugestões práticas para que ele explore esses pontos fortes. Se houver **traços compartilhados** (listados em \`shared_traits\`), inclua recomendações claras sobre como desenvolvê-los como as "próximas fronteiras" de crescimento. Por fim, conclua com uma mensagem motivacional sobre a jornada de inovação, conectando-a ao nível de maturidade (\`maturityLevel\`) do usuário.

**Dados do Usuário:**
- Perfil Dominante: {{perfil_dominante}}
- Traços Únicos do Perfil: {{#each unique_traits}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
- Nível de Maturidade: {{maturityLevel}} (IVR: {{ivr}})
- Traços Compartilhados para Desenvolvimento: {{#if shared_traits}}{{#each shared_traits}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}Nenhum{{/if}}

**Importante:** A sua resposta DEVE ser um objeto JSON contendo apenas a chave "analise_final", com o texto da análise como valor. Não adicione nenhum outro texto ou formatação fora do JSON.
`,
});

const analyzeInnovationMaturityFlow = ai.defineFlow(
  {
    name: 'analyzeInnovationMaturityFlow',
    inputSchema: AnalyzeInnovationMaturityInputSchema,
    outputSchema: AnalyzeInnovationMaturityOutputSchema,
  },
  async input => {
    const {output} = await analyzeInnovationMaturityPrompt(input);
    if (!output) {
      throw new Error("AI analysis did not return a valid structured output.");
    }
    return output;
  }
);

