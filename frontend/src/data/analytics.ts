// analytics.ts - Contains functions for calculating metrics
import {
  Payment, Adjustment, Provider, Insurer,
  ServiceCode, SummaryMetrics, InsurerSummary,
  MonthSummary, ProviderSummary, ServiceSummary
} from './types';

// Calculate summary metrics
export const calculateSummaryMetrics = (
  payments: Payment[],
  providers: Provider[],
  insurers: Insurer[],
  serviceCodes: ServiceCode[],
  adjustments: Adjustment[]
): SummaryMetrics => {
  // Total billed amount
  const totalBilled = payments.reduce((sum, payment) => sum + payment.billedAmount, 0);
  
  // Total collected (insurer + patient)
  const totalCollected = payments.reduce((sum, payment) => sum + payment.insurerPaid + payment.patientPaid, 0);
  
  // Total AR (insurer + patient)
  const totalAR = payments.reduce((sum, payment) => sum + payment.insurerAR + payment.patientAR, 0);
  
  // Total write-offs
  const totalWriteOffs = payments.reduce((sum, payment) => sum + payment.insurerWriteOff, 0) + 
                        adjustments.filter(adj => adj.adjustmentCode.startsWith("WO"))
                                   .reduce((sum, adj) => sum + Math.abs(adj.adjustmentAmount), 0);
  
  // Collection rate
  const collectionRate = (totalCollected / (totalCollected + totalAR)) * 100;
  
  // Average days in AR
  const daysInAR = payments
    .filter(payment => payment.insurerAR > 0 || payment.patientAR > 0)
    .map(payment => {
      const serviceDate = new Date(payment.sessionDate);
      const today = new Date();
      return Math.floor((today.getTime() - serviceDate.getTime()) / (1000 * 3600 * 24));
    });
  
  const avgDaysInAR = daysInAR.length > 0 
    ? daysInAR.reduce((sum, days) => sum + days, 0) / daysInAR.length
    : 0;
  
  // Payments by insurer
  const paymentsByInsurer: InsurerSummary[] = insurers.map(insurer => {
    const insurerPayments = payments.filter(payment => payment.insurerId === insurer.id);
    return {
      insurerId: insurer.id,
      insurerName: insurer.name,
      totalBilled: insurerPayments.reduce((sum, payment) => sum + payment.billedAmount, 0),
      totalAllowed: insurerPayments.reduce((sum, payment) => sum + payment.allowedAmount, 0),
      totalPaid: insurerPayments.reduce((sum, payment) => sum + payment.insurerPaid, 0),
      totalAR: insurerPayments.reduce((sum, payment) => sum + payment.insurerAR, 0),
      totalWriteOff: insurerPayments.reduce((sum, payment) => sum + payment.insurerWriteOff, 0),
      paymentCount: insurerPayments.length,
    };
  });
  
  // Payments by month
  const paymentsByMonth: MonthSummary[] = [];
  for (let month = 0; month < 12; month++) {
    const date = new Date(2023, month, 1);
    const monthName = date.toLocaleString('default', { month: 'short' });
    
    const monthPayments = payments.filter(payment => {
      const paymentDate = new Date(payment.sessionDate);
      return paymentDate.getMonth() === month && paymentDate.getFullYear() === 2023;
    });
    
    paymentsByMonth.push({
      month: monthName,
      year: 2023,
      totalBilled: monthPayments.reduce((sum, payment) => sum + payment.billedAmount, 0),
      totalCollected: monthPayments.reduce((sum, payment) => sum + payment.insurerPaid + payment.patientPaid, 0),
      totalAR: monthPayments.reduce((sum, payment) => sum + payment.insurerAR + payment.patientAR, 0),
      totalWriteOff: monthPayments.reduce((sum, payment) => sum + payment.insurerWriteOff, 0),
      sessionCount: monthPayments.length,
    });
  }
  
  // Payments by provider
  const paymentsByProvider: ProviderSummary[] = providers.map(provider => {
    const providerPayments = payments.filter(payment => payment.providerId === provider.id);
    return {
      providerId: provider.id,
      providerName: provider.name,
      totalBilled: providerPayments.reduce((sum, payment) => sum + payment.billedAmount, 0),
      totalCollected: providerPayments.reduce((sum, payment) => sum + payment.insurerPaid + payment.patientPaid, 0),
      totalAR: providerPayments.reduce((sum, payment) => sum + payment.insurerAR + payment.patientAR, 0),
      sessionCount: providerPayments.length,
    };
  });
  
  // Payments by service code
  const paymentsByService: ServiceSummary[] = serviceCodes.map(service => {
    const servicePayments = payments.filter(payment => payment.serviceCode === service.code);
    return {
      serviceCode: service.code,
      serviceDescription: service.description,
      totalBilled: servicePayments.reduce((sum, payment) => sum + payment.billedAmount, 0),
      totalCollected: servicePayments.reduce((sum, payment) => sum + payment.insurerPaid + payment.patientPaid, 0),
      totalAR: servicePayments.reduce((sum, payment) => sum + payment.insurerAR + payment.patientAR, 0),
      sessionCount: servicePayments.length,
    };
  });
  
  return {
    totalBilled,
    totalCollected,
    totalAR,
    totalWriteOffs,
    collectionRate,
    avgDaysInAR,
    paymentsByInsurer,
    paymentsByMonth,
    paymentsByProvider,
    paymentsByService,
  };
};