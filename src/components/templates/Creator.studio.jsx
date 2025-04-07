import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import InvoiceForm from '../organisms/InvoiceForm';
import InvoicePreview from '../organisms/InvoicePreview';
import { BasicTemplate } from './invoice-templates/BasicTemplate';
import { MinimalTemplate } from './invoice-templates/MinimalTemplate';
import { ModernTemplate } from './invoice-templates/ModernTemplate';
import CeyAISupport from '../molecules/CeyAISupport';
import { generatePriceSuggestion } from '../../services/aiService';
import { saveInvoice, getSavedInvoices } from '../../services/storageService';

function CreatorStudioTemplate() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTemplate, setActiveTemplate] = useState('basic');
  const [formData, setFormData] = useState({
    // Company Details
    companyName: '',
    companyNumber: '',
    companyAddress: '',
    companyLogo: null,
    
    // Invoice Details
    invoiceNumber: '',
    issueDate: '',
    dueDate: '',
    
    // Customer Details
    customerName: '',
    customerNumber: '',
    customerAddress: '',
    
    // Items
    items: [{ description: '', quantity: '', price: '' }],
    
    // Payment Details
    currency: '',
    subtotal: '0.00',
    vat: '0.00',
    vatPercent: '',
    discount: '0.00',
    discountPercent: '',
    paymentMethod: '',
    bankName: '',
    accountNumber: '',
    bankSortCode: '',
    paymentReference: '',
    greetingMessage: '',
    termsAndCondition: '',
    
    // Calculated totals
    total: '0.00'
  });

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isGeneratingPrice, setIsGeneratingPrice] = useState(false);
  const lastDescriptionRef = useRef('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [invoiceTitle, setInvoiceTitle] = useState('');
  const [savedInvoices, setSavedInvoices] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize template from URL parameter if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const templateParam = params.get('template');
    
    if (templateParam && ['basic', 'minimal', 'modern'].includes(templateParam)) {
      setActiveTemplate(templateParam);
      setShowSuccessMessage(true);
      setSuccessMessage(`Template set to ${templateParam.charAt(0).toUpperCase() + templateParam.slice(1)}`);
      
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    }
    
    // Check if there's a saved invoice to load
    const savedInvoiceData = localStorage.getItem('loadInvoiceData');
    if (savedInvoiceData) {
      try {
        const parsedData = JSON.parse(savedInvoiceData);
        
        // Set the form data
        if (parsedData.formData) {
          setFormData(parsedData.formData);
        }
        
        // Set the template
        if (parsedData.template && ['basic', 'minimal', 'modern'].includes(parsedData.template)) {
          setActiveTemplate(parsedData.template);
        }
        
        // Show success message
        setShowSuccessMessage(true);
        setSuccessMessage('Saved invoice loaded successfully! / සුරකින ලද ගෙවීම් පත්‍රිකාව සාර්ථකව පූරණය විය!');
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
        
        // Clear the localStorage data to prevent reloading on refresh
        localStorage.removeItem('loadInvoiceData');
      } catch (error) {
        console.error('Error loading saved invoice:', error);
      }
    }
  }, [location]);

  // Handle template selection
  const handleTemplateSelect = (template) => {
    setActiveTemplate(template);
    setShowSuccessMessage(true);
    setSuccessMessage(`Template changed to ${template.charAt(0).toUpperCase() + template.slice(1)}`);
    
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  // Auto-calculate totals when items, VAT percent or discount percent change
  useEffect(() => {
    calculateTotals();
  }, [formData.items, formData.vatPercent, formData.discountPercent]);

  // AI price suggestion effect
  useEffect(() => {
    const getItemPriceSuggestion = async () => {
      // Check if the user has finished typing by waiting a moment
      const lastItem = formData.items[formData.items.length - 1];
      
      if (
        lastItem && 
        lastItem.description && 
        lastItem.description.length > 3 && 
        !lastItem.price && 
        lastItem.description !== lastDescriptionRef.current &&
        !isGeneratingPrice
      ) {
        lastDescriptionRef.current = lastItem.description;
        setIsGeneratingPrice(true);
        
        try {
          const response = await generatePriceSuggestion(lastItem.description);
          
          if (response.success && response.price) {
            // Update the price of the last item
            const updatedItems = [...formData.items];
            updatedItems[formData.items.length - 1] = {
              ...lastItem,
              price: response.price.toString()
            };
            
            setFormData(prevState => ({
              ...prevState,
              items: updatedItems
            }));
            
            setShowSuccessMessage(true);
            setSuccessMessage(`AI නිර්දේශිත මිල: $${response.price}`);
            setTimeout(() => {
              setShowSuccessMessage(false);
            }, 3000);
          }
        } catch (error) {
          console.error("Error getting price suggestion:", error);
        } finally {
          setIsGeneratingPrice(false);
        }
      }
    };
    
    getItemPriceSuggestion();
  }, [formData.items]);

  // Calculate invoice totals
  const calculateTotals = () => {
    const subtotal = formData.items.reduce((total, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.price) || 0;
      return total + (quantity * price);
    }, 0);
    
    const vatPercent = parseFloat(formData.vatPercent) || 0;
    const vatAmount = subtotal * (vatPercent / 100);
    
    const discountPercent = parseFloat(formData.discountPercent) || 0;
    const discountAmount = subtotal * (discountPercent / 100);
    
    const total = subtotal + vatAmount - discountAmount;
    
    setFormData(prevState => ({
      ...prevState,
      subtotal: subtotal.toFixed(2),
      vat: vatAmount.toFixed(2),
      discount: discountAmount.toFixed(2),
      total: total.toFixed(2)
    }));
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle item changes
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    
    setFormData(prevState => ({
      ...prevState,
      items: updatedItems
    }));
  };

  // Add a new item row
  const addItem = () => {
    setFormData(prevState => ({
      ...prevState,
      items: [...prevState.items, { description: '', quantity: '', price: '' }]
    }));
  };

  // Delete an item
  const deleteItem = (index) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index);
      setFormData(prevState => ({
        ...prevState,
        items: updatedItems
      }));
    }
  };

  // Handle logo upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prevState => ({
        ...prevState,
        companyLogo: URL.createObjectURL(file)
      }));
    }
  };
  
  // Handle applying terms and conditions from AI
  const handleApplyTerms = (termsText) => {
    setFormData(prevState => ({
      ...prevState,
      termsAndCondition: termsText
    }));
  };
  
  // Handle applying data from document analysis
  const handleApplyData = (parsedData) => {
    // Create a copy of the current form data to update
    let updatedFormData = { ...formData };
    
    // Update company information if available
    if (parsedData.company) {
      if (parsedData.company.name) updatedFormData.companyName = parsedData.company.name;
      if (parsedData.company.phone) updatedFormData.companyNumber = parsedData.company.phone;
      if (parsedData.company.address) updatedFormData.companyAddress = parsedData.company.address;
    }
    
    // Update customer information if available
    if (parsedData.customer) {
      if (parsedData.customer.name) updatedFormData.customerName = parsedData.customer.name;
      if (parsedData.customer.phone) updatedFormData.customerNumber = parsedData.customer.phone;
      if (parsedData.customer.address) updatedFormData.customerAddress = parsedData.customer.address;
    }
    
    // Update invoice information if available
    if (parsedData.invoice) {
      if (parsedData.invoice.number) updatedFormData.invoiceNumber = parsedData.invoice.number;
      if (parsedData.invoice.issueDate) updatedFormData.issueDate = parsedData.invoice.issueDate;
      if (parsedData.invoice.dueDate) updatedFormData.dueDate = parsedData.invoice.dueDate;
    }
    
    // Update payment information if available
    if (parsedData.payment) {
      if (parsedData.payment.method) updatedFormData.paymentMethod = parsedData.payment.method;
      if (parsedData.payment.bankName) updatedFormData.bankName = parsedData.payment.bankName;
      if (parsedData.payment.accountNumber) updatedFormData.accountNumber = parsedData.payment.accountNumber;
      if (parsedData.payment.sortCode) updatedFormData.bankSortCode = parsedData.payment.sortCode;
      if (parsedData.payment.reference) updatedFormData.paymentReference = parsedData.payment.reference;
    }
    
    // Update invoice items if available
    if (parsedData.items && parsedData.items.length > 0) {
      const validItems = parsedData.items.filter(item => 
        item.description || item.quantity || item.price
      );
      
      if (validItems.length > 0) {
        updatedFormData.items = validItems.map(item => ({
          description: item.description || '',
          quantity: item.quantity || '',
          price: item.price || ''
        }));
      }
    }
    
    // Update the form data
    setFormData(updatedFormData);
    
    // Show success message
    setShowSuccessMessage(true);
    setSuccessMessage('Document analyzed and data applied to form');
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  // Render the active template
  const renderActiveTemplate = () => {
    switch (activeTemplate) {
      case 'basic':
        return <BasicTemplate formData={formData} />;
      case 'minimal':
        return <MinimalTemplate formData={formData} />;
      case 'modern':
        return <ModernTemplate formData={formData} />;
      default:
        return <BasicTemplate formData={formData} />;
    }
  };

  // Save invoice function
  const handleSaveInvoice = () => {
    setShowSaveModal(true);
    
    // Generate a default title based on invoice details
    if (!invoiceTitle) {
      const customerName = formData.customerName || 'Unnamed Customer';
      const invoiceNumber = formData.invoiceNumber || 'Draft';
      setInvoiceTitle(`Invoice for ${customerName} - ${invoiceNumber}`);
    }
    
    // Load the saved invoices
    const invoicesList = getSavedInvoices();
    setSavedInvoices(invoicesList);
  };
  
  // Confirm save invoice
  const confirmSaveInvoice = () => {
    setIsSaving(true);
    
    try {
      // Create full invoice object to save
      const invoiceToSave = {
        title: invoiceTitle,
        template: activeTemplate,
        formData: formData,
        createdAt: new Date().toISOString()
      };
      
      // Save the invoice
      const result = saveInvoice(invoiceToSave);
      
      if (result.success) {
        // Close the modal
        setShowSaveModal(false);
        
        // Show success message
        setShowSuccessMessage(true);
        setSuccessMessage('Invoice saved successfully! / ගෙවීම් පත්‍රිකාව සාර්ථකව සුරකින ලදී!');
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
        
        // Reset invoice title
        setInvoiceTitle('');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      // Show error message
      setShowSuccessMessage(true);
      setSuccessMessage(`Error: ${error.message}`);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Cancel save
  const cancelSave = () => {
    setShowSaveModal(false);
    setInvoiceTitle('');
  };

  // Handle invoice selection
  const handleSelectInvoice = (invoice) => {
    // Store the invoice data in localStorage
    localStorage.setItem('loadInvoiceData', JSON.stringify({
      formData: invoice.data.formData,
      template: invoice.data.template
    }));
    
    // Navigate to Creator Studio
    navigate('/creator-studio');
  };

  return (
    <div className="bg-gray-50 h-screen overflow-hidden flex flex-col font-sans">
      {showSuccessMessage && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-3 rounded-md shadow-lg z-50 flex items-center animate-fade-in-out">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>{successMessage}</span>
        </div>
      )}
      
      {/* View Saved Invoices Button */}
      <div className="fixed top-5 left-5 z-50 flex space-x-2">
        <Link
          to="/"
          className="px-4 py-2 bg-white text-var-primary border border-var-primary rounded-md shadow-sm hover:bg-gray-50 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h2a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h2" />
          </svg>
          Home
        </Link>
        <Link
          to="/saved-invoices"
          className="px-4 py-2 bg-white text-var-primary border border-var-primary rounded-md shadow-sm hover:bg-gray-50 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
          Saved Invoices
        </Link>
      </div>
      
      {/* Save Invoice Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-full">
            <h3 className="text-lg font-medium mb-4">Save Invoice / ගෙවීම් පත්‍රිකාව සුරකින්න</h3>
            
            <div className="mb-4">
              <label htmlFor="invoiceTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Title / මාතෘකාව
              </label>
              <input
                type="text"
                id="invoiceTitle"
                value={invoiceTitle}
                onChange={(e) => setInvoiceTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter a title for this invoice"
              />
            </div>
            
            {savedInvoices.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">
                  You have {savedInvoices.length} saved invoice(s).
                </p>
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelSave}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                disabled={isSaving}
              >
                Cancel / අවලංගු
              </button>
              <button
                onClick={confirmSaveInvoice}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                disabled={isSaving || !invoiceTitle.trim()}
              >
                {isSaving ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  'Save / සුරකින්න'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row h-full">
        {/* Left Side - Form */}
        <InvoiceForm 
          formData={formData}
          handleChange={handleChange}
          handleItemChange={handleItemChange}
          addItem={addItem}
          deleteItem={deleteItem}
          handleLogoUpload={handleLogoUpload}
          handleSaveInvoice={handleSaveInvoice}
        />
        
        {/* Right Side - Preview */}
        <InvoicePreview 
          formData={formData} 
          handleTemplateSelect={handleTemplateSelect}
          handleSaveInvoice={handleSaveInvoice}
        >
          {renderActiveTemplate()}
        </InvoicePreview>
      </div>
      
      {/* CeyAI Support Widget */}
      <CeyAISupport onApplyTerms={handleApplyTerms} onApplyData={handleApplyData} />
      
      {/* Add CSS for custom scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
        
        /* Firefox scrollbar */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1);
        }
        
        /* Success message animation */
        .animate-fade-in-out {
          animation: fadeInOut 3s ease-in-out;
        }
        
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-20px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-20px); }
        }
        
        /* A4 Paper Styling */
        .a4-page-container {
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          width: 100%;
          overflow: hidden;
        }
        
        .a4-page {
          /* A4 is 210mm × 297mm */
          width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          box-sizing: border-box;
          background-color: white;
          position: relative;
        }
        
        @media screen and (max-width: 768px) {
          .a4-page {
            width: 100%;
            transform-origin: top center !important;
          }
        }
        
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          
          .a4-page-container {
            padding: 0;
            background: white;
          }
          
          .a4-page {
            width: 210mm;
            height: 297mm;
            margin: 0;
            box-shadow: none;
            page-break-after: always;
          }
        }
      `}</style>
    </div>
  );
}

export default CreatorStudioTemplate;