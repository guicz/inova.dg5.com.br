'use server';

import nodemailer from 'nodemailer';
import type { Results } from '@/types';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function generateHtmlReport(results: Results): string {
    const { userInfo, scores, ivr, maturityLevel, perfil_dominante, unique_traits, shared_traits, analise_final } = results;

    const scoreCard = (title: string, score: number, color: string) => `
        <div style="background-color: #1a1a1a; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
            <h3 style="margin: 0 0 8px 0; color: #e0e0e0; font-size: 16px;">${title}</h3>
            <div style="font-size: 24px; font-weight: bold; color: ${color};">${score.toFixed(0)}/100</div>
            <div style="background-color: #333; border-radius: 4px; height: 8px; margin-top: 8px; overflow: hidden;">
                <div style="width: ${score}%; height: 8px; background-color: ${color};"></div>
            </div>
        </div>
    `;

    const traitBadge = (trait: string) => `
        <span style="background-color: #333; color: #e0e0e0; border-radius: 9999px; padding: 4px 12px; font-size: 14px; margin: 4px;">${trait}</span>
    `;

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Seu Relatório de Maturidade em Inovação</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; background-color: #09090b; color: #fafafa; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: auto; background-color: #111; border: 1px solid #27272a; border-radius: 12px; padding: 24px; }
            .header { text-align: center; margin-bottom: 24px; }
            .header h1 { color: #facc15; font-size: 28px; margin: 0; }
            .header p { color: #a1a1aa; font-size: 16px; }
            .card { background-color: #1c1c1e; border: 1px solid #333; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
            .card-title { font-size: 20px; font-weight: bold; color: #fff; margin: 0 0 16px 0; }
            .ivr-score { font-size: 64px; font-weight: bold; color: #facc15; text-align: center; }
            .maturity-level { font-size: 24px; font-weight: 600; text-align: center; margin-top: 8px; }
            .analysis-text { white-space: pre-wrap; word-wrap: break-word; color: #d4d4d8; font-size: 16px; line-height: 1.6; }
            .footer { text-align: center; font-size: 12px; color: #71717a; margin-top: 24px; }
            .trait-section { margin-top: 16px; }
            .trait-title { font-weight: 600; color: #e0e0e0; margin-bottom: 8px; }
            .trait-container { display: flex; flex-wrap: wrap; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Seu Relatório de Maturidade em Inovação</h1>
                <p>Olá, ${userInfo?.name || 'Inovador(a)'}! Obrigado por realizar o teste.</p>
            </div>

            <div class="card">
                <h2 class="card-title">Índice de Maturidade (IVR)</h2>
                <div class="ivr-score">${ivr.toFixed(1)}</div>
                <div class="maturity-level">${maturityLevel}</div>
            </div>

            <div class="card">
                <h2 class="card-title">Pontuação por Dimensão</h2>
                ${scoreCard('Perfil e Valores (Pioneer)', scores.perfil_valores, '#FFC107')}
                ${scoreCard('Estilo Cognitivo (Driver)', scores.estilo_cognitivo, '#F44336')}
                ${scoreCard('Maturidade (Integrator)', scores.maturidade_inovacao, '#4CAF50')}
                ${scoreCard('Governança (Guardian)', scores.ambiente_governanca, '#673AB7')}
            </div>

            <div class="card">
                <h2 class="card-title">Seu Perfil Dominante: <span style="color: #facc15;">${perfil_dominante}</span></h2>
                <div class="trait-section">
                    <h3 class="trait-title">Traços Únicos</h3>
                    <div class="trait-container">${unique_traits.map(traitBadge).join('')}</div>
                </div>
                ${shared_traits.length > 0 ? `
                <div class="trait-section">
                    <h3 class="trait-title">Traços Compartilhados</h3>
                    <div class="trait-container">${shared_traits.map(traitBadge).join('')}</div>
                </div>
                ` : ''}
            </div>

            <div class="card">
                <h2 class="card-title">Análise e Recomendações</h2>
                <div class="analysis-text">${analise_final.replace(/\n/g, '<br>')}</div>
            </div>
            
            <div class="footer">
                <p>Este é um e-mail automático. Para mais informações, visite <a href="https://dg5.com.br" style="color: #facc15;">dg5.com.br</a>.</p>
                <p>&copy; ${new Date().getFullYear()} DG5i. Todos os direitos reservados.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}


export async function sendReportEmail(results: Results) {
  if (!results.userInfo || !results.userInfo.email) {
    console.error('Email sending skipped: User info or email is missing.');
    return;
  }
  
  const htmlBody = generateHtmlReport(results);

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: results.userInfo.email,
    bcc: 'dev@dg5.com.br',
    subject: 'Seu Relatório de Maturidade em Inovação - DG5i',
    html: htmlBody,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Report email sent to:', results.userInfo.email);
  } catch (error) {
    console.error('Error sending email:', error);
    // Throwing an error here would be caught in actions.ts and logged.
    throw new Error('Failed to send report email.');
  }
}
