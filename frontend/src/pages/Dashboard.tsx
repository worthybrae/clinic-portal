// Main Dashboard Component Updates
// Update the Dashboard.tsx file to improve mobile layout

import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockData } from '@/data/mock-data';

// Import components
import PatientARDistribution from '@/components/PatientARDistribution';
import FinancialSummaryCards from '@/components/FinancialSummaryCards';
import InsurerARAgingCard from '@/components/InsurerARAgingCard';
import RevenueProjection from '@/components/RevenueProjection';
import MonthlyAdjustmentsExplorer from '@/components/MonthlyAdjustmentsExplorer';

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const [_, setActiveYear] = useState<string>("2025");
  
  // Get data from mock data
  const data = mockData.summaryMetrics;
  const payments = mockData.payments;

  return (
    <div className="space-y-4 sm:space-y-6">
      <Tabs defaultValue="2025" onValueChange={setActiveYear} className="w-full">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-xl sm:text-2xl font-bold">Financial Overview</h3>
          <TabsList className="h-9">
            <TabsTrigger value="2025" className="px-2 sm:px-3">2025</TabsTrigger>
            <TabsTrigger value="2024" className="px-2 sm:px-3">2024</TabsTrigger>
            <TabsTrigger value="2023" className="px-2 sm:px-3">2023</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="2025" className="mt-0">
          {/* Financial Summary Cards Row */}
          <FinancialSummaryCards data={data} />
          
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 my-4 sm:my-6">
            <RevenueProjection data={data} />
            {/* Patient AR Distribution */}
            <MonthlyAdjustmentsExplorer data={data} />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Insurer AR Aging Card */}
            <InsurerARAgingCard data={data} />
            
            {/* Monthly Adjustments Explorer */}
            <PatientARDistribution payments={payments} />
          </div>
        </TabsContent>
        
        <TabsContent value="2024" className="mt-0">
          <Card className="h-64 sm:h-96 flex items-center justify-center">
            <p className="text-slate-500">2024 data visualization would appear here.</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="2023" className="mt-0">
          <Card className="h-64 sm:h-96 flex items-center justify-center">
            <p className="text-slate-500">2023 data visualization would appear here.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;