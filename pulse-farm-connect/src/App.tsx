import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Schemes from "./pages/Schemes";
import CropAdvisor from "./pages/CropAdvisor";
import Services from "./pages/Services";
import Factories from "./pages/Factories";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Navigation from "./components/Navigation";
import MotorControl from './components/MotorControl' // Import the component

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex">
    <Navigation />
    <div className="ml-64 flex-1">{children}</div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<AppLayout><Index /></AppLayout>} />
          <Route path="/schemes" element={<AppLayout><Schemes /></AppLayout>} />
          <Route path="/crops" element={<AppLayout><CropAdvisor /></AppLayout>} />
          <Route path="/services" element={<AppLayout><Services /></AppLayout>} />
          <Route path="/factories" element={<AppLayout><Factories /></AppLayout>} />
          {/* Here is the new route for your MotorControl component */}
          <Route path="/motor" element={<AppLayout><MotorControl /></AppLayout>} />
          <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
