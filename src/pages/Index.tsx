// import { useState } from "react";
// import {
//   SidebarProvider,
//   SidebarInset,
//   SidebarTrigger,
// } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/layout/AppSidebar";
// import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
// import { CRMModule } from "@/components/crm/CRMModule";
// import { InventoryModule } from "@/components/inventory/InventoryModule";
// import { ExpenseModule } from "@/components/expenses/ExpenseModule";
// import { PickupModule } from "@/components/pickup/PickupModule";
// import { ServiceModule } from "@/components/service/ServiceModule";
// import { BillingModule } from "@/components/billing/BillingModule";
// import { DeliveryModule } from "@/components/delivery/DeliveryModule";
// import { CompletedModule } from "@/components/completed/CompletedModule";
// import { ReportsModule } from "@/components/reports/ReportsModule";
// import { SettingsModule } from "@/components/settings/SettingsModule";
// import { AllEnquiriesTable } from "@/components/crm/AllEnquiriesTable";
// import { PendingPickupsTable } from "@/components/pickup/PendingPickupsTable";
// import { ServiceCompletionTable } from "@/components/service/ServiceCompletionTable";
// import { InServiceTable } from "@/components/service/InServiceTable";

// const Index = () => {
//   const [currentView, setCurrentView] = useState("dashboard");
//   const [activeAction, setActiveAction] = useState<string | null>(null);
//   const [showAllEnquiries, setShowAllEnquiries] = useState(false);
//   const [showPendingPickups, setShowPendingPickups] = useState(false);
//   const [showCompletedServices, setShowCompletedServices] = useState(false);
//   const [showInService, setShowInService] = useState(false);

//   const handleViewChange = (view: string, action?: string) => {
//     if (view === "all-enquiries") {
//       setShowAllEnquiries(true);
//       return;
//     }

//     if (view === "pending-pickups") {
//       setShowPendingPickups(true);
//       return;
//     }
    
//     if (view === "service-completion") {
//       setShowCompletedServices(true);
//       return;
//     }
    
//     if (view === "in-service") {
//       setShowInService(true);
//       return;
//     }

//     setCurrentView(view);
//     setActiveAction(action || null);
    
//     // Reset all table views when navigating to other views
//     setShowAllEnquiries(false);
//     setShowPendingPickups(false);
//     setShowCompletedServices(false);
//     setShowInService(false);
//   };

//   const renderContent = () => {
//     if (showAllEnquiries) {
//       return <AllEnquiriesTable onBack={() => setShowAllEnquiries(false)} />;
//     }
//     if (showPendingPickups) {
//       return <PendingPickupsTable onBack={() => setShowPendingPickups(false)} />;
//     }
//     if (showCompletedServices) {
//       return <ServiceCompletionTable onBack={() => setShowCompletedServices(false)} />;
//     }
//     if (showInService) {
//       return <InServiceTable onBack={() => setShowInService(false)} />;
//     }
    
//     switch (currentView) {
//       case "dashboard":
//         return <DashboardOverview onNavigate={handleViewChange} />;
//       case "crm":
//         return <CRMModule activeAction={activeAction} />;
//       case "inventory":
//         return <InventoryModule />;
//       case "expenses":
//         return <ExpenseModule />;
//       case "pickup":
//         return <PickupModule />;
//           case "service":
//       return <ServiceModule />;
//     case "billing":
//       return <BillingModule />;
//     case "delivery":
//       return <DeliveryModule />;
//     case "completed":
//       return <CompletedModule />;
//     case "reports":
//         return <ReportsModule />;
//       case "settings":
//         return <SettingsModule />;
//       default:
//         return <DashboardOverview onNavigate={handleViewChange} />;
//     }
//   };

//   return (
//     <SidebarProvider>
//       <div className="min-h-screen flex w-full bg-background">
//         <AppSidebar currentView={currentView} onViewChange={handleViewChange} />
//         <SidebarInset className="flex-1">
//           {/* Mobile header with trigger */}
//           <header className="lg:hidden h-14 flex items-center justify-between px-4 border-b border-border bg-card">
//             <SidebarTrigger />
//             <h1 className="font-semibold text-foreground">CobblerCRM</h1>
//             <div></div>
//           </header>
//           <main className="flex-1 p-2 sm:p-4 lg:p-6">{renderContent()}</main>
//         </SidebarInset>
//       </div>
//     </SidebarProvider>
//   );
// };

// export default Index;


import { useState } from "react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { CRMModule } from "@/components/crm/CRMModule";
import InventoryModule from "@/components/inventory/InventoryModule";
import ExpenseModule from "@/components/expenses/ExpenseModule";
import { PickupModule } from "@/components/pickup/PickupModule";
import { ServiceModule } from "@/components/service/ServiceModule";
import { BillingModule } from "@/components/billing/BillingModule";
import { DeliveryModule } from "@/components/delivery/DeliveryModule";
import { CompletedModule } from "@/components/completed/CompletedModule";
import { ReportsModule } from "@/components/reports/ReportsModule";
import { SettingsModule } from "@/components/settings/SettingsModule";
import { AllEnquiriesTable } from "@/components/crm/AllEnquiriesTable";
import { PendingPickupsTable } from "@/components/pickup/PendingPickupsTable";
import { ServiceCompletionTable } from "@/components/service/ServiceCompletionTable";
import { InServiceTable } from "@/components/service/InServiceTable";

const Index = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [showAllEnquiries, setShowAllEnquiries] = useState(false);
  const [showPendingPickups, setShowPendingPickups] = useState(false);
  const [showCompletedServices, setShowCompletedServices] = useState(false);
  const [showInService, setShowInService] = useState(false);

  const handleViewChange = (view: string, action?: string) => {
    if (view === "all-enquiries") {
      setShowAllEnquiries(true);
      return;
    }

    if (view === "pending-pickups") {
      setShowPendingPickups(true);
      return;
    }
    
    if (view === "service-completion") {
      setShowCompletedServices(true);
      return;
    }
    
    if (view === "in-service") {
      setShowInService(true);
      return;
    }

    setCurrentView(view);
    setActiveAction(action || null);
    
    // Reset all table views when navigating to other views
    setShowAllEnquiries(false);
    setShowPendingPickups(false);
    setShowCompletedServices(false);
    setShowInService(false);
  };

  const renderContent = () => {
    if (showAllEnquiries) {
      return <AllEnquiriesTable onBack={() => setShowAllEnquiries(false)} />;
    }
    if (showPendingPickups) {
      return <PendingPickupsTable onBack={() => setShowPendingPickups(false)} />;
    }
    if (showCompletedServices) {
      return <ServiceCompletionTable onBack={() => setShowCompletedServices(false)} />;
    }
    if (showInService) {
      return <InServiceTable onBack={() => setShowInService(false)} />;
    }
    
    switch (currentView) {
      case "dashboard":
        return <DashboardOverview onNavigate={handleViewChange} />;
      case "crm":
        return <CRMModule activeAction={activeAction} />;
      case "inventory":
        return <InventoryModule />;
      case "expenses":
        return <ExpenseModule />;
      case "pickup":
        return <PickupModule />;
          case "service":
      return <ServiceModule />;
    case "billing":
      return <BillingModule />;
    case "delivery":
      return <DeliveryModule />;
    case "completed":
      return <CompletedModule />;
    case "reports":
        return <ReportsModule />;
      case "settings":
        return <SettingsModule />;
      default:
        return <DashboardOverview onNavigate={handleViewChange} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar currentView={currentView} onViewChange={handleViewChange} />
        <SidebarInset className="flex-1">
          {/* Mobile header with trigger */}
          <header className="lg:hidden h-14 flex items-center justify-between px-4 border-b border-border bg-card">
            <SidebarTrigger />
            <h1 className="font-semibold text-foreground">CobblerCRM</h1>
            <div></div>
          </header>
          <main className="flex-1 p-2 sm:p-4 lg:p-6">{renderContent()}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;