import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ExportInvoice from '../components/molecules/ExportInvoice';
import '../styles/ExportStyles.css';

function ExportPage() {
  const [exportData, setExportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // First try to get data from URL parameters
    const searchParams = new URLSearchParams(location.search);
    const template = searchParams.get('t');
    const invoiceNumber = searchParams.get('n');
    const directDownload = searchParams.get('d') === 'true';
    
    const fromUrlParams = template && invoiceNumber;
    
    // Get the data from localStorage (set by the export button)
    const storedData = localStorage.getItem('invoiceExportData');
    console.log('Retrieved stored data:', storedData);
    console.log('URL parameters - template:', template, 'invoiceNumber:', invoiceNumber);
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        console.log('Successfully parsed export data:', parsedData);
        
        // Ensure the template value from URL is used if available
        if (template && ['basic', 'minimal', 'modern'].includes(template)) {
          parsedData.template = template;
        }
        
        setExportData(parsedData);
        
        // Clear localStorage data after retrieving it
        localStorage.removeItem('invoiceExportData');
      } catch (error) {
        console.error('Error parsing export data:', error);
        
        // If localStorage data fails but we have URL params, use them as fallback
        if (fromUrlParams) {
          console.log('Using URL parameters as fallback');
          setExportData({
            formData: { invoiceNumber },
            template: template,
            directDownload
          });
        }
      }
    } else if (fromUrlParams) {
      // If no localStorage data but we have URL params, use them
      console.log('Using URL parameters for export data');
      setExportData({
        formData: { invoiceNumber },
        template: template,
        directDownload
      });
    } else {
      console.log('No invoiceExportData found in localStorage or URL parameters');
    }
    setLoading(false);
  }, [location]);

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

  console.log('Rendering ExportInvoice with template:', exportData.template);
  
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