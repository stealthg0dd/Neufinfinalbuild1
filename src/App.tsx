import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from "./components/Layout";
import { PerformanceOptimizer } from "./components/PerformanceOptimizer";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { About } from "./pages/About";
import { Pricing } from "./pages/Pricing";
import { UserJourney } from "./pages/UserJourney";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import AuthCallback from "./pages/AuthCallback";
import { PortfolioSetup } from "./pages/PortfolioSetup";
import { UserDashboard } from "./pages/UserDashboard";
import { AuthFeatures } from "./pages/AuthFeatures";
import { Demo } from "./pages/Demo";
import { ApiLanding } from "./pages/ApiLanding";
import { CustomerPortal } from "./pages/CustomerPortal";
import { CustomerPane } from "./pages/CustomerPane";
import { CustomerAuthCallback } from "./pages/CustomerAuthCallback";
import { supabase } from './utils/supabase/client';
import { Toaster } from 'sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  }
  
  if (!session) return <Navigate to="/login" />
  return <>{children}</>
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <PerformanceOptimizer />
        <Toaster 
          theme="dark" 
          position="top-right"
          toastOptions={{
            style: {
              background: '#131318',
              border: '1px solid #2D2D3A',
              color: '#F5F5F7',
            },
          }}
        />
        <Router>
          <Routes>
          {/* Public routes without layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Customer Portal Routes */}
          <Route path="/customer-portal" element={<CustomerPortal />} />
          <Route path="/customer-auth-callback" element={<CustomerAuthCallback />} />
          <Route path="/customer-pane" element={<CustomerPane />} />

          {/* Protected routes without layout */}
          <Route path="/portfolio-setup" element={<ProtectedRoute><PortfolioSetup /></ProtectedRoute>} />
          <Route path="/user-dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />

          {/* Main public routes with layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/api" element={<ApiLanding />} />
          </Route>

          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </HelmetProvider>
    </QueryClientProvider>
  );
}