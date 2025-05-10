import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase, getUserClients, getInvoiceById, recalculateAndSaveDashboardStats } from '../../../utils/supabaseClient'; // Import getInvoiceById and recalculateAndSaveDashboardStats

function Form() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Initialize useSearchParams
  const invoiceId = searchParams.get('invoice'); // Get the invoice ID from URL if present
  const isEditMode = !!invoiceId; // Check if we're in edit mode
  
  const [formData, setFormData] = useState({
    template: '', // Initialize template ID as empty
    invoiceNo: '',
    companyName: '',
    companyMobile: '',
    companyAddress: '',
    customerName: '',
    customerMobile: '',
    customerAddress: '',
    issuedDate: '',
    dueDate: '',
    items: [{ description: '', quantity: 1, unitPrice: 0, amount: 0 }],
    tax: 0,
    discount: 0,
    paymentMethod: 'cash',
    status: 'Pending',
    terms: '',
    greeting: 'Thank you for your business!',
  });

  const [userTemplates, setUserTemplates] = useState([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [userClients, setUserClients] = useState([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [clientFetchError, setClientFetchError] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState(''); // State for selected client ID

  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ success: null, message: '' });

  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const [invoiceError, setInvoiceError] = useState(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedInvoiceId, setSavedInvoiceId] = useState(null);

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [name]: value };

    // Recalculate amount for the changed item
    const quantity = parseFloat(updatedItems[index].quantity) || 0;
    const unitPrice = parseFloat(updatedItems[index].unitPrice) || 0;
    updatedItems[index].amount = quantity * unitPrice;

    setFormData({ ...formData, items: updatedItems });
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, unitPrice: 0, amount: 0 }],
    });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  // --- Calculations ---
  useEffect(() => {
    // Calculate Subtotal
    const calculatedSubtotal = formData.items.reduce((sum, item) => sum + item.amount, 0);
    setSubtotal(calculatedSubtotal);

    // Calculate Total
    const taxAmount = calculatedSubtotal * (parseFloat(formData.tax) / 100 || 0);
    const discountAmount = calculatedSubtotal * (parseFloat(formData.discount) / 100 || 0);
    const calculatedTotal = calculatedSubtotal + taxAmount - discountAmount;
    setTotal(calculatedTotal);
  }, [formData.items, formData.tax, formData.discount]);

  // --- Fetch User Templates and Clients ---
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoadingTemplates(true);
      setIsLoadingClients(true);
      setFetchError(null);
      setClientFetchError(null);

      try {
        // 1. Get current user
        console.log('Attempting to get user...');
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError) {
          console.error('Error getting user:', userError);
          throw userError;
        }

        if (!user) {
           console.log('No user logged in, redirecting to login.');
           navigate('/login'); // Or your login route
           return;
        }

        console.log('User found:', user.id);

        // 2. Fetch templates for the user
        // Assuming a 'templates' table with 'id', 'name', and 'user_id' columns
        console.log('Attempting to fetch templates for user:', user.id);
        const { data: templatesData, error: templatesError } = await supabase
          .from('templates')
          .select('id, name')
          .eq('user_id', user.id)
          .order('name'); // Order alphabetically

        if (templatesError) throw templatesError;

        console.log('Templates fetched successfully:', templatesData);
        setUserTemplates(templatesData || []);

        // Set default template if available
        if (templatesData && templatesData.length > 0) {
          setFormData(prevData => ({ ...prevData, template: templatesData[0].id }));
        } else {
          setFormData(prevData => ({ ...prevData, template: '' })); // No templates found
        }

        // --- Fetch Clients ---
        try {
            const clientsData = await getUserClients(); // Use the imported function
            setUserClients(clientsData || []);
             // Optionally set a default selected client or leave blank
             // setSelectedClientId('');
             // setFormData(prevData => ({ ...prevData, customerName: '', customerMobile: '', customerAddress: '' }));
        } catch (error) {
            console.error('Error fetching clients:', error);
            setClientFetchError('Failed to load clients.');
            setUserClients([]);
        } finally {
            setIsLoadingClients(false);
        }
        
        // --- Load Invoice Data if in Edit Mode ---
        if (isEditMode) {
          await fetchInvoiceData(invoiceId);
        }

      } catch (error) {
        // Handle errors getting user or other critical issues
        console.error('Error fetching initial data:', error);
        setFetchError('Failed to load initial data. Please ensure you are logged in.');
        setIsLoadingTemplates(false);
        setIsLoadingClients(false);
      } finally {
        console.log('Setting isLoadingTemplates to false.');
        setIsLoadingTemplates(false);
      }
    };

    fetchInitialData();
  }, [navigate, invoiceId, isEditMode]);

  // Function to fetch invoice data when in edit mode
  const fetchInvoiceData = async (id) => {
    if (!id) return;
    
    setLoadingInvoice(true);
    setInvoiceError(null);
    
    try {
      const invoiceData = await getInvoiceById(id);
      
      if (!invoiceData) {
        throw new Error('Invoice not found');
      }
      
      // Find the client in the userClients array
      const clientMatch = userClients.find(
        client => client.id === invoiceData.clientId || client.client_id === invoiceData.clientId
      );
      
      if (clientMatch) {
        setSelectedClientId(clientMatch.id);
      } else {
        console.warn('Client not found in available clients list');
      }
      
      // Map invoice data to formData structure
      setFormData({
        template: invoiceData.templateId || '',
        invoiceNo: invoiceData.invoiceNumber || '',
        companyName: invoiceData.companyName || '',
        companyMobile: invoiceData.companyMobile || '',
        companyAddress: invoiceData.companyAddress || '',
        customerName: invoiceData.clientName || '',
        customerMobile: invoiceData.clientPhone || '',
        customerAddress: invoiceData.clientAddress || '',
        issuedDate: invoiceData.date || '',
        dueDate: invoiceData.dueDate || '',
        items: invoiceData.items?.map(item => ({
          description: item.description || '',
          quantity: item.quantity || 1,
          unitPrice: item.unitPrice || 0,
          amount: item.amount || 0
        })) || [{ description: '', quantity: 1, unitPrice: 0, amount: 0 }],
        tax: invoiceData.tax || 0,
        discount: invoiceData.discount || 0,
        paymentMethod: invoiceData.paymentMethod || 'cash',
        status: invoiceData.status || 'Pending',
        terms: invoiceData.terms || '',
        greeting: invoiceData.greeting || 'Thank you for your business!',
      });
      
    } catch (error) {
      console.error('Error fetching invoice data:', error);
      setInvoiceError(`Failed to load invoice: ${error.message}`);
    } finally {
      setLoadingInvoice(false);
    }
  };

  // --- Handler for Client Selection Change ---
  const handleClientSelect = (e) => {
    const clientId = e.target.value;
    setSelectedClientId(clientId);

    if (clientId) {
      const selectedClient = userClients.find(client => client.id === clientId);
      if (selectedClient) {
        setFormData(prevData => ({
          ...prevData,
          customerName: selectedClient.name || '',
          customerMobile: selectedClient.phone || '',
          customerAddress: selectedClient.address || '',
        }));
      } else {
         // Handle case where client ID is selected but not found (shouldn't happen)
         setFormData(prevData => ({
           ...prevData,
           customerName: '',
           customerMobile: '',
           customerAddress: '',
         }));
      }
    } else {
      // No client selected (e.g., user selected "-- Select Client --")
      setFormData(prevData => ({
        ...prevData,
        customerName: '',
        customerMobile: '',
        customerAddress: '',
      }));
    }
  };

  // --- Trigger Dashboard Stats Update ---
  const triggerDashboardStatsUpdate = async (userId) => {
    if (!userId) return;
    console.log(`Triggering dashboard stats recalculation for user: ${userId}...`);
    try {
      // Call the centralized function from supabaseClient
      await recalculateAndSaveDashboardStats(userId);
      console.log('Dashboard stats update completed successfully. Counts for pending/paid/overdue invoices have been updated.');
    } catch (error) {
      // Log the error but don't block the UI
      console.error('Error updating dashboard stats:', error);
    }
  };

  // --- Generate Invoice --- (New Function)
  const handleGenerateInvoice = async (e) => {
    e.preventDefault();
    if (!selectedClientId) {
        setSaveStatus({ success: false, message: 'Please select a client first.' });
        return;
    }
    if (!formData.template) {
         setSaveStatus({ success: false, message: 'Please select a template.' });
         return;
    }
    if (formData.items.length === 0 || formData.items.some(item => !item.description)) {
        setSaveStatus({ success: false, message: 'Please add at least one item with a description.' });
        return;
    }

    setIsSaving(true);
    setSaveStatus({ success: null, message: '' });

    try {
        // 1. Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            throw new Error('Authentication error. Please log in again.');
        }

        // 2. Prepare data for Supabase
        const invoicePayload = {
            user_id: user.id,
            template_id: formData.template,
            client_id: selectedClientId, // This is the main ID from clients table
            invoice_number: formData.invoiceNo,
            company_name: formData.companyName,
            company_mobile: formData.companyMobile,
            company_address: formData.companyAddress,
            issued_date: formData.issuedDate || null, // Handle empty dates
            due_date: formData.dueDate || null, // Handle empty dates
            items: formData.items.map(item => ({ // Ensure structure matches DB (e.g., JSONB)
                description: item.description,
                quantity: Number(item.quantity) || 0,
                unitPrice: Number(item.unitPrice) || 0,
                amount: Number(item.amount) || 0
            })),
            tax: Number(formData.tax) || 0,
            discount: Number(formData.discount) || 0,
            subtotal: Number(subtotal) || 0,
            total_amount: Number(total) || 0,
            payment_method: formData.paymentMethod,
            terms: formData.terms,
            greeting: formData.greeting,
            status: determineFinalStatus(formData.dueDate, formData.status),
            // Add other necessary fields if your table has them (e.g., currency)
        };

        // 3. Insert or Update in Supabase based on mode
        let result;
        let error;
        
        if (isEditMode) {
          // Update existing invoice
          const { data, error: updateError } = await supabase
            .from('invoice_details')
            .update(invoicePayload)
            .eq('id', invoiceId)
            .select();
            
          error = updateError;
          result = data?.[0];
        } else {
          // Insert new invoice
          const { data, error: insertError } = await supabase
            .from('invoice_details')
            .insert([invoicePayload])
            .select();
            
          error = insertError;
          result = data?.[0];
        }

        if (error) {
          console.error('Supabase error:', error);
          throw new Error(`Failed to ${isEditMode ? 'update' : 'save'} invoice: ${error.message}`);
        }

        // Handle Success
        setSaveStatus({ 
          success: true, 
          message: `Invoice ${isEditMode ? 'updated' : 'generated'} successfully!` 
        });
        
        // Save the invoice ID for potential download
        setSavedInvoiceId(result?.id || invoiceId);
        
        // Show success modal instead of auto-navigating
        setShowSuccessModal(true);
        
        // Update dashboard stats using the new trigger function
        await triggerDashboardStatsUpdate(user.id); // Call the renamed trigger function
        
        // Remove the auto-navigation
        // setTimeout(() => {
        //   navigate('/invoices');
        // }, 1500);

    } catch (error) {
        console.error('Error generating invoice:', error);
        setSaveStatus({ success: false, message: error.message || 'An unexpected error occurred.' });
    } finally {
        setIsSaving(false);
    }
  };

  // Helper function to determine final status
  const determineFinalStatus = (dueDateString, currentStatus) => {
     if (currentStatus !== 'Pending') {
         return currentStatus; // If manually set to Paid or Overdue, respect that
     }
     if (!dueDateString) {
         return 'Pending'; // No due date, remains Pending
     }
     try {
         const today = new Date();
         today.setHours(0, 0, 0, 0); // Compare dates only, ignore time

         const dueDate = new Date(dueDateString);
         dueDate.setHours(0, 0, 0, 0); // Compare dates only

         if (dueDate < today) {
             return 'Overdue';
         }
     } catch (e) {
         console.error("Error parsing due date:", e);
         // Fallback if date parsing fails
     }
     return 'Pending'; // Default if due date is today or in the future
  };

  // --- Navigation handlers for success modal ---
  const handleDownloadInvoice = async () => {
    // Instead of direct navigation, first fetch the template design
    if (savedInvoiceId) {
      try {
        // Show loading indicator
        setSaveStatus({ success: true, message: "Loading template design..." });
        
        // 1. Get the invoice details to find the template_id
        const { data: invoiceData, error: invoiceError } = await supabase
          .from('invoice_details')
          .select('*')
          .eq('id', savedInvoiceId)
          .single();
          
        if (invoiceError) throw new Error(`Error fetching invoice: ${invoiceError.message}`);
        if (!invoiceData) throw new Error('Invoice not found');
        
        // Get client details if needed
        if (invoiceData.client_id) {
          try {
            const { data: clientData, error: clientError } = await supabase
              .from('clients')
              .select('*')
              .eq('id', invoiceData.client_id)
              .single();
              
            if (!clientError && clientData) {
              // Add customer data to invoice data
              invoiceData.customerName = clientData.name || clientData.client_name;
              invoiceData.customerAddress = clientData.address || clientData.client_address;
              invoiceData.customerMobile = clientData.phone || clientData.mobile || clientData.client_phone;
            }
          } catch (err) {
            console.warn("Could not fetch client details:", err);
          }
        }
        
        const templateId = invoiceData.template_id;
        if (!templateId) throw new Error('No template associated with this invoice');
        
        // 2. Get the template design data from templates table
        const { data: templateData, error: templateError } = await supabase
          .from('templates')
          .select('elements, name, description')
          .eq('id', templateId)
          .single();
          
        if (templateError) throw new Error(`Error fetching template: ${templateError.message}`);
        if (!templateData) throw new Error('Template design not found');
        
        console.log("Template design loaded:", templateData);
        
        // 3. Navigate to InvoiceView with the necessary parameters
        navigate(`/invoice-view?id=${savedInvoiceId}&templateId=${templateId}`, {
          state: {
            templateElements: templateData.elements,
            templateName: templateData.name,
            invoiceData: invoiceData
          }
        });
        
      } catch (error) {
        console.error('Error loading template design:', error);
        setSaveStatus({
          success: false,
          message: `Failed to load template: ${error.message}`
        });
      }
    } else {
      console.error('No saved invoice ID found');
      setSaveStatus({
        success: false,
        message: "Invoice ID not found. Please try again."
      });
    }
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black-transparent">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Success!
            </h3>
            
            <p className="text-center text-gray-600 mb-6">
              Your invoice has been {isEditMode ? 'updated' : 'created'} successfully. What would you like to do next?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownloadInvoice}
                className="flex-1 px-4 py-2 bg-neutral-800 text-white rounded hover:bg-neutral-900 transition-colors flex items-center justify-center cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Apply
              </button>
              
              <button
                onClick={handleGoToDashboard}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors cursor-pointer"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header with Back Arrow */}
        <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center">
            <button
                onClick={() => navigate('/dashboard')}
                className="mr-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Back to Dashboard"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Create New Invoice</h2>
        </div>

        <form className="p-4 sm:p-6 space-y-6">
          {/* Template Selection */}
          <div className="">
            <label htmlFor="template" className="block text-sm font-medium text-gray-700 mb-1">Template</label>
            <select
              id="template"
              name="template"
              value={formData.template}
              onChange={handleInputChange}
              disabled={isLoadingTemplates || fetchError}
              className={`w-full px-3 py-2 border ${fetchError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-700 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed`}
            >
              {isLoadingTemplates ? (
                <option value="" disabled>Loading templates...</option>
              ) : fetchError ? (
                 <option value="" disabled>{fetchError}</option>
              ) : userTemplates.length === 0 ? (
                <option value="" disabled>No templates found</option>
              ) : (
                userTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))
              )}
            </select>
            {fetchError && <p className="mt-1 text-xs text-red-600">{fetchError}</p>}
          </div>

          {/* Invoice Number */}
          <div className="">
            <label htmlFor="invoiceNo" className="block text-sm font-medium text-gray-700 mb-1">Invoice No</label>
            <input
              type="text"
              id="invoiceNo"
              name="invoiceNo"
              value={formData.invoiceNo}
              onChange={handleInputChange}
              placeholder="INV-001"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-700"
            />
          </div>

          {/* Company Details */}
          <fieldset className="border border-gray-200 p-4 rounded-md">
            <legend className="text-base font-medium text-gray-700 px-2">Company Details</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="">
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input type="text" id="companyName" name="companyName" value={formData.companyName} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-700" />
              </div>
              <div className="">
                <label htmlFor="companyMobile" className="block text-sm font-medium text-gray-700 mb-1">Company Mobile No</label>
                <input type="tel" id="companyMobile" name="companyMobile" value={formData.companyMobile} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-700" />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700 mb-1">Company Address</label>
              <textarea id="companyAddress" name="companyAddress" value={formData.companyAddress} onChange={handleInputChange} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-700"></textarea>
            </div>
          </fieldset>


          {/* Customer Details */}
           <fieldset className="border border-gray-200 p-4 rounded-md">
             <legend className="text-base font-medium text-gray-700 px-2">Customer Details</legend>

             {/* Client Selection Dropdown */}
             <div className="mb-4">
                <label htmlFor="clientSelect" className="block text-sm font-medium text-gray-700 mb-1">Select Client</label>
                <select
                    id="clientSelect"
                    value={selectedClientId}
                    onChange={handleClientSelect}
                    disabled={isLoadingClients || clientFetchError}
                    className={`w-full px-3 py-2 border ${clientFetchError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-700 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed`}
                >
                    <option value="">-- Select Client --</option>
                    {isLoadingClients ? (
                        <option disabled>Loading clients...</option>
                    ) : clientFetchError ? (
                        <option disabled>{clientFetchError}</option>
                    ) : (
                        userClients.map((client) => (
                        <option key={client.id} value={client.id}>
                            {client.name} (ID: {client.client_id})
                        </option>
                        ))
                    )}
                </select>
                {clientFetchError && <p className="mt-1 text-xs text-red-600">{clientFetchError}</p>}
                {/* TODO: Maybe add a button here to "Add New Client" */}
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="">
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                  <input type="text" id="customerName" name="customerName" value={formData.customerName} onChange={handleInputChange} readOnly disabled={isLoadingClients} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-700 bg-gray-100 cursor-not-allowed" />
              </div>
              <div className="">
                  <label htmlFor="customerMobile" className="block text-sm font-medium text-gray-700 mb-1">Customer Mobile No</label>
                  <input type="tel" id="customerMobile" name="customerMobile" value={formData.customerMobile} onChange={handleInputChange} readOnly disabled={isLoadingClients} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-700 bg-gray-100 cursor-not-allowed" />
              </div>
             </div>
             <div className="mt-4">
               <label htmlFor="customerAddress" className="block text-sm font-medium text-gray-700 mb-1">Customer Address</label>
               <textarea id="customerAddress" name="customerAddress" value={formData.customerAddress} onChange={handleInputChange} rows="3" readOnly disabled={isLoadingClients} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-700 bg-gray-100 cursor-not-allowed"></textarea>
             </div>
           </fieldset>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="">
                 <label htmlFor="issuedDate" className="block text-sm font-medium text-gray-700 mb-1">Issued Date</label>
                 <input type="date" id="issuedDate" name="issuedDate" value={formData.issuedDate} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-700" />
             </div>
             <div className="">
                 <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                 <input type="date" id="dueDate" name="dueDate" value={formData.dueDate} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-700" />
             </div>
          </div>


          {/* Items */}
          <fieldset className="border border-gray-200 p-4 rounded-md">
            <legend className="text-base font-medium text-gray-700 px-2">Items</legend>
            <div className="space-y-4 mt-2">
              {formData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-10 gap-x-4 gap-y-2 items-end border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                  {/* Description (wider) */}
                  <div className="md:col-span-4">
                    {index === 0 && <label htmlFor={`itemDescription-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Description</label>}
                    <input
                      type="text"
                      id={`itemDescription-${index}`}
                      name="description"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, e)}
                      placeholder="Item name or description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-700"
                    />
                  </div>
                  {/* Quantity */}
                  <div className="md:col-span-1">
                    {index === 0 && <label htmlFor={`itemQuantity-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Qty</label>}
                    <input
                      type="number"
                      id={`itemQuantity-${index}`}
                      name="quantity"
                      value={item.quantity}
                      min="0"
                      onChange={(e) => handleItemChange(index, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-700 text-right"
                    />
                  </div>
                  {/* Unit Price */}
                  <div className="md:col-span-2">
                     {index === 0 && <label htmlFor={`itemUnitPrice-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>}
                    <input
                      type="number"
                      id={`itemUnitPrice-${index}`}
                      name="unitPrice"
                      value={item.unitPrice}
                      min="0"
                      step="0.01"
                      onChange={(e) => handleItemChange(index, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-700 text-right"
                    />
                  </div>
                  {/* Amount (Calculated) */}
                  <div className="md:col-span-2">
                    {index === 0 && <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>}
                    <span className="block w-full px-3 py-2 bg-gray-100 rounded-md sm:text-sm text-gray-800 text-right">
                      {item.amount.toFixed(2)}
                    </span>
                  </div>
                  {/* Remove Button */}
                  <div className="md:col-span-1 flex items-end justify-end">
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className={`${index === 0 ? 'mt-7' : ''} text-red-600 hover:text-red-800 focus:outline-none p-1 rounded-full hover:bg-red-100 transition duration-150 ease-in-out`}
                        aria-label="Remove item"
                      >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                           <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                         </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddItem}
              className="mt-4 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out"
            >
              Add Item
            </button>
          </fieldset>

           {/* Totals Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end pt-4 border-t border-gray-200">
              <div className="md:col-start-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sub Total</label>
                  <span className="block w-full px-3 py-2 bg-gray-100 rounded-md sm:text-sm text-gray-800 text-right">{subtotal.toFixed(2)}</span>
              </div>
              <div>
                  <label htmlFor="tax" className="block text-sm font-medium text-gray-700 mb-1">Tax (%)</label>
                  <input type="number" id="tax" name="tax" min="0" step="0.1" value={formData.tax} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-700 text-right" />
              </div>
               <div>
                   <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                   <input type="number" id="discount" name="discount" min="0" step="0.1" value={formData.discount} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-700 text-right" />
               </div>
          </div>
           <div className="flex justify-end pt-4">
             <div className="w-full md:w-1/4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                <span className="block w-full px-3 py-2 bg-gray-100 rounded-md text-lg font-semibold text-gray-900 text-right">{total.toFixed(2)}</span>
             </div>
           </div>

          {/* Status Selection */}
          <div className="">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-700 bg-white`}
              >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
              </select>
          </div>

          {/* Payment Method */}
          <div className="">
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-700 bg-white`}
            >
              <option value="cash">Cash</option>
              <option value="card">Credit/Debit Card</option>
              <option value="bank">Bank Transfer</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>

          {/* Terms & Conditions */}
          <div className="">
            <label htmlFor="terms" className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions</label>
            <textarea
              id="terms"
              name="terms"
              rows="4"
              value={formData.terms}
              onChange={handleInputChange}
              placeholder="e.g. Payment is due within 30 days."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-700"
            ></textarea>
          </div>

          {/* Greeting Message */}
          <div className="">
            <label htmlFor="greeting" className="block text-sm font-medium text-gray-700 mb-1">Greeting Message</label>
            <textarea
              id="greeting"
              name="greeting"
              rows="3"
              value={formData.greeting}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-gray-700"
            ></textarea>
          </div>

          {/* Submit Button */}
           <div className="pt-6 border-t border-gray-200">
               <button
                 type="submit"
                 className={`w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${isSaving || loadingInvoice ? 'bg-neutral-500' : 'bg-neutral-800 hover:bg-neutral-900'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 transition duration-150 ease-in-out ${isSaving || loadingInvoice ? 'cursor-not-allowed' : ''}`}
                 onClick={handleGenerateInvoice}
                 disabled={isSaving || loadingInvoice}
               >
                 {isSaving ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                    </>
                 ) : loadingInvoice ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading...
                    </>
                 ) : (
                    `${isEditMode ? 'Update' : 'Generate'} Invoice`
                 )}
               </button>

            {/* Save Status Message */}
            {saveStatus.message && (
               <p className={`mt-2 text-sm ${saveStatus.success === true ? 'text-green-600' : saveStatus.success === false ? 'text-red-600' : 'text-gray-600'}`}>
                   {saveStatus.message}
               </p>
            )}
            
            {/* Invoice Load Error Message */}
            {invoiceError && (
               <p className="mt-2 text-sm text-red-600">
                   {invoiceError}
               </p>
            )}
        </div>
        </form>
      </div>
    </div>
  );
}

export default Form;
