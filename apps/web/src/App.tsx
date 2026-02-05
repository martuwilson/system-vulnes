import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';

// Layout components
import { AuthLayout } from './components/layouts/AuthLayout';
import { DashboardLayout } from './components/layouts/DashboardLayout';

// Public pages
import { LandingPage } from './pages/landing/LandingPage';

// Auth pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Dashboard pages
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { CompaniesPage } from './pages/companies/CompaniesPage';
import { ScansPage } from './pages/scans/ScansPage';
import { FindingsPage } from './pages/findings/FindingsPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { ProfilePage } from './pages/ProfilePage';

// Checkout pages
import { CheckoutPage } from './pages/checkout/CheckoutPage';
import { CheckoutSuccess } from './pages/checkout/CheckoutSuccess';
import { CheckoutError } from './pages/checkout/CheckoutError';
import { CheckoutPending } from './pages/checkout/CheckoutPending';

// Hooks
import { useAuth } from './hooks/useAuth';

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        gap={2}
      >
        <div>Cargando aplicación...</div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          Verificando autenticación...
        </div>
      </Box>
    );
  }

  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth Routes */}
      <Route
        path="/auth/*"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AuthLayout />
          )
        }
      >
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Route>

      {/* Protected Routes */}
      <Route
        path="/app/*"
        element={
          isAuthenticated ? (
            <DashboardLayout />
          ) : (
            <Navigate to="/auth/login" replace />
          )
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="companies" element={<CompaniesPage />} />
        <Route path="scans" element={<ScansPage />} />
        <Route path="findings" element={<FindingsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
      </Route>

      {/* Checkout Routes (requiere auth) */}
      <Route
        path="/checkout"
        element={isAuthenticated ? <CheckoutPage /> : <Navigate to="/auth/login" replace />}
      />
      <Route path="/checkout/success" element={<CheckoutSuccess />} />
      <Route path="/checkout/error" element={<CheckoutError />} />
      <Route path="/checkout/pending" element={<CheckoutPending />} />

      {/* Legacy redirects */}
      <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="/companies" element={<Navigate to="/app/companies" replace />} />
      <Route path="/scans" element={<Navigate to="/app/scans" replace />} />
      <Route path="/findings" element={<Navigate to="/app/findings" replace />} />
      <Route path="/settings" element={<Navigate to="/app/settings" replace />} />
    </Routes>
  );
}

export default App;
