import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CodeProvider } from "@/contexts/CodeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ZASAssistant } from "@/components/ZASAssistant";
import Index from "./pages/Index";
import FeaturesPage from "./pages/FeaturesPage";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import TranslationHistory from "./pages/TranslationHistory";
import Statistics from "./pages/Statistics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        <LanguageProvider>
          <CodeProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/features" element={<FeaturesPage />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/history" element={<TranslationHistory />} />
                  <Route path="/stats" element={<Statistics />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
              <ZASAssistant />
            </TooltipProvider>
          </CodeProvider>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
