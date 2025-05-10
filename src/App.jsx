import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './index.css'; // Tailwind styles import
import LoginPage from './components/pages/templates/LoginPage';
import ResetPSWRD from './components/pages/templates/ResetPSWRD';
import ResetPasswordConfirm from './components/pages/templates/ResetPasswordConfirm';
import Dashboard from './components/pages/Dashboard';
import InvoiceEditor from './components/pages/templates/creator-studio/src/components/InvoiceEditor';
import PrivateRoute from './components/auth/PrivateRoute';
import LandingPage from './components/pages/LandingPage';
import { CurrencyProvider } from './contexts/CurrencyContext';
import Settings from './components/molecules/Settings';
import Form from './components/pages/sub_pages/Form';
import InvoiceView from './components/pages/templates/creator-studio/src/components/InvoiceView';
import Documentation from './components/pages/templates/Documentation';
import TermsofService from './components/pages/templates/TermsofService';
import PrivacyPolicy from './components/pages/templates/PrivacyPolicy';
import Help from './components/pages/sub_pages/Help&Support';
import Changelog from './components/pages/templates/Changelog';
function App() {
  return (
    <CurrencyProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ResetPSWRD />} />
        <Route path="/reset-password-confirm" element={<ResetPasswordConfirm />} />
        <Route path="/terms" element={<TermsofService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/help" element={<Help />} />
        <Route path="/changelog" element={<Changelog />} />
        
        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/:source" element={<Dashboard />} />
          <Route path="/creator-studio" element={<InvoiceEditor />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/form" element={<Form />} />
          <Route path="/invoice-view" element={<InvoiceView />} />
          <Route path="/documentation" element={<Documentation />} />
        </Route>
      </Routes>
    </CurrencyProvider>
  );
}

export default App
