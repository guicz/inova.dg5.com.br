export type SectionKey = 
  | 'perfil_valores' 
  | 'estilo_cognitivo' 
  | 'maturidade_inovacao' 
  | 'ambiente_governanca'
  | 'traits_compartilhados'
  | 'subtipos_internos';

export interface Section {
  key: SectionKey;
  title: string;
  description: string;
  color: string;
  textColor: string;
  statements: string[];
}

export interface UserInfo {
  name: string;
  role: string;
  company: string;
  email: string;
}

export interface Results {
  scores: {
    perfil_valores: number;
    estilo_cognitivo: number;
    maturidade_inovacao: number;
    ambiente_governanca: number;
  };
  ivr: number;
  maturityLevel: string;
  perfil_dominante: string;
  unique_traits: string[];
  shared_traits: string[];
  analise_final: string;
  userInfo?: UserInfo;
  traits_compartilhados: number[];
  subtipos_internos: number[];
}
