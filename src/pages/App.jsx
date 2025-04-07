import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './Home';
import Navbar from '../components/molecules/Navbar';
import Footer from '../components/organisms/Footer';
import LoginTemplate from '../components/templates/Login';
import SignupTemplate from '../components/templates/Signup';
import CreatorStudioTemplate from '../components/templates/Creator.studio';
import Templates from './Templates';
import ExportPage from './ExportPage';
import SavedInvoicesPage from './SavedInvoicesPage';
import LicensePage from './LicensePage';
import { setupSmoothScrolling } from '../utils/scrollUtils';

function App() {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);
  const isFullPage = ['/login', '/signup', '/creator-studio', '/export-invoice', '/saved-invoices', '/license'].includes(location.pathname);
  const isCreatorStudio = location.pathname === '/creator-studio';

  // Set up smooth scrolling globally
  useEffect(() => {
    setupSmoothScrolling();
  }, []);

  return (
    <div className="app font-sans">
      {!isFullPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginTemplate />} />
        <Route path="/signup" element={<SignupTemplate />} />
        <Route path="/creator-studio" element={<CreatorStudioTemplate />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/export-invoice" element={<ExportPage />} />
        <Route path="/saved-invoices" element={<SavedInvoicesPage />} />
        <Route path="/license" element={<LicensePage />} />
        {/* Add other routes here in the future */}
        <Route path="*" element={<Home />} />
      </Routes>
      {!isFullPage && <Footer />}
    </div>
  );
}

export default App;
