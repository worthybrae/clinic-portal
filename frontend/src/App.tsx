import { useState } from "react";
import { mockData } from "./data/mock-data";
// Import the Dashboard component
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
// Component imports for the navigation
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, BarChart4, Users, FileText, Settings, Menu, X } from "lucide-react";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <header className="sticky top-0 z-10 border-b bg-white flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <button 
            className="md:hidden mr-2 p-2 rounded-md hover:bg-gray-100"
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <h1 className="text-lg font-bold">Healthcare Analytics</h1>
        </div>
        
        
      </header>
      
      <div className="flex">
        {/* Mobile sidebar overlay */}
        <div 
          className={`fixed inset-0 bg-black/50 z-20 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
        
        {/* Sidebar navigation */}
        <aside 
          className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                    transform md:translate-x-0 transition-transform duration-200 ease-in-out
                    fixed md:sticky top-[48px] md:top-0 left-0 h-[calc(100vh-48px)] md:h-screen
                    w-64 md:w-[200px] border-r bg-white z-30 p-4 overflow-y-auto`}
        >
          <nav className="flex flex-col gap-2">
            <button 
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${activeTab === "dashboard" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
              onClick={() => {
                setActiveTab("dashboard");
                setSidebarOpen(false);
              }}
            >
              <BarChart4 className="h-4 w-4" />
              <span>Dashboard</span>
            </button>
            <button 
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${activeTab === "patients" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
              onClick={() => {
                setActiveTab("patients");
                setSidebarOpen(false);
              }}
            >
              <Users className="h-4 w-4" />
              <span>Patients</span>
            </button>
            <button 
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${activeTab === "claims" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
              onClick={() => {
                setActiveTab("claims");
                setSidebarOpen(false);
              }}
            >
              <FileText className="h-4 w-4" />
              <span>Claims</span>
            </button>
            <button 
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${activeTab === "calendar" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
              onClick={() => {
                setActiveTab("calendar");
                setSidebarOpen(false);
              }}
            >
              <Calendar className="h-4 w-4" />
              <span>Calendar</span>
            </button>
            <button 
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${activeTab === "settings" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
              onClick={() => {
                setActiveTab("settings");
                setSidebarOpen(false);
              }}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
          </nav>
        </aside>
        
        {/* Main content area */}
        <main className="flex-1 p-3 sm:p-6 overflow-x-hidden">
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
              <CardContent className="p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-4">Patient Management</h2>
                <p className="text-sm text-muted-foreground">
                  This section would display patient information, appointments, and payment history.
                </p>
              </CardContent>
            </Card>
          )}
          
          {activeTab === "claims" && (
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-4">Claims Management</h2>
                <p className="text-sm text-muted-foreground">
                  This section would display claims status, rejection reasons, and pending submissions.
                </p>
              </CardContent>
            </Card>
          )}
          
          {activeTab === "calendar" && (
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-4">Appointment Calendar</h2>
                <p className="text-sm text-muted-foreground">
                  This section would display provider schedules and appointment booking interface.
                </p>
              </CardContent>
            </Card>
          )}
          
          {activeTab === "settings" && (
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-4">System Settings</h2>
                <p className="text-sm text-muted-foreground">
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