// data-generators.ts - Contains functions for generating mock data
import { 
  Payment, Adjustment, Provider, Patient, Insurer,
  ServiceCode, AdjustmentCode
} from './types';

// Random date generator within a range
export const randomDate = (start: Date, end: Date): string => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    .toISOString().split('T')[0];
};

// Generate providers data
export const generateProviders = (): Provider[] => {
  return [
    { id: "P001", name: "Dr. Sarah Johnson", specialty: "Psychiatry", npi: "1234567890", active: true },
    { id: "P002", name: "Dr. Michael Chen", specialty: "Clinical Psychology", npi: "2345678901", active: true },
    { id: "P003", name: "Dr. Emily Rodriguez", specialty: "Neuropsychology", npi: "3456789012", active: true },
    { id: "P004", name: "Dr. David Kim", specialty: "Child & Adolescent", npi: "4567890123", active: true },
    { id: "P005", name: "Dr. Lisa Patel", specialty: "Addiction Counseling", npi: "5678901234", active: true },
    { id: "P006", name: "Dr. Robert Johnson", specialty: "Psychiatry", npi: "6789012345", active: false },
  ];
};

// Generate insurers data
export const generateInsurers = (): Insurer[] => {
  return [
    { id: "I001", name: "Blue Cross Blue Shield", payerType: "Commercial", averageDaysToPayment: 24 },
    { id: "I002", name: "Aetna", payerType: "Commercial", averageDaysToPayment: 30 },
    { id: "I003", name: "Medicare", payerType: "Government", averageDaysToPayment: 18 },
    { id: "I004", name: "Medicaid", payerType: "Government", averageDaysToPayment: 35 },
    { id: "I005", name: "UnitedHealthcare", payerType: "Commercial", averageDaysToPayment: 27 },
    { id: "I006", name: "Cigna", payerType: "Commercial", averageDaysToPayment: 29 },
    { id: "I007", name: "Self-Pay", payerType: "Patient", averageDaysToPayment: 0 },
  ];
};

// Generate service codes
export const generateServiceCodes = (): ServiceCode[] => {
  return [
    { code: "90791", description: "Psychiatric Diagnostic Evaluation", baseRate: 150 },
    { code: "90832", description: "Psychotherapy, 30 min", baseRate: 65 },
    { code: "90834", description: "Psychotherapy, 45 min", baseRate: 85 },
    { code: "90837", description: "Psychotherapy, 60 min", baseRate: 130 },
    { code: "90846", description: "Family Psychotherapy without Patient", baseRate: 100 },
    { code: "90847", description: "Family Psychotherapy with Patient", baseRate: 110 },
    { code: "90853", description: "Group Psychotherapy", baseRate: 50 },
    { code: "99213", description: "Medication Management, 15 min", baseRate: 75 },
  ];
};

// Generate adjustment codes
export const generateAdjustmentCodes = (): AdjustmentCode[] => {
  return [
    { code: "CO45", description: "Contractual Obligation", reason: "Charge exceeds fee schedule/maximum allowable" },
    { code: "PR1", description: "Patient Responsibility", reason: "Deductible Amount" },
    { code: "PR2", description: "Patient Responsibility", reason: "Coinsurance Amount" },
    { code: "PR3", description: "Patient Responsibility", reason: "Co-payment Amount" },
    { code: "OA23", description: "Other Adjustment", reason: "Payment denied - not authorized" },
    { code: "PI11", description: "Payer Initiated Reduction", reason: "Diagnosis inconsistent with procedure" },
    { code: "WO", description: "Write Off", reason: "Courtesy adjustment" },
    { code: "WO99", description: "Write Off", reason: "Collection deemed unlikely" },
  ];
};

// Generate patients data
export const generatePatients = (): Patient[] => {
  // Hard-coded patients with insurer information
  return [
    { id: "PT001", name: "John Smith", insurerId: "I001", insurerName: "Blue Cross Blue Shield", policyNumber: "BCBS12345678", dateOfBirth: "1985-06-15", active: true },
    { id: "PT002", name: "Emma Johnson", insurerId: "I002", insurerName: "Aetna", policyNumber: "ATN87654321", dateOfBirth: "1990-04-22", active: true },
    { id: "PT003", name: "James Williams", insurerId: "I003", insurerName: "Medicare", policyNumber: "MED98765432", dateOfBirth: "1955-11-10", active: true },
    { id: "PT004", name: "Sophia Brown", insurerId: "I005", insurerName: "UnitedHealthcare", policyNumber: "UHC54321678", dateOfBirth: "1978-08-30", active: true },
    { id: "PT005", name: "William Jones", insurerId: "I004", insurerName: "Medicaid", policyNumber: "MCD12378945", dateOfBirth: "2002-01-25", active: true },
    { id: "PT006", name: "Olivia Garcia", insurerId: "I006", insurerName: "Cigna", policyNumber: "CIG56781234", dateOfBirth: "1995-07-11", active: true },
    { id: "PT007", name: "Alexander Martinez", insurerId: "I001", insurerName: "Blue Cross Blue Shield", policyNumber: "BCBS87651234", dateOfBirth: "1972-12-05", active: true },
    { id: "PT008", name: "Isabella Anderson", insurerId: "I007", insurerName: "Self-Pay", policyNumber: "N/A", dateOfBirth: "1988-03-14", active: true },
    { id: "PT009", name: "Michael Thomas", insurerId: "I002", insurerName: "Aetna", policyNumber: "ATN13578642", dateOfBirth: "1983-09-28", active: true },
    { id: "PT010", name: "Emily Wilson", insurerId: "I005", insurerName: "UnitedHealthcare", policyNumber: "UHC98127634", dateOfBirth: "1968-05-19", active: true },
    { id: "PT011", name: "Daniel Taylor", insurerId: "I003", insurerName: "Medicare", policyNumber: "MED45678912", dateOfBirth: "1950-02-07", active: false },
    { id: "PT012", name: "Ava Moore", insurerId: "I006", insurerName: "Cigna", policyNumber: "CIG78945612", dateOfBirth: "1992-10-31", active: true },
  ];
};

// Generate payments data
export const generatePayments = (
  patients: Patient[],
  providers: Provider[],
  insurers: Insurer[],
  serviceCodes: ServiceCode[]
): Payment[] => {
  const payments: Payment[] = [];
  const startDate = new Date('2023-01-01');
  const endDate = new Date('2023-12-31');
  
  // Generate about 2000 payments for the year
  for (let i = 0; i < 2000; i++) {
    const sessionDate = randomDate(startDate, endDate);
    const patientIndex = Math.floor(Math.random() * patients.length);
    const patient = patients[patientIndex];
    const providerIndex = Math.floor(Math.random() * providers.filter(p => p.active).length);
    const provider = providers.filter(p => p.active)[providerIndex];
    const serviceIndex = Math.floor(Math.random() * serviceCodes.length);
    const service = serviceCodes[serviceIndex];
    
    // For self-pay patients
    const insurer = patient.insurerId === "I007" 
      ? insurers.find(i => i.id === "I007")! 
      : insurers.find(i => i.id === patient.insurerId)!;
    
    const billedAmount = service.baseRate + Math.floor(Math.random() * 50);
    const isSelfPay = insurer.id === "I007";
    
    // Calculate allowed amount (typically less than billed for insurance)
    const allowedAmount = isSelfPay 
      ? billedAmount 
      : billedAmount * (0.65 + Math.random() * 0.25); // 65-90% of billed
    
    // For insured patients: split between insurer and patient
    const patientResponsibility = isSelfPay 
      ? allowedAmount 
      : Math.floor(allowedAmount * (0.1 + Math.random() * 0.3)); // 10-40% patient responsibility
    
    const insurerResponsibility = isSelfPay 
      ? 0 
      : allowedAmount - patientResponsibility;
    
    // Based on date, determine payment status
    const daysSinceService = Math.floor((new Date().getTime() - new Date(sessionDate).getTime()) / (1000 * 3600 * 24));
    
    // Generate payment status and amounts
    let insurerPaid = 0;
    let insurerAR = 0;
    let patientPaid = 0;
    let patientAR = 0;
    let claimStatus = "Pending";
    let insurerWriteOff = 0;
    
    // Insurance payment logic
    if (!isSelfPay) {
      insurerWriteOff = billedAmount - allowedAmount;
      
      if (daysSinceService > insurer.averageDaysToPayment) {
        // 90% of claims paid after average days to payment
        if (Math.random() < 0.9) {
          insurerPaid = insurerResponsibility;
          claimStatus = "Paid";
        } else {
          // 10% of claims remain in AR
          insurerAR = insurerResponsibility;
          claimStatus = "In Process";
        }
      } else {
        insurerAR = insurerResponsibility;
        claimStatus = "In Process";
      }
    }
    
    // Patient payment logic
    if (daysSinceService > 15) {
      // 70% of patients pay after 15 days
      if (Math.random() < 0.7) {
        patientPaid = patientResponsibility;
      } else {
        patientAR = patientResponsibility;
      }
    } else {
      patientAR = patientResponsibility;
    }
    
    // Create a predictable but unique session ID
    const sessionId = `S${sessionDate.replace(/-/g, '')}${i.toString().padStart(4, '0')}`;
    
    payments.push({
      id: `PMT${i.toString().padStart(5, '0')}`,
      sessionId,
      sessionDate,
      patientId: patient.id,
      patientName: patient.name,
      providerId: provider.id,
      providerName: provider.name,
      insurerId: insurer.id,
      insurerName: insurer.name,
      serviceCode: service.code,
      serviceDescription: service.description,
      billedAmount,
      allowedAmount: Math.round(allowedAmount * 100) / 100,
      insurerResponsibility: Math.round(insurerResponsibility * 100) / 100,
      patientResponsibility: Math.round(patientResponsibility * 100) / 100,
      insurerPaid: Math.round(insurerPaid * 100) / 100,
      insurerAR: Math.round(insurerAR * 100) / 100,
      insurerWriteOff: Math.round(insurerWriteOff * 100) / 100,
      patientPaid: Math.round(patientPaid * 100) / 100,
      patientAR: Math.round(patientAR * 100) / 100,
      claimStatus,
      createdAt: sessionDate,
      updatedAt: randomDate(new Date(sessionDate), new Date()),
    });
  }
  
  return payments;
};

// Generate adjustments data
export const generateAdjustments = (
  payments: Payment[],
  adjustmentCodes: AdjustmentCode[]
): Adjustment[] => {
  const adjustments: Adjustment[] = [];
  
  // For about 30% of payments, create 1-3 adjustments
  const paymentsWithAdjustments = payments.filter(() => Math.random() < 0.3);
  
  paymentsWithAdjustments.forEach((payment, index) => {
    const numAdjustments = 1 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < numAdjustments; i++) {
      const adjustmentCodeIndex = Math.floor(Math.random() * adjustmentCodes.length);
      const adjustmentCode = adjustmentCodes[adjustmentCodeIndex];
      
      // For writeoffs, use higher amounts
      let adjustmentAmount;
      if (adjustmentCode.code.startsWith("WO")) {
        adjustmentAmount = -(Math.round((payment.patientAR * 0.8 + Math.random() * 50) * 100) / 100);
      } else if (adjustmentCode.code.startsWith("CO")) {
        adjustmentAmount = -(Math.round((payment.insurerWriteOff * (0.8 + Math.random() * 0.2)) * 100) / 100);
      } else {
        adjustmentAmount = Math.round((payment.patientResponsibility * 0.1 * (Math.random() - 0.5)) * 100) / 100;
      }
      
      const createdDate = randomDate(new Date(payment.sessionDate), new Date());
      
      adjustments.push({
        id: `ADJ${(index * 10 + i).toString().padStart(5, '0')}`,
        sessionId: payment.sessionId,
        patientId: payment.patientId,
        insurerId: payment.insurerId,
        createdDate,
        adjustmentAmount,
        adjustmentCode: adjustmentCode.code,
        adjustmentDescription: adjustmentCode.description,
        reason: adjustmentCode.reason,
        processedBy: ["System", "Billing Staff", "Supervisor"][Math.floor(Math.random() * 3)],
      });
    }
  });
  
  return adjustments;
};