import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// User pages
import Search from "./pages/Search";
import TrainResults from "./pages/TrainResults";
import SeatSelection from "./pages/SeatSelection";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageTrains from "./pages/admin/ManageTrains";
import ManageSchedules from "./pages/admin/ManageSchedules";
import ManagePrices from "./pages/admin/ManagePrices";
import ManageSeats from "./pages/admin/ManageSeats";
import ManageUsers from "./pages/admin/ManageUsers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<Search />} />
          <Route path="/results" element={<TrainResults />} />
          <Route path="/seats" element={<SeatSelection />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/trains" element={<ManageTrains />} />
          <Route path="/admin/schedules" element={<ManageSchedules />} />
          <Route path="/admin/prices" element={<ManagePrices />} />
          <Route path="/admin/seats" element={<ManageSeats />} />
          <Route path="/admin/users" element={<ManageUsers />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
