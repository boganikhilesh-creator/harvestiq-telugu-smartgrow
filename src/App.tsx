import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import CropPlanner from "./pages/CropPlanner";
import WeatherDashboard from "./pages/WeatherDashboard";
import PlantHealth from "./pages/PlantHealth";
import CropLibrary from "./pages/CropLibrary";
import MarketPrices from "./pages/MarketPrices";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/crop-planner" element={<CropPlanner />} />
            <Route path="/weather" element={<WeatherDashboard />} />
            <Route path="/plant-health" element={<PlantHealth />} />
            <Route path="/crop-library" element={<CropLibrary />} />
            <Route path="/market" element={<MarketPrices />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
