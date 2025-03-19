import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SummaryMetrics } from "@/data/types";
import {
  ArrowUpRight,
  BadgePercent,
  BarChart2,
  Calendar,
  CircleDollarSign,
  FileBarChart,
  TrendingUp,
  Users
} from "lucide-react";

interface HomeProps {
  data: SummaryMetrics;
}

export default function Home({ data }: HomeProps) {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (percentage: number) => {
    return `${percentage.toFixed(1)}%`;
  };

  const currentMonth = new Date().toLocaleString('default', { month: 'short' });
  const currentMonthData = data.paymentsByMonth.find(month => month.month === currentMonth) || data.paymentsByMonth[data.paymentsByMonth.length - 1];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Welcome to Healthcare Analytics</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(currentMonthData.totalCollected / 30)}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2">
              <ArrowUpRight className="h-4 w-4 text-emerald-500" />
              <span className="text-emerald-500 font-medium">+5.2%</span>
              <span>from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(currentMonthData.sessionCount / 22)}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2">
              <span className="font-medium">Completion rate:</span>
              <span>92%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
            <BadgePercent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(data.collectionRate)}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2">
              <ArrowUpRight className="h-4 w-4 text-emerald-500" />
              <span className="text-emerald-500 font-medium">+2.1%</span>
              <span>from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">427</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2">
              <ArrowUpRight className="h-4 w-4 text-emerald-500" />
              <span className="text-emerald-500 font-medium">+12</span>
              <span>new this month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
            <CardDescription>
              Year-to-date financial performance
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4">
            <div className="h-72 flex flex-col justify-center items-center space-y-4">
              <BarChart2 className="h-16 w-16 text-muted-foreground" />
              <h3 className="text-xl font-semibold">
                {formatCurrency(data.totalCollected)} Collected YTD
              </h3>
              <p className="text-muted-foreground text-center max-w-md">
                Navigate to the dashboard for detailed metrics and interactive charts showing revenue trends, provider performance, and service analysis.
              </p>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2">
                <FileBarChart className="h-4 w-4" />
                <span>View Full Dashboard</span>
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full justify-start text-sm px-3 py-2 border rounded-md flex items-center space-x-2 hover:bg-secondary transition-colors">
                <FileBarChart className="h-4 w-4" />
                <span>Run Monthly Report</span>
              </button>
              <button className="w-full justify-start text-sm px-3 py-2 border rounded-md flex items-center space-x-2 hover:bg-secondary transition-colors">
                <Users className="h-4 w-4" />
                <span>View Patient List</span>
              </button>
              <button className="w-full justify-start text-sm px-3 py-2 border rounded-md flex items-center space-x-2 hover:bg-secondary transition-colors">
                <Calendar className="h-4 w-4" />
                <span>Schedule Appointment</span>
              </button>
              <button className="w-full justify-start text-sm px-3 py-2 border rounded-md flex items-center space-x-2 hover:bg-secondary transition-colors">
                <CircleDollarSign className="h-4 w-4" />
                <span>Record Payment</span>
              </button>
              <button className="w-full justify-start text-sm px-3 py-2 border rounded-md flex items-center space-x-2 hover:bg-secondary transition-colors">
                <TrendingUp className="h-4 w-4" />
                <span>Review AR Aging</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}