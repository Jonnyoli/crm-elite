/**
 * Tipos fundamentais para o CRM Imobiliário
 */

export type LeadStatus =
  | 'NOVO'
  | 'CONTACTADO'
  | 'VISITA_AGENDADA'
  | 'PROPOSTA'
  | 'FECHADO_GANHO'
  | 'PERDIDO';

export type Priority = 'BAIXA' | 'MEDIA' | 'ALTA';

export type PropertyStatus = 'DISPONIVEL' | 'RESERVADO' | 'VENDIDO';

export type PropertyType = 'T0' | 'T1' | 'T2' | 'T3' | 'T4' | 'MORADIA' | 'TERRENO';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: LeadStatus;
  notes: string;
  tags: string[];
  createdAt: string;
  assignedTo?: string;
}

export interface Property {
  id: string;
  address: string;
  price: number;
  type: PropertyType;
  status: PropertyStatus;
  description: string;
  imageUrl?: string;
  features: string[];
  location?: string;
  createdAt?: string;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  probability: number; // 0 to 100
  stage: LeadStatus;
  leadId: string;
  propertyId?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: Priority;
  isCompleted: boolean;
  leadId?: string;
  dealId?: string;
}

export interface Interaction {
  id: string;
  leadId: string;
  type: 'CHAMADA' | 'EMAIL' | 'REUNIAO' | 'VISITA';
  content: string;
  date: string;
}
