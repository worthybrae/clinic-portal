import React from 'react';
import { SummaryMetrics } from '@/data/types';
import TotalRevenueCard from './TotalRevenueCard';

interface FinancialSummaryCardsProps {
  data: SummaryMetrics;
}

const FinancialSummaryCards: React.FC<FinancialSummaryCardsProps> = ({ data }) => {
  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate totals across all payment records (all patient responsibility, regardless of insurer)
  const patientPaid = data.paymentsByInsurer.reduce((sum, insurer) => {
    if (insurer.insurerName === "Self-Pay") {
      return sum + insurer.totalPaid;
    } else {
      return sum + (insurer.totalPaid * 0.2);
    }
  }, 0);
  
  const patientAR = data.paymentsByInsurer.reduce((sum, insurer) => {
    if (insurer.insurerName === "Self-Pay") {
      return sum + insurer.totalAR;
    } else {
      return sum + (insurer.totalAR * 0.2); 
    }
  }, 0);
  
  const patientTotalRevenue = patientPaid + patientAR;

  // Calculate insurer data
  const insurerData = data.paymentsByInsurer.filter(insurer => insurer.insurerName !== "Self-Pay");
  const insurerPaid = insurerData.reduce((sum, insurer) => sum + insurer.totalPaid, 0);
  const insurerAR = insurerData.reduce((sum, insurer) => sum + insurer.totalAR, 0);
  const insurerWriteOff = insurerData.reduce((sum, insurer) => sum + insurer.totalWriteOff, 0);
  const insurerAdjustments = insurerData.reduce((sum, insurer) => sum + (insurer.totalBilled - insurer.totalAllowed), 0);
  const insurerTotalExpectedRevenue = insurerPaid + insurerAR + insurerWriteOff + insurerAdjustments;
  
  // Calculate percentages for the stacked bar
  const insurerPaidPercent = (insurerPaid / insurerTotalExpectedRevenue) * 100;
  const insurerARPercent = (insurerAR / insurerTotalExpectedRevenue) * 100;
  const insurerWriteOffPercent = (insurerWriteOff / insurerTotalExpectedRevenue) * 100;
  const insurerAdjustmentsPercent = (insurerAdjustments / insurerTotalExpectedRevenue) * 100;
  
  // Patient percentages
  const patientPaidPercent = (patientPaid / patientTotalRevenue) * 100;
  const patientARPercent = (patientAR / patientTotalRevenue) * 100;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4 mb-4 sm:mb-6">
      {/* Insurer Expected Revenue Card */}
      <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
        <div className="text-base sm:text-lg font-semibold text-blue-700 mb-1">Insurer Expected Revenue</div>
        <div className="text-xl sm:text-2xl font-bold text-blue-900 mb-2 sm:mb-3">{formatCurrency(insurerTotalExpectedRevenue)}</div>
        
        {/* Stacked progress bar */}
        <div className="h-6 sm:h-8 w-full bg-gray-100 rounded-md overflow-hidden flex mb-2">
          <div 
            className="h-full bg-green-500 flex items-center justify-center"
            style={{ width: `${insurerPaidPercent}%` }}
          >
            <span className="text-[10px] sm:text-xs font-bold text-white px-1">{Math.round(insurerPaidPercent)}%</span>
          </div>
          <div 
            className="h-full bg-orange-400 flex items-center justify-center"
            style={{ width: `${insurerARPercent}%` }}
          >
            <span className="text-[10px] sm:text-xs font-bold text-white px-1">{Math.round(insurerARPercent)}%</span>
          </div>
          <div 
            className="h-full bg-red-300 flex items-center justify-center"
            style={{ width: `${insurerAdjustmentsPercent}%` }}
          >
            <span className="text-[10px] sm:text-xs font-bold text-white px-1">{Math.round(insurerAdjustmentsPercent)}%</span>
          </div>
          <div 
            className="h-full bg-red-600 flex items-center justify-center"
            style={{ width: `${insurerWriteOffPercent}%` }}
          >
            <span className="text-[10px] sm:text-xs font-bold text-white px-1">{Math.round(insurerWriteOffPercent)}%</span>
          </div>
        </div>
        
        {/* Legend */}
        <div className="grid grid-cols-2 gap-x-2 sm:gap-x-4 gap-y-1 text-[10px] sm:text-xs mb-1">
          <div className="flex items-center">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 mr-1 rounded-sm"></div>
            <span className="text-slate-600 truncate">Collected: {formatCurrency(insurerPaid)}</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-400 mr-1 rounded-sm"></div>
            <span className="text-slate-600 truncate">AR: {formatCurrency(insurerAR)}</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-300 mr-1 rounded-sm"></div>
            <span className="text-slate-600 truncate">Adjustments: {formatCurrency(insurerAdjustments)}</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-600 mr-1 rounded-sm"></div>
            <span className="text-slate-600 truncate">Write-offs: {formatCurrency(insurerWriteOff)}</span>
          </div>
        </div>
      </div>
      
      {/* Patient Expected Revenue Card */}
      <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200">
        <div className="text-base sm:text-lg font-semibold text-green-700 mb-1">Patient Expected Revenue</div>
        <div className="text-xl sm:text-2xl font-bold text-green-900 mb-2 sm:mb-3">{formatCurrency(patientTotalRevenue)}</div>
        
        {/* Stacked progress bar */}
        <div className="h-6 sm:h-8 w-full bg-gray-100 rounded-md overflow-hidden flex mb-2">
          <div 
            className="h-full bg-green-500 flex items-center justify-center"
            style={{ width: `${patientPaidPercent}%` }}
          >
            <span className="text-[10px] sm:text-xs font-bold text-white px-1">{Math.round(patientPaidPercent)}%</span>
          </div>
          <div 
            className="h-full bg-orange-400 flex items-center justify-center"
            style={{ width: `${patientARPercent}%` }}
          >
            <span className="text-[10px] sm:text-xs font-bold text-white px-1">{Math.round(patientARPercent)}%</span>
          </div>
        </div>
        
        {/* Legend */}
        <div className="grid grid-cols-2 gap-x-2 sm:gap-x-4 gap-y-1 text-[10px] sm:text-xs mb-1">
          <div className="flex items-center">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 mr-1 rounded-sm"></div>
            <span className="text-slate-600 truncate">Collected: {formatCurrency(patientPaid)}</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-400 mr-1 rounded-sm"></div>
            <span className="text-slate-600 truncate">Outstanding AR: {formatCurrency(patientAR)}</span>
          </div>
        </div>
      </div>
      
      {/* Total Revenue Card (New component) */}
      <TotalRevenueCard data={data} />
    </div>
  );
};

export default FinancialSummaryCards;