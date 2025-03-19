// mock-data.ts - Main module that puts it all together
import {
    generateProviders, generateInsurers, generateServiceCodes,
    generateAdjustmentCodes, generatePatients, generatePayments,
    generateAdjustments
  } from './data-generators';
  import { calculateSummaryMetrics } from './analytics';
  
  // Generate all the data
  const providers = generateProviders();
  const insurers = generateInsurers();
  const serviceCodes = generateServiceCodes();
  const adjustmentCodes = generateAdjustmentCodes();
  const patients = generatePatients();
  const payments = generatePayments(patients, providers, insurers, serviceCodes);
  const adjustments = generateAdjustments(payments, adjustmentCodes);
  
  // Calculate summary metrics
  const summaryMetrics = calculateSummaryMetrics(payments, providers, insurers, serviceCodes, adjustments);
  
  // Export all the data and calculated metrics
  export const mockData = {
    providers,
    patients,
    insurers,
    serviceCodes,
    adjustmentCodes,
    payments,
    adjustments,
    summaryMetrics,
  };
  
  // Export individual generated data for modular access
  export {
    providers,
    patients,
    insurers,
    serviceCodes,
    adjustmentCodes,
    payments,
    adjustments,
    summaryMetrics
  };