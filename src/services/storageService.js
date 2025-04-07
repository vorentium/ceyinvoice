// Storage Service
// This service handles saving and retrieving invoices from localStorage

/**
 * Get all saved invoices from localStorage
 * @returns {Array} Array of saved invoices
 */
export const getSavedInvoices = () => {
  try {
    const invoices = localStorage.getItem('savedInvoices');
    return invoices ? JSON.parse(invoices) : [];
  } catch (error) {
    console.error('Error getting saved invoices:', error);
    return [];
  }
};

/**
 * Save a new invoice to localStorage
 * @param {Object} invoiceData - The invoice data to save
 * @returns {Object} Result object with success status and ID of saved invoice
 */
export const saveInvoice = (invoiceData) => {
  try {
    // Get existing invoices
    const invoices = getSavedInvoices();
    
    // Generate a unique ID using timestamp and random number
    const invoiceId = `inv_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    // Create new invoice object with ID and timestamp
    const newInvoice = {
      id: invoiceId,
      savedAt: new Date().toISOString(),
      data: invoiceData
    };
    
    // Add to invoices array
    invoices.push(newInvoice);
    
    // Save back to localStorage
    localStorage.setItem('savedInvoices', JSON.stringify(invoices));
    
    return {
      success: true,
      invoiceId,
      message: 'Invoice saved successfully'
    };
  } catch (error) {
    console.error('Error saving invoice:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Delete a saved invoice by ID
 * @param {string} invoiceId - ID of the invoice to delete
 * @returns {Object} Result object with success status
 */
export const deleteInvoice = (invoiceId) => {
  try {
    // Get existing invoices
    const invoices = getSavedInvoices();
    
    // Filter out the invoice with the given ID
    const updatedInvoices = invoices.filter(invoice => invoice.id !== invoiceId);
    
    // Save back to localStorage
    localStorage.setItem('savedInvoices', JSON.stringify(updatedInvoices));
    
    return {
      success: true,
      message: 'Invoice deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get a specific invoice by ID
 * @param {string} invoiceId - ID of the invoice to retrieve
 * @returns {Object|null} The invoice object or null if not found
 */
export const getInvoiceById = (invoiceId) => {
  try {
    const invoices = getSavedInvoices();
    return invoices.find(invoice => invoice.id === invoiceId) || null;
  } catch (error) {
    console.error('Error getting invoice by ID:', error);
    return null;
  }
};

/**
 * Update an existing invoice
 * @param {string} invoiceId - ID of the invoice to update
 * @param {Object} invoiceData - New invoice data
 * @returns {Object} Result object with success status
 */
export const updateInvoice = (invoiceId, invoiceData) => {
  try {
    // Get existing invoices
    const invoices = getSavedInvoices();
    
    // Find the index of the invoice to update
    const invoiceIndex = invoices.findIndex(invoice => invoice.id === invoiceId);
    
    if (invoiceIndex === -1) {
      return {
        success: false,
        error: 'Invoice not found'
      };
    }
    
    // Update the invoice data while preserving the ID and updating the timestamp
    invoices[invoiceIndex] = {
      ...invoices[invoiceIndex],
      data: invoiceData,
      lastUpdated: new Date().toISOString()
    };
    
    // Save back to localStorage
    localStorage.setItem('savedInvoices', JSON.stringify(invoices));
    
    return {
      success: true,
      message: 'Invoice updated successfully'
    };
  } catch (error) {
    console.error('Error updating invoice:', error);
    return {
      success: false,
      error: error.message
    };
  }
}; 