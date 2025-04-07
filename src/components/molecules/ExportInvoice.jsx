import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import '../../styles/ExportStyles.css';
import { BasicTemplate} from '../templates/invoice-templates/BasicTemplate';
import { MinimalTemplate} from '../templates/invoice-templates/MinimalTemplate';
import { ModernTemplate} from '../templates/invoice-templates/ModernTemplate';

function ExportInvoice({ formData, template, paperSize = 'a4', directDownload = false }) {
  const invoiceRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modernColor, setModernColor] = useState('#f0520e');

  // Paper size dimensions in mm and their pixel equivalents (at 96 DPI)
  const paperSizes = {
    a4: { width: '210mm', height: '297mm', pxWidth: 794, pxHeight: 1123, name: 'A4' },
    letter: { width: '216mm', height: '279mm', pxWidth: 816, pxHeight: 1056, name: 'US Letter' },
    legal: { width: '216mm', height: '356mm', pxWidth: 816, pxHeight: 1344, name: 'Legal' },
    a3: { width: '297mm', height: '420mm', pxWidth: 1123, pxHeight: 1587, name: 'A3' }
  };

  // Get current paper size or default to A4
  const currentPaperSize = paperSizes[paperSize] || paperSizes.a4;

  useEffect(() => {
    // Load saved modern template color on mount
    if (template === 'modern') {
      const savedColor = localStorage.getItem('modernTemplateColor');
      if (savedColor) {
        setModernColor(savedColor);
      }
    }
    
    // Wait for all images and fonts to load properly before allowing download
    if (document.readyState === 'complete') {
      console.log('Document already fully loaded');
    } else {
      window.addEventListener('load', () => {
        console.log('Document fully loaded');
      });
    }
    
    // Check for font loading
    document.fonts.ready.then(() => {
      console.log('All fonts loaded successfully');
      // If directDownload is true, automatically download the PDF when component mounts
      if (directDownload) {
        console.log('Direct download requested, initiating PDF download...');
        setTimeout(() => {
          try {
            downloadAsPdf();
          } catch (error) {
            console.error('Error in direct download:', error);
            // Try to show an error message
            setError('Error generating PDF. Please try again.');
          }
        }, 1500); // Slightly increased delay to ensure everything is rendered
      }
    }).catch(err => {
      console.error('Font loading error:', err);
    });
  }, [template, directDownload]);

  const downloadAsJpg = () => {
    const invoice = invoiceRef.current;
    if (!invoice) {
      console.error('Invoice reference is null');
      setError('Could not find invoice element');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    // First add a loading indicator to the button
    const downloadBtn = document.querySelector('.download-button');
    if (downloadBtn) {
      downloadBtn.disabled = true;
    }

    // Log the current dimensions and content of the invoice element
    console.log('Invoice dimensions:', {
      width: invoice.offsetWidth,
      height: invoice.offsetHeight,
      clientWidth: invoice.clientWidth,
      clientHeight: invoice.clientHeight,
      scrollWidth: invoice.scrollWidth,
      scrollHeight: invoice.scrollHeight,
      paperSize: currentPaperSize.name
    });
    
    console.log('Invoice children count:', invoice.children.length);

    // Create a temporary style element to neutralize any oklch colors in the page
    const tempStyleEl = document.createElement('style');
    // Get the primary color for Modern template from localStorage or use default
    const primaryColor = template === 'modern' 
      ? (localStorage.getItem('modernTemplateColor') || '#f0520e') 
      : '#f0520e';
    
    tempStyleEl.textContent = `
      .export-invoice, .export-invoice * {
        color: #000000 !important;
        border-color: #e5e7eb !important;
        fill: currentColor !important;
        stroke: currentColor !important;
      }
      .export-invoice table th {
        background-color: #f3f4f6 !important;
      }
      .export-invoice table td, .export-invoice table th {
        border: 1px solid #e5e7eb !important;
      }
      .export-invoice h1, .export-invoice h2, .export-invoice h3, 
      .export-invoice h4, .export-invoice h5, .export-invoice h6 {
        color: #111827 !important;
      }
      
      /* Override styles for modern template */
      .export-invoice .bg-var-primary {
        background-color: ${primaryColor} !important;
      }
      .export-invoice .border-var-primary {
        border-color: ${primaryColor} !important;
      }
      .export-invoice .fill-var-primary {
        fill: ${primaryColor} !important;
      }
      .export-invoice .text-var-primary {
        color: ${primaryColor} !important;
      }
      .export-invoice .text-white {
        color: #ffffff !important;
      }
      .export-invoice table thead tr.bg-var-primary {
        background-color: ${primaryColor} !important;
      }
      .export-invoice table thead tr.bg-var-primary th {
        color: white !important;
      }
      
      /* Fix for Modern template wave positioning */
      .export-invoice .bg-white.h-full.font-sans.relative {
        position: relative;
        min-height: 100%;
      }
      
      .export-invoice .bg-white.h-full.font-sans.relative .absolute.bottom-0 {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
      }
    `;
    document.head.appendChild(tempStyleEl);

    // Configure options for high-quality image
    const options = {
      scale: 2, // Better quality with higher scale
      useCORS: true, // Enable cross-origin image loading
      allowTaint: true, // Allow canvas taint for better image handling
      backgroundColor: '#ffffff', // White background
      logging: true, // Enable logging for debugging
      foreignObjectRendering: false, // Disable foreignObject rendering for better compatibility
      removeContainer: false, // Don't remove elements from DOM after capture
      imageTimeout: 15000, // Increase timeout for image loading
      ignoreElements: (element) => {
        // Ignore elements that might cause issues
        return element.classList && 
               (element.classList.contains('no-export') || 
                element.classList.contains('download-button'));
      },
      onclone: function(clonedDoc) {
        // Additional modifications to the cloned document if needed
        console.log('Document cloned successfully');
        
        // Force all elements to be visible and render at full opacity
        const allElements = clonedDoc.querySelectorAll('.export-invoice *');
        allElements.forEach(el => {
          el.style.visibility = 'visible';
          el.style.opacity = '1';
          
          // Convert any oklch colors to hex/rgb to avoid the unsupported color function error
          // This is needed because html2canvas doesn't support the oklch color function
          const computedStyle = window.getComputedStyle(el);
          
          // Get all style properties that could contain color values
          const colorProperties = [
            'color', 'background-color', 'border-color', 'border-top-color', 
            'border-right-color', 'border-bottom-color', 'border-left-color',
            'outline-color', 'text-decoration-color', 'fill', 'stroke'
          ];
          
          // Apply computed colors to the element's style to ensure they're in a supported format
          colorProperties.forEach(prop => {
            const computedValue = computedStyle.getPropertyValue(prop);
            if (computedValue && computedValue.includes('oklch')) {
              // If the property has an oklch value, replace it with the computed RGB value
              // The browser will convert oklch to RGB when we access the computed style
              el.style[prop] = computedValue;
            }
          });
        });
        
        return clonedDoc;
      }
    };

    // Wait for a moment to ensure all styles are loaded
    setTimeout(() => {
      try {
        html2canvas(invoice, options)
          .then(function (canvas) {
            console.log('Canvas created successfully', {
              width: canvas.width,
              height: canvas.height
            });
            
            try {
              // Convert to Blob for more reliable file saving
              canvas.toBlob(function(blob) {
                if (!blob) {
                  throw new Error('Failed to create blob from canvas');
                }
                
                console.log('Blob created', blob.size, 'bytes');
                
                // Use FileSaver.js to save the file
                saveAs(blob, `invoice-${formData.invoiceNumber || 'export'}.jpg`);
                
                console.log('File saved successfully');
                
                // Reset button state
                setIsLoading(false);
                if (downloadBtn) {
                  downloadBtn.disabled = false;
                }
                
                // Remove temporary style element
                if (tempStyleEl && tempStyleEl.parentNode) {
                  tempStyleEl.parentNode.removeChild(tempStyleEl);
                }
              }, 'image/jpeg', 1.0);
            } catch (dataUrlError) {
              console.error('Error creating blob:', dataUrlError);
              handleDownloadError(dataUrlError, downloadBtn);
              
              // Clean up style element in case of error
              if (tempStyleEl && tempStyleEl.parentNode) {
                tempStyleEl.parentNode.removeChild(tempStyleEl);
              }
            }
          })
          .catch(function (error) {
            console.error('Error generating canvas:', error);
            handleDownloadError(error, downloadBtn);
            
            // Clean up style element in case of error
            if (tempStyleEl && tempStyleEl.parentNode) {
              tempStyleEl.parentNode.removeChild(tempStyleEl);
            }
          });
      } catch (canvasError) {
        console.error('Error initializing html2canvas:', canvasError);
        handleDownloadError(canvasError, downloadBtn);
        
        // Clean up style element in case of error
        if (tempStyleEl && tempStyleEl.parentNode) {
          tempStyleEl.parentNode.removeChild(tempStyleEl);
        }
      }
    }, 1000); // Increased delay to ensure all elements are rendered
  };

  // Download as PDF function
  const downloadAsPdf = () => {
    const invoice = invoiceRef.current;
    if (!invoice) {
      console.error('Invoice reference is null');
      setError('Could not find invoice element');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    // First add a loading indicator to the button
    const downloadBtn = document.querySelector('.download-pdf-button');
    if (downloadBtn) {
      downloadBtn.disabled = true;
    }

    // Create a temporary style element to neutralize any oklch colors in the page
    const tempStyleEl = document.createElement('style');
    // Get the primary color for Modern template from localStorage or use default
    const primaryColor = template === 'modern' 
      ? (localStorage.getItem('modernTemplateColor') || '#f0520e') 
      : '#f0520e';
    
    tempStyleEl.textContent = `
      .export-invoice, .export-invoice * {
        color: #000000 !important;
        border-color: #e5e7eb !important;
        fill: currentColor !important;
        stroke: currentColor !important;
      }
      .export-invoice table th {
        background-color: #f3f4f6 !important;
      }
      .export-invoice table td, .export-invoice table th {
        border: 1px solid #e5e7eb !important;
      }
      .export-invoice h1, .export-invoice h2, .export-invoice h3, 
      .export-invoice h4, .export-invoice h5, .export-invoice h6 {
        color: #111827 !important;
      }
      
      /* Override styles for modern template */
      .export-invoice .bg-var-primary {
        background-color: ${primaryColor} !important;
      }
      .export-invoice .border-var-primary {
        border-color: ${primaryColor} !important;
      }
      .export-invoice .fill-var-primary {
        fill: ${primaryColor} !important;
      }
      .export-invoice .text-var-primary {
        color: ${primaryColor} !important;
      }
      .export-invoice .text-white {
        color: #ffffff !important;
      }
      .export-invoice table thead tr.bg-var-primary {
        background-color: ${primaryColor} !important;
      }
      .export-invoice table thead tr.bg-var-primary th {
        color: white !important;
      }
    `;
    document.head.appendChild(tempStyleEl);

    // Configure options for high-quality image
    const options = {
      scale: 2, // Better quality with higher scale
      useCORS: true, // Enable cross-origin image loading
      allowTaint: true, // Allow canvas taint for better image handling
      backgroundColor: '#ffffff', // White background
      logging: false, // Disable logging for production
      foreignObjectRendering: false, // Disable foreignObject rendering for better compatibility
      onclone: (clonedDoc) => {
        // Process all elements with potential oklch colors
        const elements = clonedDoc.querySelectorAll('*');
        elements.forEach(el => {
          // Create an array of properties to check for oklch values
          const colorProperties = [
            'color', 'backgroundColor', 'borderColor', 
            'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor',
            'fill', 'stroke'
          ];
          
          // Get computed styles
          const computedStyle = window.getComputedStyle(el);
          
          // Apply the computed RGB values to override any oklch colors
          colorProperties.forEach(prop => {
            const cssProperty = prop.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
            const value = computedStyle.getPropertyValue(cssProperty);
            
            if (value && value.includes('oklch')) {
              // Set with the computed value which browsers convert to RGB
              el.style[prop] = value;
            }
          });
        });
      },
    };

    // Wait for a moment to ensure all styles are loaded
    setTimeout(() => {
      try {
        html2canvas(invoice, options)
          .then(function (canvas) {
            console.log('Canvas created successfully for PDF');
            
            try {
              // Create a PDF
              const imgData = canvas.toDataURL('image/jpeg', 1.0);
              const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
              });
              
              // Calculate dimensions
              const imgWidth = 210; // A4 width in mm
              const pageHeight = 297; // A4 height in mm
              const imgHeight = canvas.height * imgWidth / canvas.width;
              
              // Add the image to the PDF
              pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
              
              // If the content is longer than one page, add more pages
              let heightLeft = imgHeight;
              let position = 0;
              
              while (heightLeft > pageHeight) {
                // Add a new page
                position -= pageHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
              }
              
              // Save the PDF
              pdf.save(`invoice-${formData.invoiceNumber || 'export'}.pdf`);
              
              // Reset button state
              setIsLoading(false);
              if (downloadBtn) {
                downloadBtn.disabled = false;
              }
              
              // Remove temporary style element
              if (tempStyleEl && tempStyleEl.parentNode) {
                tempStyleEl.parentNode.removeChild(tempStyleEl);
              }
              
              // If this was an automatic download from directDownload, close the tab after download
              if (directDownload) {
                setTimeout(() => {
                  window.close();
                }, 500);
              }
            } catch (pdfError) {
              console.error('Error creating PDF:', pdfError);
              handleDownloadError(pdfError, downloadBtn);
              
              // Clean up style element in case of error
              if (tempStyleEl && tempStyleEl.parentNode) {
                tempStyleEl.parentNode.removeChild(tempStyleEl);
              }
            }
          })
          .catch(function (error) {
            console.error('Error generating canvas for PDF:', error);
            handleDownloadError(error, downloadBtn);
            
            // Clean up style element in case of error
            if (tempStyleEl && tempStyleEl.parentNode) {
              tempStyleEl.parentNode.removeChild(tempStyleEl);
            }
          });
      } catch (canvasError) {
        console.error('Error initializing html2canvas for PDF:', canvasError);
        handleDownloadError(canvasError, downloadBtn);
        
        // Clean up style element in case of error
        if (tempStyleEl && tempStyleEl.parentNode) {
          tempStyleEl.parentNode.removeChild(tempStyleEl);
        }
      }
    }, 1000); // Increased delay to ensure all elements are rendered
  };

  // Helper function to handle download errors
  const handleDownloadError = (error, downloadBtn) => {
    console.error('Download error:', error);
    setError(error.message || 'Failed to download image');
    setIsLoading(false);
    
    if (downloadBtn) {
      downloadBtn.disabled = false;
    }
    
    alert('Failed to download image. Please try again. Error: ' + (error.message || 'Unknown error'));
  };

  // Render the active template based on the template prop
  const renderTemplate = () => {
    console.log('Rendering template:', template);
    
    try {
      switch (template) {
        case 'basic':
          return <BasicTemplate formData={formData} />;
        case 'minimal':
          return <MinimalTemplate formData={formData} />;
        case 'modern':
          return <ModernTemplate formData={formData} />;
        default:
          console.log('Using default template (basic) for unknown template:', template);
          return <BasicTemplate formData={formData} />;
      }
    } catch (error) {
      console.error('Error rendering template:', error);
      return (
        <div className="p-8">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Template</h2>
          <p className="text-gray-700">{error.message}</p>
        </div>
      );
    }
  };

  useEffect(() => {
    // Add title to the page
    document.title = `Invoice ${formData.invoiceNumber || 'Export'}`;
    
    // Load all fonts before rendering
    document.fonts.ready.then(() => {
      console.log('Fonts loaded for rendering');
    });
  }, [formData]);

  // Make sure the preview has reasonable borders/format
  return (
    <div className="export-page py-10 px-4 flex flex-col items-center">
      {!directDownload && (
        <div className="download-buttons-container">
          <button 
            onClick={downloadAsJpg}
            className="download-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner mr-2" style={{width: '16px', height: '16px'}}></span>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                </svg>
                Download as JPG
              </>
            )}
          </button>
          
          <button 
            onClick={downloadAsPdf}
            className="download-pdf-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner mr-2" style={{width: '16px', height: '16px'}}></span>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
                Download as PDF
              </>
            )}
          </button>
          
          <div className="text-xs text-gray-500 text-center mt-2">
            Paper size: {currentPaperSize.name}
          </div>
        </div>
      )}
      
      {error && (
        <div className="error-message fixed top-16 z-10">
          Error: {error}
        </div>
      )}

      <div 
        ref={invoiceRef}
        className={`a4-page export-invoice my-16 p-0 overflow-hidden bg-white print-container ${template === 'modern' ? 'modern-template' : ''}`}
        style={{
          width: `${currentPaperSize.pxWidth}px`,
          minHeight: `${currentPaperSize.pxHeight}px`,
        }}
      >
        {/* For the Modern template, we need to ensure the header is orange and the wave is fixed at bottom */}
        {template === 'modern' && (
          <style dangerouslySetInnerHTML={{__html: `
            .export-invoice .bg-var-primary {
              background-color: ${modernColor} !important;
            }
            .export-invoice .border-var-primary {
              border-color: ${modernColor} !important;
            }
            .export-invoice .fill-var-primary {
              fill: ${modernColor} !important;
            }
            .export-invoice .text-var-primary {
              color: ${modernColor} !important;
            }
            .export-invoice .text-white {
              color: #ffffff !important;
            }
            
            /* Fix wave at bottom for modern template */
            .export-invoice .bg-white.h-full.font-sans.relative {
              position: relative;
              min-height: 100%;
            }
            
            .export-invoice .bg-white.h-full.font-sans.relative .absolute.bottom-0 {
              position: absolute;
              bottom: 0;
              left: 0;
              width: 100%;
            }
          `}} />
        )}
        {renderTemplate()}
      </div>
    </div>
  );
}

export default ExportInvoice; 