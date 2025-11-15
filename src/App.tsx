import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/FarmerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ManageUsers from "./pages/ManageUsers";
import Analytics from "./pages/Analytics";
import LoanApplication from "./pages/LoanApplication";
import Reports from "./pages/Reports";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import FarmerKYC from "./pages/FarmerKYC";
import Loans from "./pages/Loans";

import LenderDashboard from "./pages/LenderDashboard";   // ✅ ADDED

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Index />} />

          <Route path="/auth" element={<AuthPage />} />

          {/* Farmer */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/farmer/kyc" element={<FarmerKYC />} />
          <Route path="/loans" element={<Loans />} />

          {/* Lender */}
          <Route path="/lender/dashboard" element={<LenderDashboard />} />   {/* ✅ FIX */}

          {/* Admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/analytics" element={<Analytics />} />

          {/* Shared */}
          <Route path="/apply-loan" element={<LoanApplication />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/help" element={<Help />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
