import { Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import Calendar from "@/pages/calendar";
import Reports from "@/pages/reports";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Switch>
        <ProtectedRoute path="/" component={Dashboard} />
        <ProtectedRoute path="/calendar" component={Calendar} />
        <ProtectedRoute path="/reports" component={Reports} />
        <AuthPage path="/auth" />
        <NotFound />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;