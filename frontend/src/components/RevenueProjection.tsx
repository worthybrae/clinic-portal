import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SummaryMetrics } from '@/data/types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueProjectionProps {
  data: SummaryMetrics;
}

const RevenueProjection: React.FC<RevenueProjectionProps> = ({ data }) => {
  // Format currency for tooltips
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Sort monthly data by chronological order
  const sortedMonthlyData = [...data.paymentsByMonth].sort((a, b) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.indexOf(a.month) - months.indexOf(b.month);
  });

  // Calculate cumulative values for each metric
  const cumulativeData = sortedMonthlyData.reduce((acc: any[], month, index) => {
    // Get previous cumulative values or start with 0
    const prevCumulative = index > 0 ? acc[index - 1] : {
      cumulativeCollected: 0,
      cumulativeAdjustments: 0,
      cumulativeWriteOffs: 0
    };

    // Calculate adjustments amount (difference between billed and allowed)
    // In real data, this would come directly from adjustments table
    const adjustments = month.totalBilled - month.totalCollected - month.totalAR - month.totalWriteOff;

    // Accumulate values
    const cumulativeCollected = prevCumulative.cumulativeCollected + month.totalCollected;
    const cumulativeAdjustments = prevCumulative.cumulativeAdjustments + adjustments;
    const cumulativeWriteOffs = prevCumulative.cumulativeWriteOffs + month.totalWriteOff;

    acc.push({
      ...month,
      cumulativeCollected,
      cumulativeAdjustments,
      cumulativeWriteOffs,
    });

    return acc;
  }, []);

  // Determine current month (for this demo, we'll assume we're in May)
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'short' });
  const currentMonthIndex = sortedMonthlyData.findIndex(month => month.month === currentMonth);
  const actualMonths = cumulativeData.slice(0, currentMonthIndex + 1);
  
  // Calculate monthly averages based on actual data
  const avgMonthlyCollected = actualMonths.reduce((sum, month, i) => {
    if (i === 0) return month.cumulativeCollected;
    return sum + (month.cumulativeCollected - actualMonths[i-1].cumulativeCollected);
  }, 0) / actualMonths.length;
  
  const avgMonthlyAdjustments = actualMonths.reduce((sum, month, i) => {
    if (i === 0) return month.cumulativeAdjustments;
    return sum + (month.cumulativeAdjustments - actualMonths[i-1].cumulativeAdjustments);
  }, 0) / actualMonths.length;
  
  const avgMonthlyWriteOffs = actualMonths.reduce((sum, month, i) => {
    if (i === 0) return month.cumulativeWriteOffs;
    return sum + (month.cumulativeWriteOffs - actualMonths[i-1].cumulativeWriteOffs);
  }, 0) / actualMonths.length;

  // Prepare data for stacked area chart with current and projected values
  const finalData = sortedMonthlyData.map((month, index) => {
    const isPastMonth = sortedMonthlyData.indexOf(month) <= currentMonthIndex;
    const isFutureMonth = sortedMonthlyData.indexOf(month) > currentMonthIndex;
    
    // Start with zero values
    const result: any = {
      month: month.month,
      isProjection: !isPastMonth,
      
      // Actual values for past months
      currentCollected: 0,
      currentAdjustments: 0,
      currentWriteOffs: 0,
      
      // Projected values for future months
      projectedCollected: 0,
      projectedAdjustments: 0,
      projectedWriteOffs: 0
    };
    
    // Use actual values for past and current months
    if (isPastMonth) {
      result.currentCollected = cumulativeData[index].cumulativeCollected;
      result.currentAdjustments = cumulativeData[index].cumulativeAdjustments;
      result.currentWriteOffs = cumulativeData[index].cumulativeWriteOffs;
    }
    
    // Use projected values for future months
    if (isFutureMonth) {
      // Calculate projected amounts
      const monthsFromCurrent = index - currentMonthIndex;
      result.projectedCollected = cumulativeData[currentMonthIndex].cumulativeCollected + (avgMonthlyCollected * monthsFromCurrent);
      result.projectedAdjustments = cumulativeData[currentMonthIndex].cumulativeAdjustments + (avgMonthlyAdjustments * monthsFromCurrent);
      result.projectedWriteOffs = cumulativeData[currentMonthIndex].cumulativeWriteOffs + (avgMonthlyWriteOffs * monthsFromCurrent);
    }
    
    return result;
  });

  // Current position and year-end values for the summary cards
  const currentPosition = cumulativeData[currentMonthIndex] || cumulativeData[0];
  const yearEndProjections = finalData[finalData.length - 1];

  // Custom tooltip for the stacked area chart
  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{
      dataKey: string;
      value: number;
      payload: any;
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const isProjection = payload[0]?.payload.isProjection;
      
      // Calculate totals for this month
      const totalCollected = (payload.find(p => p.dataKey === 'currentCollected')?.value || 0) + 
                             (payload.find(p => p.dataKey === 'projectedCollected')?.value || 0);
      
      const totalAdjustments = (payload.find(p => p.dataKey === 'currentAdjustments')?.value || 0) + 
                               (payload.find(p => p.dataKey === 'projectedAdjustments')?.value || 0);
      
      const totalWriteOffs = (payload.find(p => p.dataKey === 'currentWriteOffs')?.value || 0) + 
                             (payload.find(p => p.dataKey === 'projectedWriteOffs')?.value || 0);
      
      return (
        <div className="bg-white p-2 border rounded shadow-sm text-xs">
          <p className="font-bold text-sm border-b pb-1 mb-1">{`${label}`}</p>
          
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            <p className="text-xs font-medium">Revenue:</p>
            <p className="text-right text-xs text-blue-600 font-medium">{formatCurrency(totalCollected)}</p>
            
            <p className="text-xs font-medium">Adjustments:</p>
            <p className="text-right text-xs text-orange-600 font-medium">{formatCurrency(totalAdjustments)}</p>
            
            <p className="text-xs font-medium">Write-offs:</p>
            <p className="text-right text-xs text-red-600 font-medium">{formatCurrency(totalWriteOffs)}</p>
          </div>
          
          <p className="text-[10px] text-slate-500 italic mt-1 text-center">
            {isProjection ? 'Projected' : 'Actual'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="md:col-span-1">
      <CardHeader className="pb-2 px-4 pt-4 sm:px-6">
        <CardTitle className="text-base sm:text-lg">Revenue Projections</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Year-to-date revenue with projections
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2 p-2 sm:p-4">
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-3 sm:mb-4">
          <div className="bg-blue-50 p-2 sm:p-3 rounded-md border border-blue-100 flex-1 min-w-[calc(50%-0.5rem)]">
            <p className="text-[10px] sm:text-xs text-slate-600 mb-1">Current Position</p>
            <p className="text-sm sm:text-lg font-bold text-blue-700">{formatCurrency(currentPosition.cumulativeCollected)}</p>
            <p className="text-[8px] sm:text-xs text-blue-600">Revenue YTD</p>
          </div>
          <div className="bg-orange-50 p-2 sm:p-3 rounded-md border border-orange-100 flex-1 min-w-[calc(50%-0.5rem)]">
            <p className="text-[10px] sm:text-xs text-slate-600 mb-1">Current Position</p>
            <p className="text-sm sm:text-lg font-bold text-orange-700">{formatCurrency(currentPosition.cumulativeCollected-currentPosition.cumulativeWriteOffs-currentPosition.cumulativeAdjustments)}</p>
            <p className="text-[8px] sm:text-xs text-orange-600">Net Profit YTD</p>
          </div>
          <div className="bg-green-50 p-2 sm:p-3 rounded-md border border-green-100 flex-1 min-w-[calc(50%-0.5rem)]">
            <p className="text-[10px] sm:text-xs text-slate-600 mb-1">Year-End Projection</p>
            <p className="text-sm sm:text-lg font-bold text-green-700">{formatCurrency(yearEndProjections.projectedCollected || yearEndProjections.currentCollected)}</p>
            <p className="text-[8px] sm:text-xs text-green-600">Target Revenue</p>
          </div>
          <div className="bg-purple-50 p-2 sm:p-3 rounded-md border border-purple-100 flex-1 min-w-[calc(50%-0.5rem)]">
            <p className="text-[10px] sm:text-xs text-slate-600 mb-1">Year-End Projection</p>
            <p className="text-sm sm:text-lg font-bold text-purple-700">{formatCurrency(yearEndProjections.projectedCollected - yearEndProjections.projectedAdjustments - yearEndProjections.projectedWriteOffs)}</p>
            <p className="text-[8px] sm:text-xs text-purple-600">Target Net Profit</p>
          </div>
        </div>
        
        <div className="h-40 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={finalData}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
              stackOffset="none"
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={9} tick={{ fontSize: 9 }}/>
              <YAxis 
                tickFormatter={(value) => 
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    notation: 'compact',
                    compactDisplay: 'short',
                  }).format(value)
                }
                axisLine={false}
                tickLine={false}
                fontSize={9}
                tick={{ fontSize: 9 }}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Stacked Revenue Areas */}
              <Area
                name="Current Revenue" 
                type="monotone"
                dataKey="currentCollected"
                stackId="1"
                fill="rgba(59, 130, 246, 0.7)" 
                stroke="rgba(59, 130, 246, 0.9)"
                strokeWidth={1}
              />
              <Area
                name="Projected Revenue" 
                type="monotone"
                dataKey="projectedCollected"
                stackId="1"
                fill="rgba(59, 130, 246, 0.3)" 
                stroke="rgba(59, 130, 246, 0.6)"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
              
              {/* Stacked Adjustments Areas */}
              <Area
                name="Current Adjustments"
                type="monotone"
                dataKey="currentAdjustments"
                stackId="2"
                fill="rgba(234, 88, 12, 0.7)"
                stroke="rgba(234, 88, 12, 0.9)"
                strokeWidth={1}
              />
              <Area
                name="Projected Adjustments"
                type="monotone"
                dataKey="projectedAdjustments"
                stackId="2"
                fill="rgba(234, 88, 12, 0.3)"
                stroke="rgba(234, 88, 12, 0.6)"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
              
              {/* Stacked Write-offs Areas */}
              <Area
                name="Current Write-offs"
                type="monotone"
                dataKey="currentWriteOffs"
                stackId="3"
                fill="rgba(220, 38, 38, 0.7)"
                stroke="rgba(220, 38, 38, 0.9)"
                strokeWidth={1}
              />
              <Area
                name="Projected Write-offs"
                type="monotone"
                dataKey="projectedWriteOffs"
                stackId="3"
                fill="rgba(220, 38, 38, 0.3)"
                stroke="rgba(220, 38, 38, 0.6)"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 mt-2 text-[8px] sm:text-xs text-slate-500">
            <div className="flex items-center">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-sm bg-blue-500 mr-1"></div>
                <span>Revenue</span>
            </div>
            <div className="flex items-center">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-sm bg-orange-500 mr-1"></div>
                <span>Adjustments</span>
            </div>
            <div className="flex items-center">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-sm bg-red-500 mr-1"></div>
                <span>Write-offs</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueProjection;