import React from 'react';
import { SummaryMetrics } from '@/data/types';

interface InsurerARAgingCardProps {
  data: SummaryMetrics;
}

const InsurerARAgingCard: React.FC<InsurerARAgingCardProps> = ({ data }) => {
  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get insurer data
  const insurerData = data.paymentsByInsurer.filter(insurer => insurer.insurerName !== "Self-Pay");
  
  // Get top 3 insurers by AR
  const top3ARInsurers = [...insurerData]
    .sort((a, b) => b.totalAR - a.totalAR)
    .slice(0, 10);

  // Total AR amount
  const totalAR = insurerData.reduce((sum, insurer) => sum + insurer.totalAR, 0);

  return (
    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
      <div className="text-lg font-semibold text-amber-700 mb-1">Insurer Accounts Receivable</div>
      
      {/* Total AR amount emphasized */}
      <div className="text-2xl font-bold text-amber-900 mb-3">
        {formatCurrency(totalAR)}
        <span className="text-base font-normal text-amber-700 ml-2">Total Insurer AR</span>
      </div>
      
      {/* Top 3 Insurers by AR with aging buckets */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-600 mb-1">Top 6 Insurers by AR</div>
        {top3ARInsurers.map((insurer, index) => {
          // Calculate aging buckets (in a real app, this would come from actual data)
          const total = insurer.totalAR;
          const current = total * 0.3; // 30% current
          const days30 = total * 0.4; // 40% in 30 day bucket
          const days60 = total * 0.2; // 20% in 60 day bucket
          const days90 = total * 0.1; // 10% in 90+ day bucket
          const percentOfTotal = (insurer.totalAR / totalAR) * 100;
          
          return (
            <div key={index} className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-1 ${
                    index === 0 ? 'bg-red-500' : index === 1 ? 'bg-amber-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className="text-xs font-medium text-slate-700">{insurer.insurerName}</span>
                </div>
                <div className="text-xs font-medium">
                  <span className="text-slate-700">{formatCurrency(insurer.totalAR)}</span>
                  <span className="text-slate-500 ml-1">({percentOfTotal.toFixed(1)}% of total)</span>
                </div>
              </div>
              
              {/* Aging buckets as horizontal stacked bar */}
              <div className="flex h-3 w-full rounded-sm overflow-hidden">
                <div className="bg-green-500" style={{ width: `${(current / total) * 100}%` }}></div>
                <div className="bg-yellow-400" style={{ width: `${(days30 / total) * 100}%` }}></div>
                <div className="bg-orange-500" style={{ width: `${(days60 / total) * 100}%` }}></div>
                <div className="bg-red-500" style={{ width: `${(days90 / total) * 100}%` }}></div>
              </div>
              
              {/* Aging bucket amounts */}
              <div className="flex text-xs justify-between mt-1">
                <span className="text-green-700">{formatCurrency(current)}</span>
                <span className="text-yellow-700">{formatCurrency(days30)}</span>
                <span className="text-orange-700">{formatCurrency(days60)}</span>
                <span className="text-red-700">{formatCurrency(days90)}</span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Legend for aging buckets */}
      <div className="grid grid-cols-4 gap-1 text-xs mt-3">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 mr-1 rounded-sm"></div>
          <span className="text-slate-600">Current</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-400 mr-1 rounded-sm"></div>
          <span className="text-slate-600">30 Days</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-orange-500 mr-1 rounded-sm"></div>
          <span className="text-slate-600">60 Days</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 mr-1 rounded-sm"></div>
          <span className="text-slate-600">90+ Days</span>
        </div>
      </div>
    </div>
  );
};

export default InsurerARAgingCard;