import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Payment } from '@/data/types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Clock } from 'lucide-react';

interface PatientARDistributionProps {
  payments: Payment[];
}

const PatientARDistribution = ({ payments }: PatientARDistributionProps) => {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate days outstanding for each payment
  const calculateDaysOutstanding = (sessionDate: string) => {
    const serviceDate = new Date(sessionDate);
    const today = new Date();
    return Math.floor((today.getTime() - serviceDate.getTime()) / (1000 * 3600 * 24));
  };

  // Create data for the AR aging distribution
  const createAgingData = () => {
    // Filter payments with AR > 0 (either patient or insurer)
    const paymentsWithAR = payments.filter(
      payment => payment.patientAR > 0 || payment.insurerAR > 0
    );
    
    // Calculate days outstanding for each payment
    const paymentAging = paymentsWithAR.map(payment => ({
      daysOutstanding: calculateDaysOutstanding(payment.sessionDate),
      patientAR: payment.patientAR,
      insurerAR: payment.insurerAR,
      totalAR: payment.patientAR + payment.insurerAR,
      insurerName: payment.insurerName,
      sessionId: payment.sessionId
    }));
    
    // Define aging buckets (0-30, 31-60, 61-90, 91-120, 120+)
    const agingBuckets = [
      { name: '0-30 days', range: [0, 30], patientTotal: 0, insurerTotal: 0 },
      { name: '31-60 days', range: [31, 60], patientTotal: 0, insurerTotal: 0 },
      { name: '61-90 days', range: [61, 90], patientTotal: 0, insurerTotal: 0 },
      { name: '91-120 days', range: [91, 120], patientTotal: 0, insurerTotal: 0 },
      { name: '120+ days', range: [121, 999], patientTotal: 0, insurerTotal: 0 }
    ];
    
    // Group AR by aging buckets
    paymentAging.forEach(payment => {
      const bucket = agingBuckets.find(
        b => payment.daysOutstanding >= b.range[0] && payment.daysOutstanding <= b.range[1]
      );
      
      if (bucket) {
        bucket.patientTotal += payment.patientAR;
        bucket.insurerTotal += payment.insurerAR;
      }
    });
    
    // Format for chart display
    return agingBuckets.map(bucket => ({
      name: bucket.name,
      patientAR: Math.round(bucket.patientTotal),
      insurerAR: Math.round(bucket.insurerTotal),
      totalAR: Math.round(bucket.patientTotal + bucket.insurerTotal)
    }));
  };

  // Calculate key metrics
  const calculateMetrics = () => {
    const paymentsWithAR = payments.filter(
      payment => payment.patientAR > 0 || payment.insurerAR > 0
    );
    
    // Total AR amounts
    const totalPatientAR = paymentsWithAR.reduce((sum, p) => sum + p.patientAR, 0);
    const totalInsurerAR = paymentsWithAR.reduce((sum, p) => sum + p.insurerAR, 0);
    const totalAR = totalPatientAR + totalInsurerAR;
    
    // Average days outstanding weighted by AR amount
    const weightedDays = paymentsWithAR.reduce((sum, payment) => {
      const daysOutstanding = calculateDaysOutstanding(payment.sessionDate);
      const totalPaymentAR = payment.patientAR + payment.insurerAR;
      return sum + (daysOutstanding * totalPaymentAR);
    }, 0);
    
    const avgDaysOutstanding = Math.round(totalAR > 0 ? weightedDays / totalAR : 0);
    
    // Percentage of AR over 90 days
    const arOver90Days = paymentsWithAR.reduce((sum, payment) => {
      const daysOutstanding = calculateDaysOutstanding(payment.sessionDate);
      if (daysOutstanding > 90) {
        return sum + payment.patientAR + payment.insurerAR;
      }
      return sum;
    }, 0);
    
    const percentAROver90Days = totalAR > 0 ? (arOver90Days / totalAR) * 100 : 0;
    
    return {
      totalAR,
      totalPatientAR,
      totalInsurerAR,
      avgDaysOutstanding,
      percentAROver90Days: Math.round(percentAROver90Days * 10) / 10,
      arOver90Days,
      claimCount: paymentsWithAR.length
    };
  };

  const agingData = createAgingData();
  const metrics = calculateMetrics();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-sm">
          <p className="font-medium">{`${label}`}</p>
          <p className="text-blue-600">{`Insurer AR: ${formatCurrency(payload[0].value)}`}</p>
          <p className="text-orange-500">{`Patient AR: ${formatCurrency(payload[1].value)}`}</p>
          <p className="text-purple-600 font-medium">{`Total: ${formatCurrency(payload[0].value + payload[1].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AR Aging Distribution</CardTitle>
        <CardDescription>Distribution of accounts receivable by days outstanding</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="flex items-center px-3 py-2 bg-purple-50 rounded-md border border-purple-100">
            <div className="text-purple-500 text-xl font-semibold mr-2">$</div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total AR</p>
              <p className="text-lg font-bold">{formatCurrency(metrics.totalAR)}</p>
              <p className="text-xs text-purple-600">Both patient and insurer</p>
            </div>
          </div>
          
          <div className="flex items-center px-3 py-2 bg-amber-50 rounded-md border border-amber-100">
            <div className="mr-2">
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Avg Days Outstanding</p>
              <p className="text-lg font-bold">{metrics.avgDaysOutstanding} days</p>
              <p className="text-xs text-amber-700">Weighted by AR amount</p>
            </div>
          </div>
          
          <div className="flex items-center px-3 py-2 bg-red-50 rounded-md border border-red-100">
            <div className="mr-2">
              <TrendingUp className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">AR Over 90 Days</p>
              <p className="text-lg font-bold">{metrics.percentAROver90Days}%</p>
              <p className="text-xs text-red-700">{formatCurrency(metrics.arOver90Days)}</p>
            </div>
          </div>
        </div>
        
        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={agingData}
              margin={{
                top: 10,
                right: 30,
                left: 10,
                bottom: 5,
              }}
              stackOffset="none"
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                tickLine={false}
                axisLine={true}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value)}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <defs>
                <linearGradient id="colorInsurerAR" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
                </linearGradient>
                <linearGradient id="colorPatientAR" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="insurerAR" 
                stackId="1"
                name="Insurer AR"
                stroke="#3b82f6" 
                fill="url(#colorInsurerAR)"
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="patientAR" 
                stackId="1"
                name="Patient AR"
                stroke="#f97316" 
                fill="url(#colorPatientAR)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-2 text-xs text-slate-500">
          <p>This chart shows the distribution of both patient and insurer accounts receivable (AR) by days outstanding.</p>
          <p>High amounts in older aging buckets (90+ days) indicate potential collection issues that may require attention.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientARDistribution;