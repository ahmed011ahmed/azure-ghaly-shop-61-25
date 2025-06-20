
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Services from "./pages/Services";
import AdminDashboard from "./pages/AdminDashboard";
import Auth from "./pages/Auth";
import VerifyEmail from "./pages/VerifyEmail";
import Subscribers from "./pages/Subscribers";
import NotFound from "./pages/NotFound";
import { ProductsProvider } from "./contexts/ProductsContext";
import { ServicesProvider } from "./contexts/ServicesContext";
import { ChatProvider } from "./contexts/ChatContext";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./hooks/useAuth";
import { LanguageProvider } from "./contexts/LanguageContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <ProductsProvider>
              <ServicesProvider>
                <ChatProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/verify-email" element={<VerifyEmail />} />
                      <Route path="/subscribers" element={<Subscribers />} />
                      <Route path="/admin" element={<AdminDashboard />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </BrowserRouter>
                </ChatProvider>
              </ServicesProvider>
            </ProductsProvider>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
