import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MonthSummary } from '@/data/types';

interface RevenueChartProps {
  data: MonthSummary[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  // Format currency for tooltips
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Sort data by month index
  const sortedData = [...data].sort((a, b) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.indexOf(a.month) - months.indexOf(b.month);
  });

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-sm">
          <p className="font-medium">{`${payload[0].payload.month} ${payload[0].payload.year}`}</p>
          <p className="text-[hsl(var(--chart-1))]">{`Collected: ${formatCurrency(payload[0].value)}`}</p>
          <p className="text-[hsl(var(--chart-2))]">{`AR: ${formatCurrency(payload[1].value)}`}</p>
          <p className="text-muted-foreground">{`Sessions: ${payload[0].payload.sessionCount}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Monthly Revenue</CardTitle>
        <CardDescription>Collection vs. outstanding AR by month</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="month" />
            <YAxis 
              tickFormatter={(value) => 
                new Intl.NumberFormat('en-US', {
                  notation: 'compact',
                  compactDisplay: 'short',
                  style: 'currency',
                  currency: 'USD',
                }).format(value)
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              name="Collected" 
              dataKey="totalCollected" 
              stackId="a" 
              fill="hsl(var(--chart-1))" 
              radius={[4, 4, 0, 0]} 
            />
            <Bar 
              name="Outstanding AR" 
              dataKey="totalAR" 
              stackId="a" 
              fill="hsl(var(--chart-2))" 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}