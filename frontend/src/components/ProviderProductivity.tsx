import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Provider, ProviderSummary } from '@/data/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ProviderProductivityProps {
  data: ProviderSummary[];
  providers: Provider[];
}

export default function ProviderProductivity({ data, providers }: ProviderProductivityProps) {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate revenue per session
  const calculateRevenuePerSession = (provider: ProviderSummary) => {
    if (provider.sessionCount === 0) return 0;
    return provider.totalCollected / provider.sessionCount;
  };

  // Combine data with provider information
  const enhancedData = data.map(providerData => {
    const providerInfo = providers.find(p => p.id === providerData.providerId);
    return {
      ...providerData,
      specialty: providerInfo?.specialty || 'Unknown',
      active: providerInfo?.active || false,
      revenuePerSession: calculateRevenuePerSession(providerData),
    };
  }).filter(provider => provider.active);

  // Sort by total revenue
  const sortedData = [...enhancedData].sort((a, b) => b.totalCollected - a.totalCollected);

  // Prepare chart data
  const chartData = sortedData.map(provider => ({
    name: provider.providerName.replace('Dr. ', ''),
    revenue: provider.totalCollected,
    sessions: provider.sessionCount,
    revenuePerSession: provider.revenuePerSession,
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-sm">
          <p className="font-medium">{`Dr. ${payload[0].payload.name}`}</p>
          <p className="text-[hsl(var(--chart-1))]">{`Revenue: ${formatCurrency(payload[0].value)}`}</p>
          <p>{`Sessions: ${payload[0].payload.sessions}`}</p>
          <p>{`Avg. per Session: ${formatCurrency(payload[0].payload.revenuePerSession)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Provider Revenue</CardTitle>
          <CardDescription>Total collected revenue by provider</CardDescription>
        </CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} horizontal={true} vertical={false} />
              <XAxis 
                type="number"
                tickFormatter={(value) => 
                  new Intl.NumberFormat('en-US', {
                    notation: 'compact',
                    compactDisplay: 'short',
                    style: 'currency',
                    currency: 'USD',
                  }).format(value)
                }
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={100}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                name="Revenue" 
                dataKey="revenue" 
                fill="hsl(var(--chart-1))" 
                radius={[0, 4, 4, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Provider Metrics</CardTitle>
          <CardDescription>Revenue per session by provider</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead className="text-right">Sessions</TableHead>
                <TableHead className="text-right">Avg. Revenue</TableHead>
              </TableRow>
              </TableHeader>
            <TableBody>
              {sortedData.map((provider) => (
                <TableRow key={provider.providerId}>
                  <TableCell className="font-medium">{provider.providerName.replace('Dr. ', '')}</TableCell>
                  <TableCell className="text-right">{provider.sessionCount}</TableCell>
                  <TableCell className="text-right">{formatCurrency(provider.revenuePerSession)}</TableCell>    
                </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}   