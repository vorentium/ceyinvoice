import React, { useEffect, useState } from 'react';
import ExportInvoice from '../components/molecules/ExportInvoice';
import '../styles/ExportStyles.css';

function ExportPage() {
  const [exportData, setExportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the data from localStorage (set by the export button)
    const storedData = localStorage.getItem('invoiceExportData');
    console.log('Retrieved stored data:', storedData);
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        console.log('Successfully parsed export data:', parsedData);
        setExportData(parsedData);
        
        // Clear localStorage data after retrieving it
        localStorage.removeItem('invoiceExportData');
      } catch (error) {
        console.error('Error parsing export data:', error);
      }
    } else {
      console.log('No invoiceExportData found in localStorage');
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center export-page">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!exportData) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col export-page">
        <div className="text-2xl font-bold mb-4">No invoice data found</div>
        <p className="text-gray-600">Please go back and try exporting again.</p>
      </div>
    );
  }

  return (
    <ExportInvoice 
      formData={exportData.formData} 
      template={exportData.template} 
      paperSize={exportData.paperSize || 'a4'} 
      directDownload={exportData.directDownload || false}
    />
  );
}

export default ExportPage; 