import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import Restaurant from "./pages/Restaurant";
import Carte from "./pages/Carte";
import Reservation from "./pages/Reservation";
import ClickCollect from "./pages/ClickCollect";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminNoAccess from "./pages/admin/AdminNoAccess";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMenu from "./pages/admin/AdminMenu";
import AdminReservations from "./pages/admin/AdminReservations";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminHours from "./pages/admin/AdminHours";
import AdminTeam from "./pages/admin/AdminTeam";
import { RequireAuth } from "./components/admin/RequireAuth";
import { AdminLayout } from "./components/admin/AdminLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/restaurant" element={<Restaurant />} />
              <Route path="/carte" element={<Carte />} />
              <Route path="/reservation" element={<Reservation />} />
              <Route path="/click-and-collect" element={<ClickCollect />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/no-access" element={<AdminNoAccess />} />
              <Route
                path="/admin"
                element={
                  <RequireAuth>
                    <AdminLayout />
                  </RequireAuth>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="menu" element={<AdminMenu />} />
                <Route path="reservations" element={<AdminReservations />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="hours" element={<AdminHours />} />
                <Route path="team" element={<AdminTeam />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
