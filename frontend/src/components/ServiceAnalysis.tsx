import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ServiceSummary } from '@/data/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ServiceAnalysisProps {
  data: ServiceSummary[];
}

export default function ServiceAnalysis({ data }: ServiceAnalysisProps) {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate collection rate
  const calculateCollectionRate = (service: ServiceSummary) => {
    if (service.totalBilled === 0) return 0;
    return (service.totalCollected / service.totalBilled) * 100;
  };

  // Sort by total revenue
  const sortedData = [...data].sort((a, b) => b.totalCollected - a.totalCollected);

  // Prepare data for the chart (revenue distribution)
  const chartData = sortedData.map(service => ({
    name: service.serviceCode,
    description: service.serviceDescription,
    value: service.totalCollected,
    collectionRate: calculateCollectionRate(service),
    sessionCount: service.sessionCount,
    totalAR: service.totalAR,
  }));

  // Colors for the pie chart
  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
    'hsl(193, 63%, 50%)',
    'hsl(223, 57%, 52%)',
    'hsl(133, 50%, 45%)',
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-sm">
          <p className="font-medium">{`${payload[0].payload.name}: ${payload[0].payload.description}`}</p>
          <p style={{ color: payload[0].color }}>{`Revenue: ${formatCurrency(payload[0].value)}`}</p>
          <p>{`Sessions: ${payload[0].payload.sessionCount}`}</p>
          <p>{`Collection Rate: ${payload[0].payload.collectionRate.toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  const totalRevenue = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Revenue by Service Code</CardTitle>
          <CardDescription>Revenue distribution across service types</CardDescription>
        </CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => 
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                layout="vertical" 
                verticalAlign="middle" 
                align="right"
                wrapperStyle={{ paddingLeft: '20px' }}
                formatter={(value, entry: any) => {
                  const { payload } = entry;
                  const percentage = ((payload.value / totalRevenue) * 100).toFixed(1);
                  return `${value} - ${percentage}%`;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Service Metrics</CardTitle>
          <CardDescription>Performance by service code</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead className="text-right">Sessions</TableHead>
                <TableHead className="text-right">AR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((service) => (
                <TableRow key={service.serviceCode}>
                  <TableCell className="font-medium" title={service.serviceDescription}>
                    {service.serviceCode}
                  </TableCell>
                  <TableCell className="text-right">{service.sessionCount}</TableCell>
                  <TableCell className="text-right">{formatCurrency(service.totalAR)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}