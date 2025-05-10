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
  Grid,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { Search, Plus, Edit, Trash2, Phone, Mail, AlertTriangle } from 'lucide-react';
import ClientAuthModal from '../templates/Client_auth';
import { getUserClients, deleteClient } from '../../../utils/supabaseClient';

const Client = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  
  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  
  // Data loading states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Snackbar state for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  
  // Client data
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Load clients on component mount
  useEffect(() => {
    fetchClients();
  }, []);
  
  // Fetch clients from Supabase
  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const clientsData = await getUserClients();
      setClients(clientsData);
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError("Failed to load clients. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredClients = clients.filter(client => 
    client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Add client modal handlers
  const handleOpenModal = (client = null) => {
    if (client) {
      setSelectedClient(client);
      setIsEditMode(true);
    } else {
      setSelectedClient(null);
      setIsEditMode(false);
    }
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
    setIsEditMode(false);
  };
  
  // Handle saving a client (add or update)
  const handleSaveClient = async (clientData, isEdit) => {
    // Refresh the client list to include the new/updated client
    await fetchClients();
    
    // Show success notification
    setSnackbar({
      open: true,
      message: isEdit ? 'Client updated successfully!' : 'Client added successfully!',
      severity: 'success'
    });
  };
  
  // Delete confirmation dialog handlers
  const handleOpenDeleteDialog = (client) => {
    setClientToDelete(client);
    setDeleteDialogOpen(true);
  };
  
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setClientToDelete(null);
  };
  
  // Handle confirming client deletion
  const handleConfirmDelete = async () => {
    if (!clientToDelete) return;
    
    try {
      // Use the primary key ID for deletion
      await deleteClient(clientToDelete.id);
      
      // Remove client from state
      setClients(prevClients => 
        prevClients.filter(client => client.id !== clientToDelete.id)
      );
      
      // Show success notification
      setSnackbar({
        open: true,
        message: 'Client deleted successfully!',
        severity: 'success'
      });
      
      // Close the dialog
      handleCloseDeleteDialog();
    } catch (err) {
      console.error("Error deleting client:", err);
      
      // Show error notification
      setSnackbar({
        open: true,
        message: `Failed to delete client: ${err.message}`,
        severity: 'error'
      });
      
      // Close the dialog
      handleCloseDeleteDialog();
    }
  };
  
  // Handle closing the snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box p={isMobile ? 2 : 3}>
      {/* Client Form Modal */}
      <ClientAuthModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveClient}
        clientToEdit={selectedClient}
        isEditMode={isEditMode}
      />
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            borderRadius: '10px',
            padding: '8px'
          }
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          color: 'error.main',
          fontWeight: 'bold'
        }}>
          <AlertTriangle size={24} />
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete client{' '}
            <strong>{clientToDelete?.name}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: 2 }}>
          <Button 
            onClick={handleCloseDeleteDialog} 
            variant="outlined"
            sx={{ borderRadius: '8px' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            variant="contained" 
            color="error"
            autoFocus
            sx={{ borderRadius: '8px' }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notification Snackbar */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      
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
          Clients
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
          onClick={() => handleOpenModal()}
        >
          Add New Client
        </Button>
      </Box>

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
          placeholder="Search clients by name, email, phone or address..."
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

      {/* Show error message if there was an error loading clients */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Show loading indicator while fetching clients */}
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Show a message if no clients are found */}
          {filteredClients.length === 0 && !loading && (
            <Paper sx={{ p: 3, textAlign: 'center', mb: 2 }}>
              <Typography variant="body1" color="text.secondary">
                {searchQuery ? 'No clients match your search' : 'No clients found. Add your first client!'}
              </Typography>
            </Paper>
          )}

          {/* Client Table */}
          {filteredClients.length > 0 && (
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
              <TableCell width={isMobile ? "50%" : isLargeScreen ? "25%" : "20%"}>Client Name</TableCell>
              {!isMobile && <TableCell width={isLargeScreen ? "25%" : "25%"}>Email</TableCell>}
              {!isMobile && <TableCell width={isLargeScreen ? "15%" : "15%"}>Phone</TableCell>}
              {!isMobile && <TableCell width={isLargeScreen ? "25%" : "30%"}>Address</TableCell>}
              <TableCell width={isMobile ? "50%" : isLargeScreen ? "10%" : "10%"} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell sx={{ wordBreak: 'break-word' }}>
                  {isMobile ? (
                    <Box>
                      <Typography variant="body2" fontWeight="bold">{client.name}</Typography>
                      <Box display="flex" alignItems="center" mt={0.5}>
                        <Mail size={14} color="#666" />
                        <Typography variant="caption" ml={0.5} sx={{ wordBreak: 'break-word' }}>
                          {client.email}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" mt={0.5}>
                        <Phone size={14} color="#666" />
                        <Typography variant="caption" ml={0.5}>
                          {client.phone}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                        {client.address}
                      </Typography>
                    </Box>
                  ) : client.name}
                </TableCell>
                {!isMobile && <TableCell sx={{ wordBreak: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {client.email}
                </TableCell>}
                {!isMobile && <TableCell sx={{ whiteSpace: 'nowrap' }}>{client.phone}</TableCell>}
                {!isMobile && <TableCell sx={{ wordBreak: 'break-word' }}>{client.address}</TableCell>}
                <TableCell align="center">
                  <Box display="flex" justifyContent="center">
                    <Tooltip title="Edit">
                            <IconButton 
                              size="small" 
                              color="primary" 
                              sx={{ mr: 1 }}
                              onClick={() => handleOpenModal(client)}
                            >
                        <Edit size={isMobile ? 16 : 18} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                            <IconButton 
                              size="small" 
                              color="error" 
                              onClick={() => handleOpenDeleteDialog(client)}
                            >
                        <Trash2 size={isMobile ? 16 : 18} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
          )}
        </>
      )}
    </Box>
  );
};

export default Client; 