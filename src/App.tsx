import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Banks from "./pages/Banks";
import BankDetails from "./pages/BankDetails";
import BranchPage from "./pages/BranchPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Calculators from "./pages/Calculators";
import Blogs from "./pages/Blogs";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import EmiCalculator from "./pages/EmiCalculator";
import SipCalculator from "./pages/SipCalculator";
import Disclaimer from "./pages/Disclaimer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/banks" element={<Banks />} />
          <Route path="/bank/:bankName" element={<BankDetails />} />
          <Route path="/bank/:bankName/:stateName" element={<BankDetails />} />
          <Route path="/bank/:bankName/:stateName/:cityName" element={<BankDetails />} />
          <Route path="/branch/:ifsc" element={<BranchPage />} />
          <Route path="/tools" element={<Calculators />} />
          <Route path="/emi-calculator" element={<EmiCalculator />} />
          <Route path="/sip-calculator" element={<SipCalculator />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
