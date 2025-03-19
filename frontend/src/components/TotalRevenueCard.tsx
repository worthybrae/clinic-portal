import React from 'react';
import { SummaryMetrics } from '@/data/types';

interface TotalRevenueCardProps {
  data: SummaryMetrics;
}

const TotalRevenueCard: React.FC<TotalRevenueCardProps> = ({ data }) => {
  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate total revenue components
  const totalCollected = data.totalCollected;
  const totalAR = data.totalAR;
  const totalWriteOffs = data.totalWriteOffs;
  
  // Calculate adjustments (typically the difference between billed and allowed)
  const totalAdjustments = data.paymentsByInsurer.reduce((sum, insurer) => {
    if (insurer.insurerName !== "Self-Pay") {
      return sum + (insurer.totalBilled - insurer.totalAllowed);
    }
    return sum;
  }, 0);

  // Calculate total expected revenue
  const totalRevenue = totalCollected + totalAR + totalWriteOffs + totalAdjustments;
  
  // Calculate percentages for the stacked bar
  const collectedPercent = (totalCollected / totalRevenue) * 100;
  const arPercent = (totalAR / totalRevenue) * 100;
  const writeOffPercent = (totalWriteOffs / totalRevenue) * 100;
  const adjustmentsPercent = (totalAdjustments / totalRevenue) * 100;

  return (
    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
      <div className="text-lg font-semibold text-purple-700 mb-1">Total Expected Revenue</div>
      <div className="text-2xl font-bold text-purple-900 mb-3">{formatCurrency(totalRevenue)}</div>
      
      {/* Stacked progress bar */}
      <div className="h-8 w-full bg-gray-100 rounded-md overflow-hidden flex mb-2">
        <div 
          className="h-full bg-green-500 flex items-center justify-center"
          style={{ width: `${collectedPercent}%` }}
        >
          <span className="text-xs font-bold text-white px-1">{Math.round(collectedPercent)}%</span>
        </div>
        <div 
          className="h-full bg-orange-400 flex items-center justify-center"
          style={{ width: `${arPercent}%` }}
        >
          <span className="text-xs font-bold text-white px-1">{Math.round(arPercent)}%</span>
        </div>
        <div 
          className="h-full bg-red-300 flex items-center justify-center"
          style={{ width: `${adjustmentsPercent}%` }}
        >
          <span className="text-xs font-bold text-white px-1">{Math.round(adjustmentsPercent)}%</span>
        </div>
        <div 
          className="h-full bg-red-600 flex items-center justify-center"
          style={{ width: `${writeOffPercent}%` }}
        >
          <span className="text-xs font-bold text-white px-1">{Math.round(writeOffPercent)}%</span>
        </div>
      </div>
      
      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mb-1">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 mr-1 rounded-sm"></div>
          <span className="text-slate-600">Collected: {formatCurrency(totalCollected)}</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-orange-400 mr-1 rounded-sm"></div>
          <span className="text-slate-600">Outstanding AR: {formatCurrency(totalAR)}</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-300 mr-1 rounded-sm"></div>
          <span className="text-slate-600">Adjustments: {formatCurrency(totalAdjustments)}</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-600 mr-1 rounded-sm"></div>
          <span className="text-slate-600">Write-offs: {formatCurrency(totalWriteOffs)}</span>
        </div>
      </div>
      
      
    </div>
  );
};

export default TotalRevenueCard;