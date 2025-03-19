import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SummaryMetrics } from '@/data/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthlyAdjustmentsExplorerProps {
  data: SummaryMetrics;
}

const MonthlyAdjustmentsExplorer: React.FC<MonthlyAdjustmentsExplorerProps> = ({ data }) => {
  // Format currency
  const formatCurrency = (value: number, colorize = false) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
    
    if (!colorize) return formatted;
    
    return value < 0 
      ? <span className="text-red-600">{formatted}</span> 
      : <span className="text-green-600">{formatted}</span>;
  };

  // Get current date for default month selection
  const currentDate = new Date();
  const currentMonthIndex = currentDate.getMonth();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // State for selected month
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(currentMonthIndex);
  const selectedMonth = monthNames[selectedMonthIndex];

  // Sort monthly data by chronological order
  const sortedMonthlyData = [...data.paymentsByMonth].sort((a, b) => {
    return monthNames.indexOf(a.month) - monthNames.indexOf(b.month);
  });

  // Calculate monthly data with adjustments
  const monthlyDataWithAdjustments = sortedMonthlyData.map(month => {
    // Calculate adjustments amount (difference between billed and allowed)
    // For this demo, we'll calculate adjustments as a percentage of the billed amount
    const adjustments = month.totalBilled * 0.25; // 25% average adjustment rate
    const writeOffs = month.totalWriteOff;
    
    // Add some variability to adjustments
    const contractualAdjustments = adjustments * (0.7 + Math.random() * 0.1); // ~75% of adjustments
    const denials = adjustments * (0.2 + Math.random() * 0.1); // ~25% of adjustments
    const otherAdjustments = adjustments - contractualAdjustments - denials; // remainder
    
    const totalAdjustments = contractualAdjustments + denials + otherAdjustments + writeOffs;
    const netRevenue = month.totalCollected;
    const adjustmentRate = (totalAdjustments / month.totalBilled * 100).toFixed(1);
    
    return {
      month: month.month,
      originalBilled: month.totalBilled,
      contractualAdjustments: -Math.round(contractualAdjustments),
      denials: -Math.round(denials),
      otherAdjustments: -Math.round(otherAdjustments),
      writeOffs: -Math.round(writeOffs),
      totalAdjustments: -Math.round(totalAdjustments),
      netRevenue: Math.round(netRevenue),
      adjustmentRate
    };
  });

  // Get selected month data
  const selectedMonthData = monthlyDataWithAdjustments.find(m => m.month === selectedMonth) || monthlyDataWithAdjustments[0];

  // Navigation handlers
  const goToPreviousMonth = () => {
    setSelectedMonthIndex((prevIndex) => (prevIndex === 0 ? 11 : prevIndex - 1));
  };

  const goToNextMonth = () => {
    setSelectedMonthIndex((prevIndex) => (prevIndex === 11 ? 0 : prevIndex + 1));
  };

  return (
    <Card className="md:col-span-1">
      <CardHeader className="pb-2 px-4 pt-4 sm:px-6">
        <CardTitle className="text-base sm:text-lg">Revenue Adjustments Explorer</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Monthly breakdown of revenue adjustments
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2 p-2 sm:p-4">
        <div className="bg-gray-50 rounded-lg border p-3 sm:p-4 mb-3 sm:mb-4">
          {/* Month navigation header */}
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <button 
              onClick={goToPreviousMonth}
              className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
            </button>
            
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">{selectedMonth}</h3>
            
            <button 
              onClick={goToNextMonth}
              className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
            </button>
          </div>
          
          {/* Monthly breakdown */}
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex justify-between items-center border-b pb-1.5 sm:pb-2">
              <span className="text-xs sm:text-sm font-medium">Original Billed:</span>
              <span className="text-xs sm:text-sm text-blue-600 font-medium">{formatCurrency(selectedMonthData.originalBilled)}</span>
            </div>
            
            <div className="flex justify-between items-center text-red-600">
              <span className="text-xs sm:text-sm font-medium">Contractual Adjustments:</span>
              <span className="text-xs sm:text-sm font-medium">{formatCurrency(selectedMonthData.contractualAdjustments)}</span>
            </div>
            
            <div className="flex justify-between items-center text-orange-600">
              <span className="text-xs sm:text-sm font-medium">Denials:</span>
              <span className="text-xs sm:text-sm font-medium">{formatCurrency(selectedMonthData.denials)}</span>
            </div>
            
            <div className="flex justify-between items-center text-yellow-600">
              <span className="text-xs sm:text-sm font-medium">Other Adjustments:</span>
              <span className="text-xs sm:text-sm font-medium">{formatCurrency(selectedMonthData.otherAdjustments)}</span>
            </div>
            
            <div className="flex justify-between items-center text-purple-600">
              <span className="text-xs sm:text-sm font-medium">Write-offs:</span>
              <span className="text-xs sm:text-sm font-medium">{formatCurrency(selectedMonthData.writeOffs)}</span>
            </div>
            
            <div className="flex justify-between items-center border-t border-b py-1.5 sm:py-2 text-red-600 font-semibold">
              <span className="text-xs sm:text-sm">Total Adjustments:</span>
              <span className="text-xs sm:text-sm">{formatCurrency(selectedMonthData.totalAdjustments)}</span>
            </div>
            
            <div className="flex justify-between items-center text-green-600 font-semibold">
              <span className="text-xs sm:text-sm">Net Revenue:</span>
              <span className="text-xs sm:text-sm">{formatCurrency(selectedMonthData.netRevenue)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm font-medium">Adjustment Rate:</span>
              <span className="text-xs sm:text-sm font-medium">{selectedMonthData.adjustmentRate}%</span>
            </div>
          </div>
          
          {/* Month-over-month comparison */}
          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t">
            <h4 className="text-[10px] sm:text-sm font-semibold text-gray-600 mb-1 sm:mb-2">Month-over-Month Change</h4>
            <div className="flex justify-between items-center">
              <span className="text-[10px] sm:text-xs">Net Revenue:</span>
              <span className="text-[10px] sm:text-xs font-medium text-green-600">+3.2% from previous month</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] sm:text-xs">Adjustment Rate:</span>
              <span className="text-[10px] sm:text-xs font-medium text-red-600">+1.5% from previous month</span>
            </div>
          </div>
        </div>
        
        <div className="text-[8px] sm:text-xs text-slate-500 italic text-center">
          Use the arrows to navigate between months
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyAdjustmentsExplorer;