'use server';

import { google } from 'googleapis';
import type { Results } from '@/types';
import credentials from '../../drive.json';

export async function appendToSpreadsheet(data: Results) {
  if (!data.userInfo) {
    console.error('Spreadsheet append skipped: User info is missing.');
    return;
  }
  
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME;

    const timestamp = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
    
    // Ensure the sheet has these headers in the first row for clarity
    // Timestamp, Nome, Cargo, Empresa, Email, IVR, Nível de Maturidade, Perfil (P), Estilo (D), Maturidade (I), Governança (G), Perfil Dominante, Unique Traits, Shared Traits, Traits Compartilhados, Subtipos Internos
    const row = [
      timestamp,
      data.userInfo.name,
      data.userInfo.role,
      data.userInfo.company,
      data.userInfo.email,
      data.ivr.toFixed(1),
      data.maturityLevel,
      data.scores.perfil_valores.toFixed(0),
      data.scores.estilo_cognitivo.toFixed(0),
      data.scores.maturidade_inovacao.toFixed(0),
      data.scores.ambiente_governanca.toFixed(0),
      data.perfil_dominante,
      data.unique_traits.join(','),
      data.shared_traits.join(','),
      data.traits_compartilhados.join(','),
      data.subtipos_internos.join(','),
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A1`, // Appending to the first empty row after the table starting at A1
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [row],
      },
    });
    console.log('Lead data appended to spreadsheet.');
  } catch (error) {
    console.error('Error appending to spreadsheet:', error);
    // Throwing an error here would be caught in actions.ts and logged.
    throw new Error('Failed to save lead data.');
  }
}
