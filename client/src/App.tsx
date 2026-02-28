import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Page imports
import AdminDashboard from "./pages/AdminDashboard";
import LinkDetails from "./pages/LinkDetails";
import VerificationTrap from "./pages/VerificationTrap";

function Router() {
  return (
    <Switch>
      {/* Trap Link - Fake UI - Match this first so it doesn't get caught by generic routes */}
      <Route path="/v/:token" component={VerificationTrap} />
      
      {/* Admin Interface */}
      <Route path="/" component={AdminDashboard} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/link/:token" component={LinkDetails} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
