// types.ts - Contains all the interfaces
export interface Payment {
  id: string;
  sessionId: string;
  sessionDate: string;
  patientId: string;
  patientName: string;
  providerId: string;
  providerName: string;
  insurerId: string;
  insurerName: string;
  serviceCode: string;
  serviceDescription: string;
  billedAmount: number;
  allowedAmount: number;
  insurerResponsibility: number;
  patientResponsibility: number;
  insurerPaid: number;
  insurerAR: number;
  insurerWriteOff: number;
  patientPaid: number;
  patientAR: number;
  claimStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface Adjustment {
  id: string;
  sessionId: string;
  patientId: string;
  insurerId: string;
  createdDate: string;
  adjustmentAmount: number;
  adjustmentCode: string;
  adjustmentDescription: string;
  reason: string;
  processedBy: string;
}

export interface Provider {
  id: string;
  name: string;
  specialty: string;
  npi: string;
  active: boolean;
}

export interface Patient {
  id: string;
  name: string;
  insurerId: string;
  insurerName: string;
  policyNumber: string;
  dateOfBirth: string;
  active: boolean;
}

export interface Insurer {
  id: string;
  name: string;
  payerType: string;
  averageDaysToPayment: number;
}

export interface ServiceCode {
  code: string;
  description: string;
  baseRate: number;
}

export interface AdjustmentCode {
  code: string;
  description: string;
  reason: string;
}

export interface SummaryMetrics {
  totalBilled: number;
  totalCollected: number;
  totalAR: number;
  totalWriteOffs: number;
  collectionRate: number;
  avgDaysInAR: number;
  paymentsByInsurer: InsurerSummary[];
  paymentsByMonth: MonthSummary[];
  paymentsByProvider: ProviderSummary[];
  paymentsByService: ServiceSummary[];
}

export interface InsurerSummary {
  insurerId: string;
  insurerName: string;
  totalBilled: number;
  totalAllowed: number;
  totalPaid: number;
  totalAR: number;
  totalWriteOff: number;
  paymentCount: number;
}

export interface MonthSummary {
  month: string;
  year: number;
  totalBilled: number;
  totalCollected: number;
  totalAR: number;
  totalWriteOff: number;
  sessionCount: number;
}

export interface ProviderSummary {
  providerId: string;
  providerName: string;
  totalBilled: number;
  totalCollected: number;
  totalAR: number;
  sessionCount: number;
}

export interface ServiceSummary {
  serviceCode: string;
  serviceDescription: string;
  totalBilled: number;
  totalCollected: number;
  totalAR: number;
  sessionCount: number;
}