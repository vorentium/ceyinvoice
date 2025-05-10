import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Track UTM parameters and user journey for analytics
 * @param {Object} params - Object containing tracking parameters
 * @param {string} params.source - UTM source parameter
 * @param {string} params.medium - UTM medium parameter
 * @param {string} params.campaign - UTM campaign parameter
 * @param {string} params.content - UTM content parameter
 * @param {string} params.term - UTM term parameter
 * @param {string} params.page - Current page being viewed
 * @param {string} params.action - Action being performed
 * @param {Object} params.additionalData - Any additional data to track
 * @returns {Promise<Object>} - Tracking result
 */
export const trackUserJourney = async (params) => {
  try {
    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData?.user) {
      console.warn('User not authenticated, tracking anonymously');
      // For anonymous users, you might still want to track with a session ID
      // but we'll just return for now
      return { success: false, message: 'User not authenticated' };
    }
    
    const userId = userData.user.id;
    
    // Prepare tracking data
    const trackingData = {
      user_id: userId,
      utm_source: params.source || null,
      utm_medium: params.medium || null,
      utm_campaign: params.campaign || null,
      utm_content: params.content || null,
      utm_term: params.term || null,
      page: params.page || null,
      action: params.action || null,
      additional_data: params.additionalData || null,
      timestamp: new Date().toISOString()
    };
    
    // Insert tracking data
    const { data, error } = await supabase
      .from('user_analytics')
      .insert([trackingData]);
    
    if (error) {
      console.error('Error tracking user journey:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error in trackUserJourney:', error);
    return { success: false, error };
  }
};

/**
 * Get all templates for the current user
 * @returns {Promise<Array>} - Array of templates
 */
export const getUserTemplates = async () => {
  try {
    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData?.user) {
      throw new Error('Authentication required');
    }
    
    const userId = userData.user.id;
    
    // Fetch templates for this user
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getUserTemplates:', error);
    throw error;
  }
};

/**
 * Get all clients for the current user
 * @returns {Promise<Array>} - Array of clients
 */
export const getUserClients = async () => {
  try {
    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData?.user) {
      throw new Error('Authentication required');
    }
    
    const userId = userData.user.id;
    
    // Fetch clients for this user
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
    
    // Map response to use consistent naming in frontend
    const mappedData = data?.map(client => ({
      id: client.id,
      client_id: client.client_id,
      name: client.client_name,  
      email: client.email,
      phone: client.phone,
      address: client.address,
      user_id: client.user_id,
      created_at: client.created_at
    })) || [];
    
    return mappedData;
  } catch (error) {
    console.error('Error in getUserClients:', error);
    throw error;
  }
};

/**
 * Add a new client
 * @param {Object} clientData - Client data to add
 * @returns {Promise<Object>} - Added client data
 */
export const addClient = async (clientData) => {
  try {
    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData?.user) {
      throw new Error('Authentication required');
    }
    
    const userId = userData.user.id;
    
    // Add client with user ID
    const { data, error } = await supabase
      .from('clients')
      .insert([
        {
          user_id: userId,
          client_id: clientData.clientId,
          client_name: clientData.clientName,  // Use client_name column
          email: clientData.clientEmail,
          phone: clientData.clientMobile,
          address: clientData.clientAddress,
        }
      ])
      .select();
    
    if (error) {
      console.error('Error adding client:', error);
      throw error;
    }
    
    return data?.[0] || null;
  } catch (error) {
    console.error('Error in addClient:', error);
    throw error;
  }
};

/**
 * Delete a client
 * @param {number} id - Primary key ID of the client to delete
 * @returns {Promise<void>}
 */
export const deleteClient = async (id) => {
  try {
    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData?.user) {
      throw new Error('Authentication required');
    }
    
    const userId = userData.user.id;
    
    // Delete client with matching ID and user ID (for security)
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteClient:', error);
    throw error;
  }
};

/**
 * Update an existing client
 * @param {number} id - Primary key ID of the client to update
 * @param {Object} clientData - Updated client data
 * @returns {Promise<Object>} - Updated client data
 */
export const updateClient = async (id, clientData) => {
  try {
    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData?.user) {
      throw new Error('Authentication required');
    }
    
    const userId = userData.user.id;
    
    // Update client with matching ID and user ID (for security)
    const { data, error } = await supabase
      .from('clients')
      .update({
        client_name: clientData.clientName,
        email: clientData.clientEmail,
        phone: clientData.clientMobile,
        address: clientData.clientAddress,
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select();
    
    if (error) {
      console.error('Error updating client:', error);
      throw error;
    }
    
    return data?.[0] || null;
  } catch (error) {
    console.error('Error in updateClient:', error);
    throw error;
  }
};

/**
 * Get all invoices for the current user
 * @returns {Promise<Array>} - Array of invoices
 */
export const getUserInvoices = async () => {
  try {
    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData?.user) {
      throw new Error('Authentication required');
    }
    
    const userId = userData.user.id;
    
    // Fetch invoices for this user
    // Join with clients table to get client details
    const { data, error } = await supabase
      .from('invoice_details')
      .select(`
        *,
        clients:client_id (
          client_name
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
    
    // Format the data for the frontend
    const formattedInvoices = data.map(invoice => ({
      id: invoice.id,
      invoiceNo: invoice.invoice_number,
      client: invoice.clients?.client_name || 'Unknown Client',
      date: invoice.issued_date,
      dueDate: invoice.due_date,
      amount: invoice.total_amount,
      status: invoice.status || 'Pending',
      paymentMethod: invoice.payment_method,
      clientId: invoice.client_id
    }));
    
    return formattedInvoices;
  } catch (error) {
    console.error('Error in getUserInvoices:', error);
    throw error;
  }
};

/**
 * Get dashboard statistics for the current user
 * @returns {Promise<Object>} - Dashboard statistics
 */
export const getDashboardStats = async () => {
  try {
    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData?.user) {
      throw new Error('Authentication required');
    }
    
    const userId = userData.user.id;
    
    // Fetch the latest dashboard stats for this user
    const { data, error } = await supabase
      .from('dashboard_stats')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
    
    // If no stats were found, calculate some basic stats from other tables
    if (!data) {
      return await calculateDashboardStats(userId);
    }
    
    return {
      totalInvoices: data.total_invoices || 0,
      paidInvoices: data.paid_invoices || 0,
      pendingInvoices: data.pending_invoices || 0,
      overdueInvoices: data.overdue_invoices || 0,
      totalRevenue: data.total_revenue || 0,
      pendingRevenue: data.pending_revenue || 0,
      totalClients: data.total_clients || 0,
      recentActivity: data.recent_activity || [],
      lastUpdated: data.created_at || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    
    // If there's an error fetching from dashboard_stats, calculate stats from scratch
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        return await calculateDashboardStats(userData.user.id);
      }
    } catch (fallbackError) {
      console.error('Error in fallback stats calculation:', fallbackError);
    }
    
    // Return empty stats as a last resort
    return {
      totalInvoices: 0,
      paidInvoices: 0,
      pendingInvoices: 0,
      overdueInvoices: 0,
      totalRevenue: 0,
      pendingRevenue: 0,
      totalClients: 0,
      recentActivity: [],
      lastUpdated: new Date().toISOString()
    };
  }
};

/**
 * Calculate dashboard statistics from invoices and clients tables
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Calculated dashboard statistics
 * @private
 */
const calculateDashboardStats = async (userId) => {
  try {
    // Get total invoices count and financial stats
    const { data: invoices, error: invoicesError } = await supabase
      .from('invoice_details')
      .select('id, status, total_amount, issued_date, due_date')
      .eq('user_id', userId);
    
    if (invoicesError) throw invoicesError;
    
    // Get total clients count
    const { count: totalClients, error: clientsError } = await supabase
      .from('clients')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    if (clientsError) throw clientsError;
    
    // Get recent activity (recent invoices)
    const { data: recentInvoices, error: recentError } = await supabase
      .from('invoice_details')
      .select(`
        id,
        invoice_number,
        status,
        total_amount,
        created_at,
        clients:client_id (client_name)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (recentError) {
      console.warn('Could not fetch recent activity:', recentError);
      // Don't throw, proceed without recent activity if needed
    }
    
    // Process invoices to check for overdue status and ensure status consistency
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Compare dates only
    
    const processedInvoices = invoices?.map(inv => {
      let currentStatus = inv.status || 'Pending'; // Default to Pending if status is null/undefined
      
      // If already Paid, keep it Paid
      if (currentStatus === 'Paid') {
        return { ...inv, status: 'Paid' };
      }
      
      // Check if it should be marked Overdue
      if (inv.due_date) {
        try {
            const dueDate = new Date(inv.due_date);
            dueDate.setHours(0, 0, 0, 0); // Compare dates only
            if (dueDate < today) {
                 currentStatus = 'Overdue'; // Mark as Overdue if due date passed and not Paid
            }
        } catch (e) {
            console.error("Error parsing due date during stats calculation:", inv.due_date, e);
            // Keep original/default status if date parsing fails
        }
      }
      
      // If not Paid and not determined to be Overdue, it must be Pending
      if (currentStatus !== 'Overdue') {
          currentStatus = 'Pending';
      }
      
      return { ...inv, status: currentStatus };
    }) || [];
    
    // Calculate stats from processed invoices
    const totalInvoices = processedInvoices.length || 0;
    const paidInvoices = processedInvoices.filter(inv => inv.status === 'Paid').length || 0;
    const pendingInvoices = processedInvoices.filter(inv => inv.status === 'Pending').length || 0;
    const overdueInvoices = processedInvoices.filter(inv => inv.status === 'Overdue').length || 0;
    
    console.log(`Calculated Stats: Total=${totalInvoices}, Paid=${paidInvoices}, Pending=${pendingInvoices}, Overdue=${overdueInvoices}`);
    
    const totalRevenue = processedInvoices.reduce((sum, inv) => sum + (parseFloat(inv.total_amount) || 0), 0) || 0;
    const pendingRevenue = processedInvoices
      .filter(inv => inv.status === 'Pending' || inv.status === 'Overdue')
      .reduce((sum, inv) => sum + (parseFloat(inv.total_amount) || 0), 0) || 0;
    
    // Format recent activity
    const recentActivity = recentInvoices?.map(inv => ({
      id: inv.id,
      type: 'invoice_created',
      invoiceNumber: inv.invoice_number,
      clientName: inv.clients?.client_name || 'Unknown Client',
      amount: inv.total_amount,
      status: inv.status || 'Pending', // Ensure recent activity also defaults status
      date: inv.created_at
    })) || [];
    
    return {
      totalInvoices,
      paidInvoices,
      pendingInvoices,
      overdueInvoices,
      totalRevenue,
      pendingRevenue,
      totalClients: totalClients || 0,
      recentActivity,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error calculating dashboard stats:', error);
    throw error;
  }
};

/**
 * Recalculates dashboard stats and saves them to the dashboard_stats table.
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export const recalculateAndSaveDashboardStats = async (userId) => {
  if (!userId) return;

  console.log(`Recalculating and saving dashboard stats for user: ${userId}`);
  try {
    // 1. Calculate the latest stats
    const calculatedStats = await calculateDashboardStats(userId);

    // 2. Prepare data for DB update/insert (map frontend names to DB column names if different)
    const statsPayload = {
      user_id: userId,
      total_revenue: calculatedStats.totalRevenue,
      pending_revenue: calculatedStats.pendingRevenue,
      total_invoices: calculatedStats.totalInvoices,
      paid_invoices: calculatedStats.paidInvoices,
      pending_invoices: calculatedStats.pendingInvoices,
      overdue_invoices: calculatedStats.overdueInvoices,
      total_clients: calculatedStats.totalClients,
      // recent_activity might be handled differently or omitted from direct update here
      last_updated: new Date().toISOString(), // Always update the timestamp
    };

    // 3. Attempt to update existing record first
    const { error: updateError, count: updateCount } = await supabase
      .from('dashboard_stats')
      .update(statsPayload)
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating dashboard_stats:', updateError);
      // Don't necessarily throw, maybe try insert next
    }

    console.log(`Update affected ${updateCount} rows.`);

    // 4. If no record was updated (count is 0 or null), insert a new one
    if (updateCount === 0 || updateCount === null) {
      console.log('No existing stats found, inserting new record...');
      // Add created_at for insert
      statsPayload.created_at = new Date().toISOString(); 
      
      const { error: insertError } = await supabase
        .from('dashboard_stats')
        .insert(statsPayload);

      if (insertError) {
        console.error('Error inserting dashboard_stats:', insertError);
        throw insertError; // Throw if insert fails
      }
      console.log('New dashboard stats inserted successfully.');
    } else {
      console.log('Dashboard stats updated successfully.');
    }

  } catch (error) {
    console.error('Error in recalculateAndSaveDashboardStats:', error);
    // Decide if the error should propagate or be handled silently
    // throw error; 
  }
};

/**
 * Get recent invoices for the current user
 * @param {number} limit - Number of invoices to return (default 5)
 * @returns {Promise<Array>} - Array of recent invoices
 */
export const getRecentInvoices = async (limit = 5) => {
  try {
    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData?.user) {
      throw new Error('Authentication required');
    }
    
    const userId = userData.user.id;
    
    // Fetch recent invoices for this user
    const { data, error } = await supabase
      .from('invoice_details')
      .select(`
        id,
        invoice_number,
        issued_date,
        due_date,
        total_amount,
        status,
        payment_method,
        created_at,
        clients:client_id (
          client_name,
          client_id,
          email,
          phone
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching recent invoices:', error);
      throw error;
    }
    
    // Format the data for the frontend
    const formattedInvoices = data.map(invoice => ({
      id: invoice.id,
      invoiceNumber: invoice.invoice_number,
      date: invoice.issued_date,
      dueDate: invoice.due_date,
      amount: invoice.total_amount,
      status: invoice.status || 'Pending',
      paymentMethod: invoice.payment_method,
      client: invoice.clients?.client_name || 'Unknown Client',
      clientId: invoice.clients?.client_id,
      clientEmail: invoice.clients?.email,
      clientPhone: invoice.clients?.phone,
      createdAt: invoice.created_at
    }));
    
    return formattedInvoices;
  } catch (error) {
    console.error('Error in getRecentInvoices:', error);
    throw error;
  }
};

/**
 * Save invoice details to Supabase
 * @param {Object} invoiceData - Invoice data to save
 * @returns {Promise<Object>} - Saved invoice data
 */
export const saveInvoiceDetails = async (invoiceData) => {
  try {
    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData?.user) {
      throw new Error('Authentication required');
    }
    
    const userId = userData.user.id;
    
    // Format items to store as JSON
    const itemsJson = invoiceData.items.map(item => ({
      name: item.name,
      quantity: parseFloat(item.quantity),
      price: parseFloat(item.price),
      amount: parseFloat(item.amount)
    }));
    
    // Get the client's database ID using the client_id
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('id')
      .eq('client_id', invoiceData.clientId)
      .eq('user_id', userId)
      .single();
      
    if (clientError || !clientData) {
      console.error('Error fetching client:', clientError);
      throw new Error('Client not found or inaccessible');
    }
    
    // Check if the invoice is overdue based on due date
    let invoiceStatus = invoiceData.status || 'Pending';
    if (invoiceData.dueDate) {
      const dueDate = new Date(invoiceData.dueDate);
      const today = new Date();
      
      if (dueDate < today && invoiceStatus !== 'Paid') {
        invoiceStatus = 'Overdue';
      }
    }
    
    // Prepare data for insertion
    const invoiceRecord = {
      user_id: userId,
      invoice_number: invoiceData.invoiceNumber,
      issued_date: invoiceData.date,
      due_date: invoiceData.dueDate,
      client_id: clientData.id, // Use the database ID, not the client_id
      company_name: invoiceData.companyName,
      company_address: invoiceData.companyAddress,
      company_mobile: invoiceData.companyMobile,
      payment_method: invoiceData.paymentMethod,
      items: itemsJson,
      subtotal: parseFloat(invoiceData.subtotal),
      tax: parseFloat(invoiceData.tax),
      discount: parseFloat(invoiceData.discount),
      total_amount: parseFloat(invoiceData.total),
      terms: invoiceData.terms,
      // template_id is not saved
      currency: invoiceData.currency,
      status: invoiceStatus // Use calculated status
    };
    
    // Insert the invoice record
    const { data, error } = await supabase
      .from('invoice_details')
      .insert([invoiceRecord])
      .select();
    
    if (error) {
      console.error('Error saving invoice:', error);
      throw error;
    }
    
    // Trigger dashboard stats update after successful save
    await recalculateAndSaveDashboardStats(userId);
    
    return data?.[0] || null;
  } catch (error) {
    console.error('Error in saveInvoiceDetails:', error);
    throw error;
  }
};

// Helper function to format date to YYYY-MM-DD
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    // Adjust for potential timezone offset by getting components in UTC
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (e) {
    console.error("Error formatting date for input:", e);
    return ''; // Return empty string on error
  }
};

/**
 * Get a specific invoice by ID
 * @param {string} invoiceId - The invoice ID to retrieve
 * @returns {Promise<Object>} - The invoice details
 */
export const getInvoiceById = async (invoiceId) => {
  try {
    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData?.user) {
      throw new Error('Authentication required');
    }
    
    const userId = userData.user.id;
    
    // Fetch the specific invoice for this user
    const { data, error } = await supabase
      .from('invoice_details')
      .select(`
        *,
        clients(*)
      `)
      .eq('id', invoiceId)
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching invoice:', error);
      throw error;
    }
    
    if (!data) {
      throw new Error('Invoice not found');
    }
    
    // Get client information using the clients relation
    const clientData = data.clients || {};
    
    // Format the data for the frontend
    return {
      id: data.id,
      invoiceNumber: data.invoice_number,
      date: formatDateForInput(data.issued_date), // Format for date input
      dueDate: formatDateForInput(data.due_date), // Format for date input
      clientId: clientData.client_id, 
      clientName: clientData.client_name,
      clientPhone: clientData.phone,
      clientAddress: clientData.address,
      companyName: data.company_name,
      companyAddress: data.company_address,
      companyMobile: data.company_mobile,
      paymentMethod: data.payment_method,
      items: data.items || [],
      subtotal: data.subtotal,
      tax: data.tax,
      discount: data.discount,
      total: data.total_amount,
      terms: data.terms,
      currency: data.currency,
      templateId: data.template_id, 
      status: data.status || 'Pending'
    };
  } catch (error) {
    console.error('Error in getInvoiceById:', error);
    throw error;
  }
};

/**
 * Update an existing invoice
 * @param {string} invoiceId - ID of the invoice to update
 * @param {Object} invoiceData - Updated invoice data
 * @returns {Promise<Object>} - Updated invoice data
 */
export const updateInvoice = async (invoiceId, invoiceData) => {
  try {
    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData?.user) {
      throw new Error('Authentication required');
    }
    
    const userId = userData.user.id;
    
    // Format items to store as JSON
    const itemsJson = invoiceData.items.map(item => ({
      name: item.name,
      quantity: parseFloat(item.quantity),
      price: parseFloat(item.price),
      amount: parseFloat(item.amount)
    }));
    
    // Get the client's database ID using the client_id
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('id')
      .eq('client_id', invoiceData.clientId)
      .eq('user_id', userId)
      .single();
      
    if (clientError || !clientData) {
      console.error('Error fetching client:', clientError);
      throw new Error('Client not found or inaccessible');
    }
    
    // Check if the invoice status should be updated
    let invoiceStatus = invoiceData.status || 'Pending';
    
    // If the status is not explicitly set to Paid, check if it's overdue
    if (invoiceStatus !== 'Paid' && invoiceData.dueDate) {
      const dueDate = new Date(invoiceData.dueDate);
      const today = new Date();
      
      if (dueDate < today) {
        invoiceStatus = 'Overdue';
      }
    }
    
    // Prepare data for update
    const invoiceRecord = {
      invoice_number: invoiceData.invoiceNumber,
      issued_date: invoiceData.date,
      due_date: invoiceData.dueDate,
      client_id: clientData.id,
      company_name: invoiceData.companyName,
      company_address: invoiceData.companyAddress,
      company_mobile: invoiceData.companyMobile,
      payment_method: invoiceData.paymentMethod,
      items: itemsJson,
      subtotal: parseFloat(invoiceData.subtotal),
      tax: parseFloat(invoiceData.tax),
      discount: parseFloat(invoiceData.discount),
      total_amount: parseFloat(invoiceData.total),
      terms: invoiceData.terms,
      currency: invoiceData.currency,
      status: invoiceStatus
    };
    
    // Update the invoice record
    const { data, error } = await supabase
      .from('invoice_details')
      .update(invoiceRecord)
      .eq('id', invoiceId)
      .eq('user_id', userId)
      .select();
    
    if (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
    
    // Trigger dashboard stats update after successful update
    await recalculateAndSaveDashboardStats(userId);
    
    return data?.[0] || null;
  } catch (error) {
    console.error('Error in updateInvoice:', error);
    throw error;
  }
};

/**
 * Delete an invoice and all related data
 * @param {string} invoiceId - ID of the invoice to delete
 * @returns {Promise<void>}
 */
export const deleteInvoice = async (invoiceId) => {
  try {
    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData?.user) {
      throw new Error('Authentication required');
    }
    
    const userId = userData.user.id;
    
    // First check if invoice exists and belongs to user
    const { data: invoice, error: checkError } = await supabase
      .from('invoice_details')
      .select('id')
      .eq('id', invoiceId)
      .eq('user_id', userId)
      .single();
      
    if (checkError || !invoice) {
      throw new Error('Invoice not found or unauthorized');
    }
    
    // Delete the invoice from invoice_details table
    const { error: detailsError } = await supabase
      .from('invoice_details')
      .delete()
      .eq('id', invoiceId)
      .eq('user_id', userId);
    
    if (detailsError) {
      throw detailsError;
    }
    
    // Also delete from invoices table if it exists there
    const { error: invoicesError } = await supabase
      .from('invoices')
      .delete()
      .eq('invoice_id', invoiceId)
      .eq('user_id', userId);
    
    if (invoicesError) {
      // Continue even if this fails - it might not exist in this table
    }
    
    // Trigger dashboard stats update after successful deletion
    await recalculateAndSaveDashboardStats(userId);
    
  } catch (error) {
    throw error;
  }
};

/**
 * Get a template by ID
 * @param {string} templateId - ID of the template to retrieve
 * @returns {Promise<Object|null>} - Template data or null if not found
 */
export const getTemplateById = async (templateId) => {
  try {
    // Check if it's a default template ID
    if (templateId.startsWith('default-')) {
      // Return a predefined default template
      return getDefaultTemplate(templateId);
    }

    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData?.user) {
      throw new Error('Authentication required');
    }
    
    const userId = userData.user.id;
    
    // Fetch the template with the specified ID and user ID
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', templateId)
      .eq('user_id', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // Template not found
        return null;
      }
      console.error('Error fetching template:', error);
      throw error;
    }
    
    // Parse the elements JSON if it's stored as a string
    if (data && data.elements && typeof data.elements === 'string') {
      data.elements = JSON.parse(data.elements);
    }
    
    return data;
  } catch (error) {
    console.error('Error in getTemplateById:', error);
    throw error;
  }
};

/**
 * Get a default template by ID
 * @param {string} templateId - ID of the default template (e.g., 'default-1')
 * @returns {Object} - Default template data
 */
const getDefaultTemplate = (templateId) => {
  const defaultTemplates = {
    'default-1': {
      id: 'default-1',
      name: 'Basic Template (Default)',
      elements: [
        {
          id: 'header-1',
          type: 'text',
          content: '{company_name}',
          position: { x: '50px', y: '50px' },
          color: '#333333',
          fontSize: '32px',
          fontWeight: 'bold',
          fontFamily: 'Arial',
          width: '300px',
          textAlign: 'left'
        },
        {
          id: 'invoice-title',
          type: 'text',
          content: 'INVOICE',
          position: { x: '50px', y: '100px' },
          color: '#333333',
          fontSize: '24px',
          fontWeight: 'bold',
          fontFamily: 'Arial',
          width: '300px',
          textAlign: 'left'
        },
        {
          id: 'company-address',
          type: 'text',
          content: '{company_address}\nPhone: {company_phone}\nEmail: {company_email}',
          position: { x: '50px', y: '150px' },
          color: '#666666',
          fontSize: '12px',
          fontWeight: 'normal',
          fontFamily: 'Arial',
          width: '300px',
          textAlign: 'left'
        },
        {
          id: 'invoice-info',
          type: 'text',
          content: 'Invoice #: {invoice_number}\nDate: {issued_date}\nDue Date: {due_date}',
          position: { x: '450px', y: '50px' },
          color: '#666666',
          fontSize: '12px',
          fontWeight: 'normal',
          fontFamily: 'Arial',
          width: '200px',
          textAlign: 'right'
        },
        {
          id: 'bill-to',
          type: 'text',
          content: 'BILL TO:',
          position: { x: '50px', y: '250px' },
          color: '#333333',
          fontSize: '14px',
          fontWeight: 'bold',
          fontFamily: 'Arial',
          width: '300px',
          textAlign: 'left'
        },
        {
          id: 'client-info',
          type: 'text',
          content: '{client_name}\n{client_address}\nPhone: {client_phone}\nEmail: {client_email}',
          position: { x: '50px', y: '280px' },
          color: '#666666',
          fontSize: '12px',
          fontWeight: 'normal',
          fontFamily: 'Arial',
          width: '300px',
          textAlign: 'left'
        },
        {
          id: 'items-table',
          type: 'items-table',
          position: { x: '50px', y: '350px' },
          width: '600px'
        },
        {
          id: 'greeting',
          type: 'text',
          content: '{greeting}',
          position: { x: '50px', y: '650px' },
          color: '#666666',
          fontSize: '12px',
          fontWeight: 'normal',
          fontFamily: 'Arial',
          width: '600px',
          textAlign: 'left'
        },
        {
          id: 'terms',
          type: 'text',
          content: 'Terms and Conditions:\n{terms_and_conditions}',
          position: { x: '50px', y: '700px' },
          color: '#666666',
          fontSize: '12px',
          fontWeight: 'normal',
          fontFamily: 'Arial',
          width: '600px',
          textAlign: 'left'
        }
      ],
      width: '800px',
      height: '1100px',
      backgroundColor: '#ffffff'
    },
    'default-2': {
      id: 'default-2',
      name: 'Professional Template (Default)',
      elements: [
        {
          id: 'header-2',
          type: 'text',
          content: 'INVOICE',
          position: { x: '350px', y: '50px' },
          color: '#2c3e50',
          fontSize: '36px',
          fontWeight: 'bold',
          fontFamily: 'Arial',
          width: '400px',
          textAlign: 'center'
        },
        {
          id: 'company-name-2',
          type: 'text',
          content: '{company_name}',
          position: { x: '50px', y: '120px' },
          color: '#2c3e50',
          fontSize: '20px',
          fontWeight: 'bold',
          fontFamily: 'Arial',
          width: '300px',
          textAlign: 'left'
        },
        {
          id: 'company-details-2',
          type: 'text',
          content: '{company_address}\nPhone: {company_phone}\nEmail: {company_email}',
          position: { x: '50px', y: '160px' },
          color: '#7f8c8d',
          fontSize: '12px',
          fontWeight: 'normal',
          fontFamily: 'Arial',
          width: '300px',
          textAlign: 'left'
        },
        {
          id: 'invoice-info-2',
          type: 'text',
          content: 'Invoice #: {invoice_number}\nDate: {issued_date}\nDue Date: {due_date}',
          position: { x: '500px', y: '120px' },
          color: '#7f8c8d',
          fontSize: '12px',
          fontWeight: 'normal',
          fontFamily: 'Arial',
          width: '250px',
          textAlign: 'right'
        },
        {
          id: 'client-section-2',
          type: 'text',
          content: 'BILLED TO:',
          position: { x: '50px', y: '250px' },
          color: '#2c3e50',
          fontSize: '16px',
          fontWeight: 'bold',
          fontFamily: 'Arial',
          width: '300px',
          textAlign: 'left'
        },
        {
          id: 'client-info-2',
          type: 'text',
          content: '{client_name}\n{client_address}\nPhone: {client_phone}\nEmail: {client_email}',
          position: { x: '50px', y: '280px' },
          color: '#7f8c8d',
          fontSize: '12px',
          fontWeight: 'normal',
          fontFamily: 'Arial',
          width: '300px',
          textAlign: 'left'
        },
        {
          id: 'items-table-2',
          type: 'items-table',
          position: { x: '50px', y: '370px' },
          width: '700px'
        },
        {
          id: 'greeting-2',
          type: 'text',
          content: '{greeting}',
          position: { x: '50px', y: '650px' },
          color: '#7f8c8d',
          fontSize: '12px',
          fontWeight: 'normal',
          fontFamily: 'Arial',
          width: '700px',
          textAlign: 'left'
        },
        {
          id: 'terms-2',
          type: 'text',
          content: 'Terms and Conditions:\n{terms_and_conditions}',
          position: { x: '50px', y: '700px' },
          color: '#7f8c8d',
          fontSize: '11px',
          fontWeight: 'normal',
          fontFamily: 'Arial',
          width: '700px',
          textAlign: 'left'
        }
      ],
      width: '800px',
      height: '1100px',
      backgroundColor: '#ffffff'
    },
    'default-3': {
      id: 'default-3',
      name: 'Modern Template (Default)',
      elements: [
        {
          id: 'header-3',
          type: 'text',
          content: 'INVOICE',
          position: { x: '50px', y: '50px' },
          color: '#3498db',
          fontSize: '40px',
          fontWeight: 'bold',
          fontFamily: 'Arial',
          width: '300px',
          textAlign: 'left'
        },
        {
          id: 'company-name-3',
          type: 'text',
          content: '{company_name}',
          position: { x: '50px', y: '110px' },
          color: '#2980b9',
          fontSize: '24px',
          fontWeight: 'bold',
          fontFamily: 'Arial',
          width: '400px',
          textAlign: 'left'
        },
        {
          id: 'company-details-3',
          type: 'text',
          content: '{company_address}\nPhone: {company_phone}\nEmail: {company_email}',
          position: { x: '50px', y: '150px' },
          color: '#34495e',
          fontSize: '12px',
          fontWeight: 'normal',
          fontFamily: 'Arial',
          width: '300px',
          textAlign: 'left'
        },
        {
          id: 'invoice-info-3',
          type: 'text',
          content: '# {invoice_number}\nIssued: {issued_date}\nDue: {due_date}',
          position: { x: '550px', y: '110px' },
          color: '#34495e',
          fontSize: '14px',
          fontWeight: 'normal',
          fontFamily: 'Arial',
          width: '200px',
          textAlign: 'right'
        },
        {
          id: 'client-section-3',
          type: 'text',
          content: 'CLIENT',
          position: { x: '50px', y: '250px' },
          color: '#3498db',
          fontSize: '18px',
          fontWeight: 'bold',
          fontFamily: 'Arial',
          width: '200px',
          textAlign: 'left'
        },
        {
          id: 'client-info-3',
          type: 'text',
          content: '{client_name}\n{client_address}\nPhone: {client_phone}\nEmail: {client_email}',
          position: { x: '50px', y: '280px' },
          color: '#34495e',
          fontSize: '12px',
          fontWeight: 'normal',
          fontFamily: 'Arial',
          width: '300px',
          textAlign: 'left'
        },
        {
          id: 'items-table-3',
          type: 'items-table',
          position: { x: '50px', y: '370px' },
          width: '700px'
        },
        {
          id: 'greeting-3',
          type: 'text',
          content: '{greeting}',
          position: { x: '50px', y: '650px' },
          color: '#34495e',
          fontSize: '12px',
          fontWeight: 'normal',
          fontFamily: 'Arial',
          width: '700px',
          textAlign: 'left'
        },
        {
          id: 'terms-3',
          type: 'text',
          content: 'Terms and Conditions:\n{terms_and_conditions}',
          position: { x: '50px', y: '700px' },
          color: '#7f8c8d',
          fontSize: '11px',
          fontWeight: 'normal',
          fontFamily: 'Arial',
          width: '700px',
          textAlign: 'left'
        }
      ],
      width: '800px',
      height: '1100px',
      backgroundColor: '#ffffff'
    }
  };
  
  return defaultTemplates[templateId] || null;
};

/**
 * Saves an invoice to the database
 * @param {Object} invoiceData - The invoice data to save
 * @returns {Promise<Object>} - The saved invoice data with ID
 */
export const saveInvoice = async (invoiceData) => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('You must be logged in to create an invoice');
    }
    
    // First, save the invoice to the invoices table
    const { data: invoice, error } = await supabase
      .from('invoices')
      .insert({
        user_id: user.id,
        company_name: invoiceData.companyName,
        company_address: invoiceData.companyAddress,
        company_email: invoiceData.companyEmail,
        company_phone: invoiceData.companyPhone,
        
        client_name: invoiceData.clientName,
        client_address: invoiceData.clientAddress,
        client_email: invoiceData.clientEmail,
        client_phone: invoiceData.clientPhone,
        
        invoice_number: invoiceData.invoiceNumber,
        issued_date: invoiceData.invoiceDate,
        due_date: invoiceData.dueDate,
        
        payment_terms: invoiceData.paymentTerms,
        greeting_message: invoiceData.greetingMessage,
        notes: invoiceData.notes,
        
        tax_rate: invoiceData.taxRate || 0,
        total: invoiceData.total,
        status: 'issued',
        template_id: invoiceData.templateId,
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Then save each invoice item
    const invoiceItems = invoiceData.items.map(item => ({
      invoice_id: invoice.id,
      description: item.description,
      quantity: item.quantity,
      price: item.price,
      total: item.quantity * item.price,
    }));
    
    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(invoiceItems);
    
    if (itemsError) {
      throw itemsError;
    }
    
    return invoice;
  } catch (error) {
    console.error('Error saving invoice:', error);
    throw error;
  }
};

/**
 * Saves an invoice as a draft to the database
 * @param {Object} draftData - The draft invoice data to save
 * @returns {Promise<Object>} - The saved draft data with ID
 */
export const saveInvoiceAsDraft = async (draftData) => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('You must be logged in to save a draft');
    }
    
    // First, save the draft invoice to the invoices table
    const { data: draft, error } = await supabase
      .from('invoices')
      .insert({
        user_id: user.id,
        company_name: draftData.companyName,
        company_address: draftData.companyAddress,
        company_email: draftData.companyEmail,
        company_phone: draftData.companyPhone,
        
        client_name: draftData.clientName,
        client_address: draftData.clientAddress,
        client_email: draftData.clientEmail,
        client_phone: draftData.clientPhone,
        
        invoice_number: draftData.invoiceNumber,
        issued_date: draftData.invoiceDate,
        due_date: draftData.dueDate,
        
        payment_terms: draftData.paymentTerms,
        greeting_message: draftData.greetingMessage,
        notes: draftData.notes,
        
        tax_rate: draftData.taxRate || 0,
        total: draftData.total,
        status: 'draft',
        template_id: draftData.templateId,
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Then save each invoice item
    if (draftData.items && draftData.items.length > 0) {
      const invoiceItems = draftData.items.map(item => ({
        invoice_id: draft.id,
        description: item.description,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price,
      }));
      
      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(invoiceItems);
      
      if (itemsError) {
        throw itemsError;
      }
    }
    
    return draft;
  } catch (error) {
    console.error('Error saving draft:', error);
    throw error;
  }
};

/**
 * Delete a template
 * @param {string} templateId - The ID of the template to delete
 * @returns {Promise<boolean>} - Success status
 */
export const deleteTemplate = async (templateId) => {
  try {
    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData?.user) {
      throw new Error('Authentication required');
    }
    
    const userId = userData.user.id;
    
    // Delete template with matching ID and user ID (for security)
    const { error } = await supabase
      .from('templates')
      .delete()
      .eq('id', templateId)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteTemplate:', error);
    throw error;
  }
};
