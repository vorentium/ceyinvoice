import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import HeightIcon from '@mui/icons-material/Height';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import A4Canvas from './A4Canvas';
import { supabase } from '../../../../../../utils/supabaseClient';
import { AlertTriangle } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

// Default A4 dimensions in points (standard for PDF)
// 1 point = 1/72 inch. A4 is 8.27 x 11.69 inches.
// Width = 8.27 * 72 = 595.44 points
// Height = 11.69 * 72 = 841.68 points
// Using common approximations for pixel-like values in Konva/Canvas if DEFAULT_A4_WIDTH was for that.
// For pdf-lib, it's better to think in points. We will scale the image to fit standard A4.
const PDF_A4_WIDTH_POINTS = 595.28;
const PDF_A4_HEIGHT_POINTS = 841.89;

// Original DEFAULT_A4_WIDTH and DEFAULT_A4_HEIGHT might be for the A4Canvas component's internal pixel sizing.
const DEFAULT_A4_CANVAS_WIDTH = 794; // Assuming this was pixel width for display
const DEFAULT_A4_CANVAS_HEIGHT = 1123; // Assuming this was pixel height for display

const InvoiceView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const invoiceId = searchParams.get('id');
  const templateId = searchParams.get('templateId');
  
  const [scale, setScale] = useState(1.0);
  const [canvasHeight, setCanvasHeight] = useState(DEFAULT_A4_CANVAS_HEIGHT);
  const [showHeightControls, setShowHeightControls] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);
  const [canvasElements, setCanvasElements] = useState([]);
  const [invoiceData, setInvoiceData] = useState(null);
  const [templateName, setTemplateName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showZoomWarning, setShowZoomWarning] = useState(false);
  
  const stageRef = useRef(null);
  
  const minZoom = 0.2;
  const maxZoom = 3.0;
  const zoomStep = 0.1;
  
  const heightStep = 100;
  const minHeight = DEFAULT_A4_CANVAS_HEIGHT;
  const maxHeight = 3000;

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let templateElements = [];
        let invoiceDetails = null;
        
        if (location.state?.templateElements && location.state?.invoiceData) {
          templateElements = location.state.templateElements;
          setTemplateName(location.state.templateName || 'Invoice Template');
          invoiceDetails = location.state.invoiceData;
          
          if (invoiceDetails.client_id && !invoiceDetails.customerName && !invoiceDetails.customer_name) {
            const { data: clientData } = await supabase.from('clients').select('*').eq('id', invoiceDetails.client_id).single();
            if (clientData) {
                invoiceDetails.customerName = clientData.name || clientData.client_name;
                invoiceDetails.customerAddress = clientData.address || clientData.client_address;
                invoiceDetails.customerMobile = clientData.phone || clientData.mobile || clientData.client_phone;
            }
          }
          setInvoiceData(invoiceDetails);
        } else if (invoiceId) {
          const { data: invData, error: invoiceError } = await supabase.from('invoice_details').select('*').eq('id', invoiceId).single();
          if (invoiceError) throw new Error(`Error fetching invoice: ${invoiceError.message}`);
          if (!invData) throw new Error('Invoice not found');
          
          if (invData.client_id) {
            const { data: clientData } = await supabase.from('clients').select('*').eq('id', invData.client_id).single();
            if (clientData) {
              invData.customerName = clientData.name || clientData.client_name;
              invData.customerAddress = clientData.address || clientData.client_address;
              invData.customerMobile = clientData.phone || clientData.mobile || clientData.client_phone;
            }
          }
          setInvoiceData(invData);
          invoiceDetails = invData;
          
          const effectiveTemplateId = templateId || invData.template_id || invData.templateId;
          if (!effectiveTemplateId) throw new Error('No template ID found. Please assign a template.');
          
          const { data: tmplData, error: templateError } = await supabase.from('templates').select('elements, name').eq('id', effectiveTemplateId).single();
          if (templateError) throw new Error(`Error fetching template: ${templateError.message}`);
          if (!tmplData) throw new Error('Template not found');
          
          templateElements = tmplData.elements || [];
          setTemplateName(tmplData.name || 'Invoice Template');
        } else {
          throw new Error('Missing invoice ID or template ID');
        }
        
        if (templateElements && invoiceDetails) {
          const processedElements = processTemplateElements(templateElements, invoiceDetails);
          setCanvasElements(processedElements);
        } else if (invoiceDetails) {
          console.warn("No template elements found, but invoice data is present. Consider a fallback or error.")
        }
      } catch (err) {
        setError(err.message);
        console.error("Error loading data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [invoiceId, templateId, location.state, navigate]);

  const processTemplateElements = (elements, currentInvoiceData) => {
    if (!elements || !Array.isArray(elements) || !currentInvoiceData) return [];
    
    return elements.map(element => {
      const newElement = { ...element, props: { ...element.props } };
      if (element.props?.placeholderId) {
        let textValue = '';
        switch (element.props.placeholderId) {
          case 'ph-invoice-no': textValue = currentInvoiceData.invoice_number || ''; break;
          case 'ph-invoice-number': textValue = `Invoice #: ${currentInvoiceData.invoice_number || ''}`; break;
          case 'ph-date': textValue = `Date: ${formatDate(currentInvoiceData.issued_date) || ''}`; break;
          case 'ph-issue-date': textValue = formatDate(currentInvoiceData.issued_date) || ''; break;
          case 'ph-due-date': textValue = formatDate(currentInvoiceData.due_date) || ''; break;
          case 'ph-company-name': textValue = currentInvoiceData.company_name || ''; break;
          case 'ph-company-address': textValue = currentInvoiceData.company_address || ''; break;
          case 'ph-company-phone': textValue = currentInvoiceData.company_mobile || ''; break;
          case 'ph-customer-name': textValue = currentInvoiceData.customerName || currentInvoiceData.customer_name || ''; break;
          case 'ph-customer-mobile': textValue = currentInvoiceData.customerMobile || currentInvoiceData.customer_mobile || ''; break;
          case 'ph-customer-addr1': textValue = currentInvoiceData.customerAddress || currentInvoiceData.customer_address || ''; break;
          case 'ph-item-name': textValue = currentInvoiceData.items?.[0]?.description || ''; break;
          case 'ph-item-quantity': textValue = String(currentInvoiceData.items?.[0]?.quantity || ''); break;
          case 'ph-item-price': textValue = formatCurrency(currentInvoiceData.items?.[0]?.unitPrice || 0, false); break;
          case 'ph-item-amount': textValue = formatCurrency(currentInvoiceData.items?.[0]?.amount || 0, false); break;
          case 'ph-subtotal': textValue = formatCurrency(currentInvoiceData.subtotal || 0, false); break;
          case 'ph-total': textValue = formatCurrency(currentInvoiceData.total_amount || 0, false); break;
          default: textValue = element.props.text || '';
        }
        newElement.props.text = textValue;
      }
      return newElement;
    });
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try { return new Date(dateString).toLocaleDateString(); } catch (e) { return dateString; }
  };
  
  const formatCurrency = (amount, includePrefix = true) => {
    if (amount === undefined || amount === null) return '';
    const val = parseFloat(amount).toFixed(2);
    return includePrefix ? `$${val}` : val;
  };

  const handleZoomIn = () => setScale(s => Math.min(maxZoom, s + zoomStep));
  const handleZoomOut = () => setScale(s => Math.max(minZoom, s - zoomStep));
  useEffect(() => setShowZoomWarning(scale !== 1.0), [scale]);

  const handleIncreaseHeight = () => setCanvasHeight(h => Math.min(maxHeight, h + heightStep));
  const handleDecreaseHeight = () => setCanvasHeight(h => Math.max(minHeight, h - heightStep));
  const toggleHeightControls = () => setShowHeightControls(p => !p);

  const handleSelectElement = (id) => setSelectedElement(id);
  const handleUpdateElement = (updated) => setCanvasElements(els => els.map(el => el.id === updated.id ? updated : el));
  const handleGoBack = () => navigate('/dashboard');
  const handleStageClick = (e) => { if (e.target === e.target.getStage()) setSelectedElement(null); };

  const handleDownloadPDF = async () => {
    if (!stageRef.current?.getImageDataURL && !stageRef.current?.toDataURL) {
      alert('Cannot generate PDF: Canvas component is not ready or does not support image export.');
      console.error('stageRef.current is null or lacks getImageDataURL/toDataURL method');
      return;
    }
    if (isLoading) {
      alert('Data is still loading. Please wait.');
      return;
    }

    setIsGeneratingPdf(true);
    const prevScale = scale;

    const defaultFilename = invoiceData?.invoice_number || invoiceId || templateName?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'invoice';
    const finalFilename = `${defaultFilename.replace(/[^a-z0-9\-_\s]/gi, '_').replace(/\s+/g, '_')}.pdf`;

    try {
      let imageDataUrl;
      const captureWidth = DEFAULT_A4_CANVAS_WIDTH;
      const captureHeight = canvasHeight;
      const pixelRatioForPdf = 3;

      if (typeof stageRef.current.getImageDataURL === 'function') {
        imageDataUrl = stageRef.current.getImageDataURL({
          x: 0, y: 0,
          width: captureWidth,
          height: captureHeight,
          pixelRatio: pixelRatioForPdf
        });
      } else if (typeof stageRef.current.toDataURL === 'function') {
        imageDataUrl = stageRef.current.toDataURL({
          x: 0, y: 0,
          width: captureWidth,
          height: captureHeight,
          pixelRatio: pixelRatioForPdf
        });
      } else {
        throw new Error('A4Canvas component does not have a recognized method to export image data.');
      }
      
      if (!imageDataUrl) throw new Error("Failed to generate image data from A4Canvas.");
      console.log(`Generated image data URL (pixelRatio: ${pixelRatioForPdf}), length: ${imageDataUrl.length}`);

      const pdfDoc = await PDFDocument.create();
      const pngImage = await pdfDoc.embedPng(imageDataUrl);
      
      const sourceImgWidth = pngImage.width;
      const sourceImgHeight = pngImage.height;

      const imageAspectRatio = sourceImgWidth / sourceImgHeight;
      const pdfPageAspectRatio = PDF_A4_WIDTH_POINTS / PDF_A4_HEIGHT_POINTS;

      let renderWidth, renderHeight;
      if (imageAspectRatio > pdfPageAspectRatio) {
        renderWidth = PDF_A4_WIDTH_POINTS;
        renderHeight = PDF_A4_WIDTH_POINTS / imageAspectRatio;
      } else {
        renderHeight = PDF_A4_HEIGHT_POINTS;
        renderWidth = PDF_A4_HEIGHT_POINTS * imageAspectRatio;
      }
      
      if (renderWidth > PDF_A4_WIDTH_POINTS) {
          renderWidth = PDF_A4_WIDTH_POINTS;
          renderHeight = PDF_A4_WIDTH_POINTS / imageAspectRatio;
      }

      const page = pdfDoc.addPage([PDF_A4_WIDTH_POINTS, PDF_A4_HEIGHT_POINTS]);
      
      page.drawImage(pngImage, {
        x: (PDF_A4_WIDTH_POINTS - renderWidth) / 2,
        y: (PDF_A4_HEIGHT_POINTS - renderHeight) / 2,
        width: renderWidth,
        height: renderHeight,
      });

      const pdfBytes = await pdfDoc.save();
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = finalFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
      
      console.log(`PDF "${finalFilename}" generated and download initiated.`);

    } catch (err) {
      console.error('Client-side PDF generation error:', err);
      alert(`Failed to generate PDF: ${err.message}`);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden relative">
      {isGeneratingPdf && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-4">
            <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-gray-700 font-medium">Generating PDF, please wait...</span>
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="bg-black shadow-md z-10">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center">
              <button onClick={handleGoBack} className="flex items-center px-3 py-2 border border-white rounded text-sm text-white hover:bg-gray-900 transition mr-4 cursor-pointer">
                <ArrowBackIcon className="mr-1" /> 
                <span className="hidden sm:inline">Back to Dashboard</span>
              </button>
            </div>
            <div className="flex items-center text-white">
              <h1 className="text-lg font-medium truncate max-w-[200px] md:max-w-md">
                {isLoading ? 'Loading...' : templateName || 'Invoice Viewer'}
              </h1>
            </div>
            <div className="flex items-center">
              <button 
                onClick={handleDownloadPDF}
                className="flex items-center px-3 py-2 bg-blue-500 rounded text-sm text-white hover:bg-blue-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isGeneratingPdf || isLoading}
              >
                {isGeneratingPdf ? (
                   <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                ) : (
                <DownloadIcon className="mr-1" /> 
                 )}
                <span className="hidden sm:inline">
                  {isGeneratingPdf ? 'Generating...' : 'Download PDF'}
                </span>
              </button>
            </div>
          </div>
        </header>
        
        {showZoomWarning && (
           <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 text-sm flex items-center z-5" role="alert">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <p><span className="font-medium">Warning:</span> Zoom level is not 100%. This might affect the PDF.</p>
           </div>
        )}

        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-10 relative">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neutral-900"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="bg-red-50 p-4 rounded-md text-red-700 max-w-md">
                <h3 className="font-bold">Error Loading Data</h3>
                <p>{error}</p>
              </div>
            </div>
          ) : (
            <div 
                className="flex min-h-full items-start justify-center" 
                style={{
                }}
            >
              <A4Canvas 
                ref={stageRef}
                scale={scale}
                canvasElements={canvasElements}
                selectedElement={selectedElement}
                onSelectElement={handleSelectElement}
                onUpdateElement={handleUpdateElement}
                canvasHeight={canvasHeight}
                canvasWidth={DEFAULT_A4_CANVAS_WIDTH}
                onStageClick={handleStageClick}
              />
            </div>
          )}
        </main>
      </div>

      <div className="fixed bottom-4 right-4 flex flex-col bg-white rounded-lg shadow-lg p-2 z-20">
        <button onClick={handleZoomIn} className="p-2 hover:bg-gray-100 rounded transition mb-1 cursor-pointer" aria-label="Zoom In"><ZoomInIcon /></button>
        <div className="text-center py-1 font-medium text-sm">{Math.round(scale * 100)}%</div>
        <button onClick={handleZoomOut} className="p-2 hover:bg-gray-100 rounded transition mt-1 cursor-pointer" aria-label="Zoom Out"><ZoomOutIcon /></button>
        <div className="w-full border-t my-2 border-gray-200"></div>
        <button onClick={toggleHeightControls} className="p-2 hover:bg-gray-100 rounded transition cursor-pointer" aria-label="Adjust Height"><HeightIcon /></button>
      </div>
      
      {showHeightControls && (
        <div className="fixed bottom-4 right-20 flex flex-col bg-white rounded-lg shadow-lg p-2 z-20">
          <button onClick={handleIncreaseHeight} className="p-2 hover:bg-gray-100 rounded transition mb-1 cursor-pointer" aria-label="Increase Height"><AddIcon /></button>
          <div className="text-center py-1 font-medium text-xs">{Math.round(canvasHeight / DEFAULT_A4_CANVAS_HEIGHT * 100)}% H</div>
          <button onClick={handleDecreaseHeight} className="p-2 hover:bg-gray-100 rounded transition mt-1 cursor-pointer" aria-label="Decrease Height" disabled={canvasHeight <= minHeight}><RemoveIcon /></button>
        </div>
      )}
    </div>
  );
};

export default InvoiceView;
