import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthSummary } from '@/data/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PaymentTrendsProps {
  data: MonthSummary[];
}

export default function PaymentTrends({ data }: PaymentTrendsProps) {
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

  // Calculate collection rate for each month
  const trendData = sortedData.map(month => {
    const collectionRate = month.totalBilled === 0 
      ? 0 
      : (month.totalCollected / month.totalBilled) * 100;
      
    const writeOffRate = month.totalBilled === 0
      ? 0
      : (month.totalWriteOff / month.totalBilled) * 100;
      
    return {
      ...month,
      collectionRate,
      writeOffRate,
      averagePerSession: month.sessionCount === 0 
        ? 0 
        : month.totalCollected / month.sessionCount
    };
  });

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-sm">
          <p className="font-medium">{`${label} ${payload[0].payload.year}`}</p>
          <p className="text-[hsl(var(--chart-1))]">{`Collection Rate: ${payload[0].value.toFixed(1)}%`}</p>
          <p className="text-[hsl(var(--chart-2))]">{`Write-off Rate: ${payload[1].value.toFixed(1)}%`}</p>
          <p className="text-[hsl(var(--chart-3))]">{`Avg. Per Session: ${formatCurrency(payload[2].value)}`}</p>
          <p className="text-muted-foreground">{`Sessions: ${payload[0].payload.sessionCount}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid gap-4 grid-cols-1">
      <Card>
        <CardHeader>
          <CardTitle>Financial Trends</CardTitle>
          <CardDescription>Collection rate, write-off rate, and average revenue per session</CardDescription>
        </CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trendData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="month" />
              <YAxis 
                yAxisId="left"
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]}
                orientation="left"
              />
              <YAxis 
                yAxisId="right"
                tickFormatter={(value) => 
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(value)
                }
                orientation="right"
                domain={[0, 'dataMax + 20']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                name="Collection Rate"
                dataKey="collectionRate"
                stroke="hsl(var(--chart-1))"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line
                yAxisId="left"
                type="monotone"
                name="Write-off Rate"
                dataKey="writeOffRate"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                name="Avg. Per Session"
                dataKey="averagePerSession"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}