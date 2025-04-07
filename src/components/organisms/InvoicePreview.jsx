import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';

function InvoicePreview({ formData, handleTemplateSelect, handleSaveInvoice, children }) {
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showTemplateShowcase, setShowTemplateShowcase] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const previewContainerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfDataUrl, setPdfDataUrl] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);
  
  // Get the active template from the children prop
  const getActiveTemplate = () => {
    // Check which template is currently being rendered
    if (children) {
      // If children is a React element
      if (children.type && typeof children.type === 'function') {
        const templateName = children.type.name;
        if (templateName === 'BasicTemplate') return 'basic';
        if (templateName === 'MinimalTemplate') return 'minimal';
        if (templateName === 'ModernTemplate') return 'modern';
      }
      
      // If children is directly a component function
      if (typeof children === 'function') {
        const componentName = children.name;
        if (componentName === 'BasicTemplate') return 'basic';
        if (componentName === 'MinimalTemplate') return 'minimal';
        if (componentName === 'ModernTemplate') return 'modern';
      }
      
      // Try to extract from displayName if available
      if (children.type && children.type.displayName) {
        const displayName = children.type.displayName;
        if (displayName.includes('Basic')) return 'basic';
        if (displayName.includes('Minimal')) return 'minimal';
        if (displayName.includes('Modern')) return 'modern';
      }
      
      // Last resort: try toString to see if we can identify the template
      if (children.toString) {
        const str = children.toString();
        if (str.includes('Basic')) return 'basic';
        if (str.includes('Minimal')) return 'minimal';
        if (str.includes('Modern')) return 'modern';
      }
    }
    
    // If all else fails, log debugging info and return default
    console.log('Unable to determine template type from:', children);
    return 'basic'; // Default to basic if can't determine
  };
  
  const activeTemplate = getActiveTemplate();
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check on initial render
    checkScreenSize();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  const selectTemplate = (template) => {
    handleTemplateSelect(template);
    setShowTemplateSelector(false);
    setShowTemplateShowcase(false);
  };
  
  const handleZoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom + 0.1, 2));
  };
  
  const handleZoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom - 0.1, 0.5));
  };
  
  const handleResetZoom = () => {
    setZoom(1);
  };
  
  const toggleTemplateShowcase = () => {
    setShowTemplateShowcase(!showTemplateShowcase);
    setShowTemplateSelector(false);
  };
  
  // Handle download PDF from preview
  const handleDownloadPdf = () => {
    if (pdfBlob) {
      // Create a URL for the blob
      const blobUrl = URL.createObjectURL(pdfBlob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `invoice-${formData.invoiceNumber || 'export'}.pdf`;
      
      // Append to the document, click it, and remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      URL.revokeObjectURL(blobUrl);
      
      // Show success notification
      setNotification({ 
        show: true, 
        type: 'success', 
        message: 'PDF successfully downloaded!' 
      });
      
      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
      }, 3000);
      
      // Close the preview modal
      setShowPdfPreview(false);
    }
  };
  
  // Get active template name for display
  const getTemplateDisplayName = () => {
    switch (activeTemplate) {
      case 'basic': return 'Basic Template';
      case 'minimal': return 'Minimal Template';
      case 'modern': return 'Modern Template';
      default: return 'Select Template';
    }
  };
  
  // Handle export invoice button click
  const handleExportClick = () => {
    // Store the invoice data in localStorage for the export page to access
    const exportData = {
      formData,
      template: activeTemplate
    };
    
    localStorage.setItem('invoiceExportData', JSON.stringify(exportData));
    
    // Open the export page in a new tab
    window.open('/export-invoice', '_blank');
  };
  
  // Handle generate PDF button click
  const handlePrintClick = () => {
    // Show loading state
    setIsLoading(true);
    
    // Store the invoice data in localStorage for the export page to access with a flag for direct PDF generation
    const exportData = {
      formData,
      template: activeTemplate,
      directDownload: true // Flag to indicate direct PDF download is needed
    };
    
    localStorage.setItem('invoiceExportData', JSON.stringify(exportData));
    
    // Clear loading state after short delay
      setTimeout(() => {
      setIsLoading(false);
      // Open the export page in a new tab
      window.open('/export-invoice', '_blank');
      }, 300);
  };
  
  return (
    <div className="w-full lg:w-1/2 flex flex-col h-full bg-white h-screen max-h-screen overflow-y-auto">
      {/* Notification */}
      {notification.show && (
        <div className={notification.type === 'success' 
          ? 'fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg bg-green-100 text-green-800 border border-green-200' 
          : 'fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg bg-red-100 text-red-800 border border-red-200'
        }>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            <p>{notification.message}</p>
          </div>
        </div>
      )}
      
      {/* PDF Preview Modal */}
      {showPdfPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-5/6 flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-800">PDF Preview</h3>
              <button
                onClick={() => setShowPdfPreview(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              {pdfDataUrl && (
                <iframe
                  src={pdfDataUrl}
                  className="w-full h-full border-0"
                  title="PDF Preview"
                />
              )}
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={handleDownloadPdf}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Actions Header */}
      <div className="p-6 border-b sticky top-0 bg-white z-10">
        <h2 className="text-lg font-bold text-gray-800 mb-2">ACTIONS</h2>
        <p className="text-sm text-gray-500 mb-4">Operations and preview</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="relative">
            <button 
              onClick={() => setShowTemplateSelector(!showTemplateSelector)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path>
              </svg>
              {getTemplateDisplayName()}
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            {showTemplateSelector && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 w-48">
                <ul className="py-1">
                  <li 
                    onClick={() => selectTemplate('basic')}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex justify-between items-center"
                  >
                    <span>Basic Template</span>
                    {activeTemplate === 'basic' && (
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    )}
                  </li>
                  <li 
                    onClick={() => selectTemplate('minimal')}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex justify-between items-center"
                  >
                    <span>Minimal Template</span>
                    {activeTemplate === 'minimal' && (
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    )}
                  </li>
                  <li 
                    onClick={() => selectTemplate('modern')}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex justify-between items-center"
                  >
                    <span>Modern Template</span>
                    {activeTemplate === 'modern' && (
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    )}
                  </li>
                </ul>
              </div>
            )}
          </div>
          
          <button 
            onClick={toggleTemplateShowcase}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
            </svg>
            View Templates
          </button>
          
          <button 
            onClick={handleSaveInvoice}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
            </svg>
            Save Invoice
          </button>
          
          <button 
            onClick={handleExportClick}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
            </svg>
            Export invoice
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={handlePrintClick}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-gray-800 bg-gray-800 rounded-md shadow-sm text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating PDF...
              </>
            ) : (
              <>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
            Generate PDF
              </>
            )}
          </button>
          
          {isMobile && (
            <div className="flex items-center ml-auto space-x-2">
              <button 
                onClick={handleZoomOut}
                className="inline-flex items-center justify-center w-8 h-8 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                </svg>
              </button>
              
              <button 
                onClick={handleResetZoom}
                className="inline-flex items-center justify-center px-2 h-8 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                {Math.round(zoom * 100)}%
              </button>
              
              <button 
                onClick={handleZoomIn}
                className="inline-flex items-center justify-center w-8 h-8 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Template Showcase */}
      {showTemplateShowcase && (
        <div className="p-6 border-b bg-gray-50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Choose a Template</h3>
            <button 
              onClick={toggleTemplateShowcase}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Close
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Template */}
            <div 
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer bg-white transform hover:-translate-y-1"
              onClick={() => selectTemplate('basic')}
            >
              <div className="h-48 overflow-hidden border-b relative">
                <div className="absolute inset-0 bg-white">
                  <div className="p-3">
                    <div className="flex justify-between items-start mb-2 scale-[0.7] origin-top-left">
                      <div>
                        <div className="h-4 bg-gray-800 w-20 mb-1"></div>
                        <div className="h-2 bg-gray-400 w-12 mb-2"></div>
                      </div>
                      <div className="h-10 w-10 border border-gray-300 flex items-center justify-center">
                        <div className="text-xs text-gray-400">LOGO</div>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 w-full mt-3 mb-2"></div>
                    <div className="mt-2 flex">
                      <div className="w-2/3">
                        <div className="h-2 bg-gray-300 w-full mb-1"></div>
                        <div className="h-2 bg-gray-300 w-2/3"></div>
                      </div>
                      <div className="w-1/3 flex justify-end">
                        <div className="h-2 bg-gray-300 w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-gray-800 text-lg">Basic Template</h4>
                <p className="text-sm text-gray-500">Clean and traditional layout</p>
                <div className="mt-3">
                  <span className="inline-block text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Professional</span>
                  <span className="inline-block text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full ml-2">Simple</span>
                </div>
              </div>
            </div>
            
            {/* Minimal Template */}
            <div 
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer bg-white transform hover:-translate-y-1"
              onClick={() => selectTemplate('minimal')}
            >
              <div className="h-48 overflow-hidden border-b relative">
                <div className="absolute inset-0 bg-white">
                  <div className="p-3">
                    <div className="flex justify-center mb-2">
                      <div className="h-4 bg-gray-800 w-20 mb-1"></div>
                    </div>
                    <div className="flex justify-between mt-3">
                      <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center">
                        <div className="text-xs text-gray-400">LOGO</div>
                      </div>
                      <div className="w-1/4">
                        <div className="h-2 bg-gray-800 w-full mb-1"></div>
                        <div className="h-2 bg-gray-300 w-full"></div>
                      </div>
                      <div className="w-1/4">
                        <div className="h-2 bg-gray-800 w-full mb-1"></div>
                        <div className="h-2 bg-gray-300 w-full"></div>
                      </div>
                    </div>
                    <div className="h-1 bg-gray-800 w-full mt-6"></div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-gray-800 text-lg">Minimal Template</h4>
                <p className="text-sm text-gray-500">Simple and elegant design</p>
                <div className="mt-3">
                  <span className="inline-block text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">Elegant</span>
                  <span className="inline-block text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full ml-2">Minimal</span>
                </div>
              </div>
            </div>
            
            {/* Modern Template */}
            <div 
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer bg-white transform hover:-translate-y-1"
              onClick={() => selectTemplate('modern')}
            >
              <div className="h-48 overflow-hidden border-b relative bg-gray-50 modern-template-preview">
                <div className="absolute top-0 left-0 right-0 h-16 bg-var-primary"></div>
                <div className="absolute inset-0 p-3">
                  <div className="flex items-start mt-2">
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 mr-2 flex items-center justify-center">
                      <div className="text-xs text-gray-400">LOGO</div>
                    </div>
                    <div className="flex-1 text-right">
                      <div className="h-3 bg-white w-16 mb-1 ml-auto"></div>
                      <div className="h-2 bg-gray-100 w-10 mb-3 ml-auto"></div>
                      <div className="flex mt-3">
                        <div className="w-16 mr-1">
                          <div className="h-2 bg-var-primary w-full"></div>
                        </div>
                        <div className="flex-1">
                          <div className="h-2 bg-var-primary-90 w-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-8" style={{ zIndex: 1 }}>
                  <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="fill-var-primary w-full h-full">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C50,0,100,5.94,150.65,11.41c39.06,4.21,78.69,10.42,113.77,26.32C283.76,44.25,302.48,50.71,321.39,56.44Z"></path>
                  </svg>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-gray-800 text-lg">Modern Template</h4>
                <p className="text-sm text-gray-500">Contemporary with orange accents</p>
                <div className="mt-3">
                  <span className="inline-block text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full">Creative</span>
                  <span className="inline-block text-xs px-2 py-1 bg-orange-200 text-orange-800 rounded-full ml-2">Modern</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="p-6 pb-10 flex flex-col items-center">
        <h3 className="text-base font-medium text-gray-700 mb-4 self-start">Live Preview:</h3>
        
        <div 
          className="a4-page-container overflow-hidden bg-gray-100 p-4 rounded-lg shadow-inner flex justify-center"
          style={{
            width: '100%',
            maxWidth: '100%',
            height: 'calc(100vh - 230px)',
            overflowY: 'auto'
          }}
        >
          <div 
            ref={previewContainerRef}
            className={'a4-page bg-white shadow-lg transform-gpu invoice-preview-container' + (activeTemplate === 'modern' ? ' modern-template' : '')}
            style={{
              width: '210mm',
              minHeight: '297mm',
              maxWidth: '100%',
              transformOrigin: 'top center',
              transform: 'scale(' + zoom + ')',
              transition: 'transform 0.2s ease'
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoicePreview;