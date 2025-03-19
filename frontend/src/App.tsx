import { useState } from "react";
import { mockData } from "./data/mock-data";
// Import the Dashboard component
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
// Component imports for the navigation
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, BarChart4, Users, FileText, Settings } from "lucide-react";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-background">
      
      <div className="flex">
        {/* Sidebar navigation */}
        <aside className="hidden md:flex flex-col w-[200px] border-r p-4 h-[calc(100vh-4rem)] sticky">
          <nav className="flex flex-col gap-2">
            <button 
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${activeTab === "dashboard" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
              onClick={() => setActiveTab("dashboard")}
            >
              <BarChart4 className="h-4 w-4" />
              <span>Dashboard</span>
            </button>
            <button 
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${activeTab === "patients" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
              onClick={() => setActiveTab("patients")}
            >
              <Users className="h-4 w-4" />
              <span>Patients</span>
            </button>
            <button 
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${activeTab === "claims" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
              onClick={() => setActiveTab("claims")}
            >
              <FileText className="h-4 w-4" />
              <span>Claims</span>
            </button>
            <button 
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${activeTab === "calendar" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
              onClick={() => setActiveTab("calendar")}
            >
              <Calendar className="h-4 w-4" />
              <span>Calendar</span>
            </button>
            <button 
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${activeTab === "settings" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
          </nav>
        </aside>
        
        {/* Mobile navigation */}
        <div className="md:hidden p-4 border-b w-full">
          <Tabs defaultValue="dashboard" onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="dashboard">
                <BarChart4 className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="patients">
                <Users className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="claims">
                <FileText className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="calendar">
                <Calendar className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Main content area */}
        <main className="flex-1 p-6">
          {activeTab === "dashboard" && (
            // Use the Dashboard component instead of hardcoding the dashboard content
            <Dashboard />
          )}
          
          {activeTab === "home" && (
            // Use the Home component
            <Home data={mockData.summaryMetrics} />
          )}
          
          {activeTab === "patients" && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Patient Management</h2>
                <p className="text-muted-foreground">
                  This section would display patient information, appointments, and payment history.
                </p>
              </CardContent>
            </Card>
          )}
          
          {activeTab === "claims" && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Claims Management</h2>
                <p className="text-muted-foreground">
                  This section would display claims status, rejection reasons, and pending submissions.
                </p>
              </CardContent>
            </Card>
          )}
          
          {activeTab === "calendar" && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Appointment Calendar</h2>
                <p className="text-muted-foreground">
                  This section would display provider schedules and appointment booking interface.
                </p>
              </CardContent>
            </Card>
          )}
          
          {activeTab === "settings" && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">System Settings</h2>
                <p className="text-muted-foreground">
                  This section would allow configuration of system preferences, user accounts, and integrations.
                </p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;