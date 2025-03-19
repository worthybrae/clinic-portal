import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { mockData } from '@/data/mock-data';

// Import components
import PatientARDistribution from '@/components/PatientARDistribution';
import FinancialSummaryCards from '@/components/FinancialSummaryCards';
import InsurerARAgingCard from '@/components/InsurerARAgingCard';
import RevenueProjection from '@/components/RevenueProjection';
import MonthlyAdjustmentsExplorer from '@/components/MonthlyAdjustmentsExplorer';
// Main Dashboard Component
const Dashboard: React.FC = () => {
  const [_, setSelectedYear] = useState<string>("2025");
  
  // Get data from mock data
  const data = mockData.summaryMetrics;
  const payments = mockData.payments;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="2025" onValueChange={setSelectedYear}>
        <TabsContent value="2025" className="mt-0">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Financial Overview 2025</h3>
          </div>
          
          {/* Financial Summary Cards Row */}
          <FinancialSummaryCards data={data} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <RevenueProjection data={data} />
            {/* Patient AR Distribution */}
            <PatientARDistribution payments={payments} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Insurer AR Aging Card */}
            <InsurerARAgingCard data={data} />
            
            {/* Revenue Projection - NEW COMPONENT */}
            <MonthlyAdjustmentsExplorer data={data} />
          </div>
        </TabsContent>
        
        <TabsContent value="2024" className="mt-0">
          <h3 className="text-2xl font-bold mb-6">Financial Overview 2024</h3>
          <Card className="h-96 flex items-center justify-center">
            <CardContent>
              <p className="text-slate-500">2024 data visualization would appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="2023" className="mt-0">
          <h3 className="text-2xl font-bold mb-6">Financial Overview 2023</h3>
          <Card className="h-96 flex items-center justify-center">
            <CardContent>
              <p className="text-slate-500">2023 data visualization would appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;