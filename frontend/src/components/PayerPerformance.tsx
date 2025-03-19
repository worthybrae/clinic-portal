import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InsurerSummary } from '@/data/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface PayerPerformanceProps {
  data: InsurerSummary[];
}

export default function PayerPerformance({ data }: PayerPerformanceProps) {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate reimbursement rate (allowed/billed)
  const calculateReimbursementRate = (insurer: InsurerSummary) => {
    return insurer.totalAllowed / insurer.totalBilled * 100;
  };

  // Calculate collection rate (paid/allowed)
  const calculateCollectionRate = (insurer: InsurerSummary) => {
    if (insurer.totalAllowed === 0) return 0;
    return insurer.totalPaid / insurer.totalAllowed * 100;
  };

  // Prepare data for the chart, excluding Self-Pay
  const chartData = data
    .filter(insurer => insurer.insurerName !== 'Self-Pay')
    .map(insurer => ({
      name: insurer.insurerName,
      reimbursementRate: calculateReimbursementRate(insurer),
      collectionRate: calculateCollectionRate(insurer),
    }))
    .sort((a, b) => b.collectionRate - a.collectionRate);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-sm">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p className="text-[hsl(var(--chart-1))]">{`Reimbursement Rate: ${payload[0].value.toFixed(1)}%`}</p>
          <p className="text-[hsl(var(--chart-2))]">{`Collection Rate: ${payload[1].value.toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Payer Performance</CardTitle>
          <CardDescription>Reimbursement and collection rates by payer</CardDescription>
        </CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 100,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                name="Reimbursement Rate" 
                dataKey="reimbursementRate" 
                fill="hsl(var(--chart-1))" 
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                name="Collection Rate" 
                dataKey="collectionRate" 
                fill="hsl(var(--chart-2))" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Payer Metrics</CardTitle>
          <CardDescription>Financial performance by insurance</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payer</TableHead>
                <TableHead className="text-right">AR</TableHead>
                <TableHead className="text-right">Write-offs</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data
                .sort((a, b) => b.totalAR - a.totalAR)
                .map((insurer) => (
                  <TableRow key={insurer.insurerId}>
                    <TableCell className="font-medium">{insurer.insurerName}</TableCell>
                    <TableCell className="text-right">{formatCurrency(insurer.totalAR)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(insurer.totalWriteOff)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}