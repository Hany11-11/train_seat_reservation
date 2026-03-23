import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/organisms/PageTransition";
import AnimatedTrainBackground from "@/components/atoms/AnimatedTrainBackground";

// User pages
import Search from "./pages/Search";
import TrainResults from "./pages/TrainResults";
import SeatSelection from "./pages/SeatSelection";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageTrains from "./pages/admin/ManageTrains";
import ManageSchedules from "./pages/admin/ManageSchedules";
import ManagePrices from "./pages/admin/ManagePrices";
import ManageSeats from "./pages/admin/ManageSeats";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageStations from "./pages/admin/ManageStations";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* User Routes */}
        <Route
          path="/"
          element={
            <PageTransition>
              <Search />
            </PageTransition>
          }
        />
        <Route
          path="/results"
          element={
            <PageTransition>
              <TrainResults />
            </PageTransition>
          }
        />
        <Route
          path="/seats"
          element={
            <PageTransition>
              <SeatSelection />
            </PageTransition>
          }
        />
        <Route
          path="/checkout"
          element={
            <PageTransition>
              <Checkout />
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              <Login />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PageTransition>
              <Dashboard />
            </PageTransition>
          }
        />
        <Route
          path="/profile"
          element={
            <PageTransition>
              <Profile />
            </PageTransition>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/login"
          element={
            <PageTransition>
              <AdminLogin />
            </PageTransition>
          }
        />
        <Route
          path="/admin"
          element={
            <PageTransition>
              <AdminDashboard />
            </PageTransition>
          }
        />
        <Route
          path="/admin/trains"
          element={
            <PageTransition>
              <ManageTrains />
            </PageTransition>
          }
        />
        <Route
          path="/admin/stations"
          element={
            <PageTransition>
              <ManageStations />
            </PageTransition>
          }
        />
        <Route
          path="/admin/schedules"
          element={
            <PageTransition>
              <ManageSchedules />
            </PageTransition>
          }
        />
        <Route
          path="/admin/prices"
          element={
            <PageTransition>
              <ManagePrices />
            </PageTransition>
          }
        />
        <Route
          path="/admin/seats"
          element={
            <PageTransition>
              <ManageSeats />
            </PageTransition>
          }
        />
        <Route
          path="/admin/users"
          element={
            <PageTransition>
              <ManageUsers />
            </PageTransition>
          }
        />

        {/* Catch-all */}
        <Route
          path="*"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

function TrainBackgroundWithLocation() {
  const location = useLocation();
  const showTrain = location.pathname === "/";
  return showTrain ? <AnimatedTrainBackground /> : null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <TrainBackgroundWithLocation />
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
