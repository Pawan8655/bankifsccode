import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Index = lazy(() => import('./pages/Index'));
const Banks = lazy(() => import('./pages/Banks'));
const BankDetails = lazy(() => import('./pages/BankDetails'));
const BranchPage = lazy(() => import('./pages/BranchPage'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Calculators = lazy(() => import('./pages/Calculators'));
const Blogs = lazy(() => import('./pages/Blogs'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const EmiCalculator = lazy(() => import('./pages/EmiCalculator'));
const SipCalculator = lazy(() => import('./pages/SipCalculator'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));
const GenericToolPage = lazy(() => import('./pages/GenericToolPage'));
const BankHolidays = lazy(() => import('./pages/BankHolidays'));
const BankComparison = lazy(() => import('./pages/BankComparison'));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
    Loading page...
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/banks" element={<Banks />} />
            <Route path="/bank/:bankName" element={<BankDetails />} />
            <Route path="/bank/:bankName/:stateName" element={<BankDetails />} />
            <Route path="/bank/:bankName/:stateName/:cityName/:branchName" element={<BranchPage />} />
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
            <Route path="/bank-holidays" element={<BankHolidays />} />
            <Route path="/bank-comparison" element={<BankComparison />} />
            <Route path="/:toolSlug" element={<GenericToolPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
