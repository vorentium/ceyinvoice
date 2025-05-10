import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  InputAdornment, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TextField, 
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Stack,
  Chip,
  Grid,
  Tooltip,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { Search, Plus, Edit, Trash2, Calendar, DollarSign, Share2, Eye } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getUserInvoices, deleteInvoice, getInvoiceById, supabase } from '../../../utils/supabaseClient';

const Invoices = () => {
  const theme = useTheme();
  const navigate = useNavigate(); 
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  
  // State for invoice data
  const [invoices, setInvoices] = useState([]);
  // State for loading and error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  
  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // State for action feedback
  const [actionSuccess, setActionSuccess] = useState(null);
  const [actionError, setActionError] = useState(null);

  const [searchParams] = useSearchParams();
  const invoiceIdToEdit = searchParams.get('invoice');
  const isEditing = !!invoiceIdToEdit;

  // Fetch invoices on component mount
  useEffect(() => {
    fetchInvoices();
  }, []);

  // Function to fetch invoices from Supabase
  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const invoiceData = await getUserInvoices();
      setInvoices(invoiceData);
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setError("Failed to load invoices. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredInvoices = invoices.filter(invoice => 
    invoice.invoiceNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.client?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'Paid':
        return {
          className: 'bg-green-100 text-green-800',
          borderColor: '#4ade80'
        };
      case 'Pending':
        return {
          className: 'bg-yellow-100 text-yellow-800',
          borderColor: '#fbbf24'
        };
      default:
        return {
          className: 'bg-red-100 text-red-800',
          borderColor: '#f87171'
        };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    // Try to convert the date string to a proper date object
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Handle edit invoice - passes the invoice ID as query parameter
  const handleEdit = async (invoiceId) => {
    try {
      setLoading(true);
      // Fetch the complete invoice data including template_id
      const invoiceDetails = await getInvoiceById(invoiceId);
      
      if (!invoiceDetails) {
        throw new Error('Invoice not found');
      }
      
      // Navigate to form with both invoice ID and template ID
      navigate(`/form?invoice=${invoiceId}&template=${invoiceDetails.template_id}`);
    } catch (err) {
      console.error("Error fetching invoice details for edit:", err);
      setActionError("Failed to edit invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle preview invoice
  const handlePreview = async (invoiceId) => {
    try {
      setLoading(true);
      // Fetch the complete invoice data
      const invoiceDetails = await getInvoiceById(invoiceId);
      
      if (!invoiceDetails) {
        throw new Error('Invoice not found');
      }
      
      // Fetch the specific template_id field directly
      const { data: templateData, error: templateError } = await supabase
        .from('invoice_details')
        .select('template_id')
        .eq('id', invoiceId)
        .single();
        
      if (templateError) throw new Error(`Error fetching template ID: ${templateError.message}`);
      if (!templateData) throw new Error('Invoice template data not found');
      
      const templateId = templateData.template_id;
      
      if (!templateId) {
        // If no template ID is found, show an error
        setActionError("This invoice doesn't have an associated template. Please edit the invoice first.");
        return;
      }
      
      // Navigate to preview with both invoice ID and template ID
      navigate(`/invoice-view?id=${invoiceId}&templateId=${templateId}`);
    } catch (err) {
      console.error("Error previewing invoice:", err);
      setActionError("Failed to preview invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete confirmation dialog
  const openDeleteDialog = async (invoice) => {
    try {
      // Fetch complete invoice details 
      const invoiceDetails = await getInvoiceById(invoice.id);
      
      if (!invoiceDetails) {
        throw new Error('Invoice not found');
      }
      
      // Fetch the specific template_id field directly
      const { data: templateData, error: templateError } = await supabase
        .from('invoice_details')
        .select('template_id')
        .eq('id', invoice.id)
        .single();
        
      if (templateError) throw new Error(`Error fetching template ID: ${templateError.message}`);
      if (!templateData) throw new Error('Invoice template data not found');
      
      // Set the complete invoice details to be deleted
      setInvoiceToDelete({
        ...invoice,
        template_id: templateData.template_id
      });
      
      setDeleteDialogOpen(true);
    } catch (err) {
      console.error("Error fetching invoice details for delete:", err);
      setActionError("Failed to prepare invoice for deletion. Please try again.");
    }
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setInvoiceToDelete(null);
  };

  // Handle delete invoice
  const handleDelete = async () => {
    if (!invoiceToDelete) return;
    
    setDeleteLoading(true);
    setActionError(null);
    
    try {
      await deleteInvoice(invoiceToDelete.id);
      
      // Remove the deleted invoice from the state
      setInvoices(prevInvoices => 
        prevInvoices.filter(invoice => invoice.id !== invoiceToDelete.id)
      );
      
      // Show success message
      setActionSuccess(`Invoice ${invoiceToDelete.invoiceNo} has been deleted.`);
      
      // Close the dialog
      closeDeleteDialog();
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setActionSuccess(null);
      }, 5000);
    } catch (err) {
      setActionError(`Failed to delete invoice: ${err.message}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Box p={isMobile ? 2 : 3}>
      <Box 
        display="flex" 
        flexDirection={isMobile ? "column" : "row"}
        justifyContent="space-between" 
        alignItems={isMobile ? "flex-start" : "center"}
        mb={isMobile ? 2 : 3}
      >
        <Typography 
          variant={isMobile ? "h6" : "h5"} 
          component="h1" 
          fontWeight="bold" 
          mb={isMobile ? 2 : 0}
        >
          Invoices
        </Typography>
        
        <Button 
          variant="contained" 
          sx={{ 
            borderRadius: '8px', 
            padding: isMobile ? '6px 12px' : '8px 16px',
            alignSelf: isMobile ? "stretch" : "auto",
            backgroundColor: '#000',
            '&:hover': {
              backgroundColor: '#333',
            }
          }}
          startIcon={<Plus size={isMobile ? 16 : 20} />}
          onClick={() => navigate('/form')}
        >
          Create New Invoice
        </Button>
      </Box>

      {/* Display success message */}
      {actionSuccess && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setActionSuccess(null)}>
          {actionSuccess}
        </Alert>
      )}

      {/* Display error message from actions */}
      {actionError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setActionError(null)}>
          {actionError}
        </Alert>
      )}

      <Paper 
        elevation={0} 
        sx={{ 
          p: isMobile ? 1.5 : 2, 
          mb: isMobile ? 2 : 3,
          borderRadius: '12px',
          width: '100%',
          backgroundColor: 'transparent'
        }}
      >
        <TextField
          fullWidth
          placeholder="Search invoices by number, client or status..."
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={isMobile ? 16 : 20} color="#666" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 1 }}
          size={isMobile ? "small" : "medium"}
        />
      </Paper>

      {/* Show error message if there was an error loading invoices */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Show loading indicator while fetching invoices */}
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Show a message if no invoices are found */}
          {filteredInvoices.length === 0 && !loading && (
            <Paper sx={{ p: 3, textAlign: 'center', mb: 2 }}>
              <Typography variant="body1" color="text.secondary">
                {searchQuery ? 'No invoices match your search' : 'No invoices found. Create your first invoice!'}
              </Typography>
            </Paper>
          )}

          {/* Invoice Table */}
          {filteredInvoices.length > 0 && (
      <TableContainer component={Paper} sx={{ 
        borderRadius: '12px', 
        overflowX: 'auto',
        width: '100%'
      }}>
        <Table size={isLargeScreen ? "medium" : "small"} sx={{ 
          minWidth: isMobile ? 450 : 650,
          width: '100%',
          tableLayout: 'fixed'
        }}>
          <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
            <TableRow>
              {!isMobile && <TableCell width="15%">Invoice No</TableCell>}
              <TableCell width={isMobile ? "30%" : "25%"}>Client</TableCell>
              {!isMobile && <TableCell width="15%">Date</TableCell>}
              <TableCell width={isMobile ? "20%" : "15%"} align="right">Amount</TableCell>
              <TableCell width={isMobile ? "25%" : "15%"}>Status</TableCell>
              <TableCell width={isMobile ? "25%" : "15%"} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInvoices.map((invoice) => {
              const statusStyle = getStatusColor(invoice.status);
              return (
                <TableRow key={invoice.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  {!isMobile && (
                    <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {invoice.invoiceNo}
                    </TableCell>
                  )}
                  <TableCell sx={{ wordBreak: 'break-word' }}>
                    {isMobile ? (
                      <Box>
                        <Typography variant="body2" fontWeight="bold">{invoice.invoiceNo}</Typography>
                        <Typography variant="body2">{invoice.client}</Typography>
                              <Typography variant="caption" color="text.secondary">{formatDate(invoice.date)}</Typography>
                      </Box>
                    ) : invoice.client}
                  </TableCell>
                        {!isMobile && <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDate(invoice.date)}</TableCell>}
                        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>LKR {invoice.amount?.toFixed(2) || "0.00"}</TableCell>
                  <TableCell>
                    <span 
                      className={`px-2 inline-flex text-xs leading-5 font-poppins-medium rounded-full ${statusStyle.className}`}
                    >
                      {invoice.status}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" justifyContent="center">
                      <Tooltip title="Edit">
                        <IconButton 
                          size="small" 
                          color="primary" 
                          sx={{ mr: 1 }}
                          onClick={() => handleEdit(invoice.id)}
                        >
                          <Edit size={isMobile ? 16 : 18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Preview">
                        <IconButton 
                          size="small" 
                          color="primary" 
                          sx={{ mr: 1 }}
                          onClick={() => handlePreview(invoice.id)}
                        >
                          <Eye size={isMobile ? 16 : 18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => openDeleteDialog(invoice)}
                        >
                          <Trash2 size={isMobile ? 16 : 18} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Delete Invoice"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete invoice {invoiceToDelete?.invoiceNo}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={closeDeleteDialog} 
            color="primary"
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            autoFocus
            disabled={deleteLoading}
            startIcon={deleteLoading && <CircularProgress size={16} color="inherit" />}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Invoices;
