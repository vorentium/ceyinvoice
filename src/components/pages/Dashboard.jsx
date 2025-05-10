import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { supabase, getDashboardStats, getRecentInvoices, trackUserJourney } from '../../utils/supabaseClient';
import { useCurrency } from '../../contexts/CurrencyContext';
import Invoices from './sub_pages/Invoices';
import Client from './sub_pages/Client';
import Templates from './sub_pages/Templates';
import HelpAndSupport from './sub_pages/Help&Support';
import Side_menu from '../layout/Side_menu';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Divider, 
  Button,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tooltip
} from '@mui/material';
import { 
  CreditCard, 
  Users, 
  DollarSign, 
  FileText, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Wallet,
  Eye,
  Download,
  MoreHorizontal,
  Receipt,
  FilePlus,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const { source } = useParams(); // Get the source from URL params if available
  const [searchParams] = useSearchParams(); // Get query parameters
  const pageParam = searchParams.get('page');
  const utmSource = searchParams.get('utm_source');
  const utmMedium = searchParams.get('utm_medium');
  const utmCampaign = searchParams.get('utm_campaign');
  const utmContent = searchParams.get('utm_content');
  const utmTerm = searchParams.get('utm_term');
  
  const { formatAmount } = useCurrency(); // Get currency formatting function from context
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState(pageParam || 'dashboard');
  const [stats, setStats] = useState({
    totalInvoices: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    overdueInvoices: 0,
    totalRevenue: 0,
    pendingRevenue: 0,
    totalClients: 0,
    recentActivity: [],
    lastUpdated: null
  });
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Track user journey and UTM parameters
  useEffect(() => {
    const trackingParams = {
      source: utmSource || source,
      medium: utmMedium,
      campaign: utmCampaign,
      content: utmContent,
      term: utmTerm,
      page: 'dashboard',
      action: 'page_view',
      additionalData: {
        activePage: pageParam || 'dashboard',
        referrer: document.referrer,
        userAgent: navigator.userAgent
      }
    };
    
    // Only track if we have a user and at least one tracking parameter
    if (user && (source || utmSource || utmMedium || utmCampaign)) {
      trackUserJourney(trackingParams);
    }
  }, [user, source, utmSource, utmMedium, utmCampaign, utmContent, utmTerm, pageParam]);

  // Set active page based on URL parameters
  useEffect(() => {
    if (pageParam) {
      setActivePage(pageParam);
    }
  }, [source, utmSource, utmMedium, utmCampaign, pageParam]);

  useEffect(() => {
    // Check for authenticated user
    const getUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        
        if (error || !data?.user) {
          navigate('/auth');
          return;
        }
        
        setUser(data.user);
      } catch (err) {
        navigate('/auth');
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [navigate]);

  useEffect(() => {
    fetchDashboardStats();
    fetchRecentInvoices();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      // Clear previous stats before fetching new ones to ensure we see the refresh
      setStats({
        totalInvoices: 0,
        paidInvoices: 0,
        pendingInvoices: 0,
        overdueInvoices: 0,
        totalRevenue: 0,
        pendingRevenue: 0,
        totalClients: 0,
        recentActivity: [],
        lastUpdated: null
      });
      
      // Force the latest data calculation instead of using cached stats
      const dashboardData = await getDashboardStats();
      
      setStats(dashboardData);
      
      // Also refresh the recent invoices to keep everything in sync
      fetchRecentInvoices();
      
      // Track the refresh action with the new counts
      trackAction('dashboard_refreshed', {
        totalInvoices: dashboardData.totalInvoices,
        paidInvoices: dashboardData.paidInvoices,
        pendingInvoices: dashboardData.pendingInvoices,
        overdueInvoices: dashboardData.overdueInvoices,
        totalRevenue: dashboardData.totalRevenue,
        pendingRevenue: dashboardData.pendingRevenue
      });
    } catch (err) {
      setError('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentInvoices = async () => {
    setLoadingInvoices(true);
    try {
      const invoicesData = await getRecentInvoices(5);
      setRecentInvoices(invoicesData);
    } catch (err) {
      // We don't set the main error state here to avoid disrupting the entire dashboard
    } finally {
      setLoadingInvoices(false);
    }
  };

  // Track user action
  const trackAction = (action, additionalData = {}) => {
    if (!user) return; // Only track for authenticated users
    
    const trackingParams = {
      source: utmSource || source,
      medium: utmMedium,
      campaign: utmCampaign,
      content: utmContent,
      term: utmTerm,
      page: 'dashboard',
      action: action,
      additionalData: {
        ...additionalData,
        activePage
      }
    };
    
    trackUserJourney(trackingParams);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
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

  // Render the Recent Invoices Section
  const renderRecentInvoices = () => {
    if (loadingInvoices) {
      return (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress size={30} />
        </Box>
      );
    }

    if (recentInvoices.length === 0) {
      return (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          py={5}
        >
          <Box sx={{ mb: 2, color: 'text.secondary' }}>
            <Receipt size={48} strokeWidth={1.5} />
          </Box>
          <Typography variant="body1" color="text.secondary" align="center">
            No invoices created yet.
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" mt={1}>
            Create your first invoice to see it here.
          </Typography>
          <Box mt={3}>
            <Button 
              variant="outlined" 
              size="small"
              component={Link} 
              to="/creator-studio?utm_source=dashboard&utm_medium=button&utm_campaign=empty_state"
              onClick={() => trackAction('create_invoice_click', { location: 'empty_state' })}
              startIcon={<FileText size={16} />}
            >
              Create Invoice
            </Button>
          </Box>
        </Box>
      );
    }

    return (
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Invoice #</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentInvoices.map((invoice) => (
              <TableRow key={invoice.id} hover>
                <TableCell sx={{ py: 1.5 }}>
                  <Typography variant="body2" fontWeight="medium">
                    {invoice.invoiceNumber}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 1.5 }}>
                  <Tooltip title={invoice.clientEmail || ''}>
                    <Typography variant="body2">
                      {invoice.client}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell sx={{ py: 1.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(invoice.date)}
                  </Typography>
                </TableCell>
                <TableCell align="right" sx={{ py: 1.5 }}>
                  <Typography variant="body2" fontWeight="medium">
                    {formatAmount(invoice.amount)}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 1.5 }}>
                  <Chip 
                    label={invoice.status} 
                    size="small"
                    color={
                      invoice.status === 'Paid' ? 'success' : 
                      invoice.status === 'Pending' ? 'warning' : 'error'
                    }
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="center" sx={{ py: 1.5 }}>
                  <Box display="flex" justifyContent="center">
                    <Tooltip title="View">
                      <IconButton 
                        size="small" 
                        sx={{ mr: 1 }}
                        component={Link}
                        to={`/invoices/${invoice.id}?utm_source=dashboard&utm_medium=button&utm_campaign=view_invoice`}
                        onClick={() => trackAction('view_invoice_click', { invoice_id: invoice.id })}
                      >
                        <Eye size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download">
                      <IconButton 
                        size="small"
                        onClick={() => trackAction('download_invoice_click', { invoice_id: invoice.id })}
                      >
                        <Download size={16} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  // Function to handle page navigation and tracking
  const handlePageChange = (page) => {
    setActivePage(page);
    trackAction('page_navigation', { 
      from: activePage,
      to: page 
    });
    
    // Update URL with the new page parameter without full page refresh
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', page);
    navigate(`/dashboard?${newSearchParams.toString()}`, { replace: true });
  };

  const renderPage = () => {
    if (activePage === 'dashboard') {
        return (
        <Box sx={{ flexGrow: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {/* Header with refresh and quick actions */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 4
            }}
          >
            <Box>
              <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 600 }}>
                Dashboard Overview
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                {stats.lastUpdated ? `Last updated: ${formatDate(stats.lastUpdated)}` : 'Welcome to your invoice dashboard'}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<RefreshCw size={16} />}
                onClick={() => {
                  fetchDashboardStats();
                  trackAction('refresh_dashboard');
                }}
                sx={{ borderRadius: '8px' }}
              >
                Refresh
                  </Button>
              <Button 
                variant="contained"
                color="primary"
                size="small"
                component={Link}
                to="/form"
                onClick={() => trackAction('create_invoice_click', { location: 'header' })}
                startIcon={<FilePlus size={16} />}
                sx={{ 
                  borderRadius: '8px',
                  backgroundColor: '#3b82f6',
                  '&:hover': {
                    backgroundColor: '#2563eb'
                  }
                }}
              >
                Create Invoice
              </Button>
            </Box>
          </Box>

                {/* Stats Summary Cards */}
          <Grid container spacing={3} mb={4}>
                  <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                height: '100%', 
                borderRadius: '12px', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(230, 232, 240, 1)'
              }}>
                          <Box 
                            sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    right: 0, 
                    background: 'rgba(59, 130, 246, 0.08)', 
                    p: 1.5, 
                    borderBottomLeftRadius: '12px'
                            }}
                          >
                            <FileText size={24} color="#3b82f6" />
                          </Box>
                <CardContent sx={{ padding: '20px', '&:last-child': { paddingBottom: '20px' } }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                            Total Invoices
                          </Typography>
                  <Typography variant="h4" fontWeight="bold" mt={1} mb={2}>
                      {stats.totalInvoices}
                        </Typography>
                  <Box display="flex" alignItems="center" flexWrap="wrap" gap={1}>
                    <Chip 
                      size="small" 
                      icon={<CheckCircle2 size={14} />} 
                      label={`${stats.paidInvoices} Paid`} 
                      sx={{ 
                        backgroundColor: 'rgba(34, 197, 94, 0.1)', 
                        color: '#22c55e', 
                        fontWeight: 500,
                        border: 'none',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        handlePageChange('invoices');
                        trackAction('filter_invoices_click', { filter: 'paid' });
                      }}
                    />
                    <Chip 
                      size="small" 
                      icon={<Clock size={14} />} 
                      label={`${stats.pendingInvoices} Pending`} 
                      sx={{ 
                        backgroundColor: 'rgba(234, 179, 8, 0.1)', 
                        color: '#eab308', 
                        fontWeight: 500,
                        border: 'none',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        handlePageChange('invoices');
                        trackAction('filter_invoices_click', { filter: 'pending' });
                      }}
                    />
                    <Chip 
                      size="small" 
                      icon={<AlertCircle size={14} />} 
                      label={`${stats.overdueInvoices} Overdue`} 
                      sx={{ 
                        backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                        color: '#ef4444', 
                        fontWeight: 500,
                        border: 'none',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        handlePageChange('invoices');
                        trackAction('filter_invoices_click', { filter: 'overdue' });
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                height: '100%', 
                borderRadius: '12px', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(230, 232, 240, 1)'
              }}>
                          <Box 
                            sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    right: 0, 
                    background: 'rgba(34, 197, 94, 0.08)', 
                    p: 1.5, 
                    borderBottomLeftRadius: '12px'
                            }}
                          >
                            <DollarSign size={24} color="#22c55e" />
                          </Box>
                <CardContent sx={{ padding: '20px', '&:last-child': { paddingBottom: '20px' } }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                            Total Revenue
                          </Typography>
                  <Typography variant="h4" fontWeight="bold" mt={1} mb={2}>
                          {formatAmount(stats.totalRevenue)}
                        </Typography>
                        <Box display="flex" alignItems="center">
                    <TrendingUp size={16} color="#22c55e" />
                    <Typography variant="body2" color="text.secondary" ml={1}>
                      <span style={{ color: '#22c55e', fontWeight: 500 }}>
                        {formatAmount(stats.totalRevenue - stats.pendingRevenue)}
                      </span> collected
                          </Typography>
                        </Box>
                  <Typography variant="body2" color="warning.main" mt={1}>
                    {formatAmount(stats.pendingRevenue)} pending collection
                  </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                height: '100%', 
                borderRadius: '12px', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(230, 232, 240, 1)'
              }}>
                          <Box 
                            sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    right: 0, 
                    background: 'rgba(139, 92, 246, 0.08)', 
                    p: 1.5, 
                    borderBottomLeftRadius: '12px'
                            }}
                          >
                            <Users size={24} color="#8b5cf6" />
                          </Box>
                <CardContent sx={{ padding: '20px', '&:last-child': { paddingBottom: '20px' } }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                            Total Clients
                          </Typography>
                  <Typography variant="h4" fontWeight="bold" mt={1} mb={2}>
                      {stats.totalClients}
                        </Typography>
                        <Button 
                          size="small" 
                          endIcon={<ArrowRight size={16} />}
                          onClick={() => {
                            handlePageChange('clients');
                            trackAction('view_clients_click', { location: 'clients_card' });
                          }}
                          sx={{ 
                            textTransform: 'none', 
                            color: '#8b5cf6',
                            padding: 0, 
                            '&:hover': { backgroundColor: 'transparent', color: '#7c3aed' }
                          }}
                        >
                          View all clients
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                height: '100%', 
                borderRadius: '12px', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(230, 232, 240, 1)'
              }}>
                <CardContent sx={{ padding: '20px', '&:last-child': { paddingBottom: '20px' } }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                          Quick Actions
                        </Typography>
                  <Box display="flex" flexDirection="column" gap={2} mt={2}>
                          <Link to="/creator-studio?utm_source=dashboard&utm_medium=button&utm_campaign=quick_actions" style={{ textDecoration: 'none' }}>
                            <Button 
                              variant="outlined" 
                              fullWidth 
                              startIcon={<FileText size={16} />}
                              onClick={() => trackAction('create_invoice_click', { location: 'quick_actions' })}
                              sx={{ 
                                justifyContent: 'flex-start', 
                                textTransform: 'none',
                                borderRadius: '8px',
                                padding: '8px 12px',
                                borderColor: 'rgba(59, 130, 246, 0.5)',
                                color: '#3b82f6',
                                '&:hover': {
                                  borderColor: '#3b82f6',
                                  backgroundColor: 'rgba(59, 130, 246, 0.04)'
                                }
                              }}
                            >
                              Invoice Creator Studio
                            </Button>
                          </Link>
                          <Button 
                            variant="outlined" 
                            fullWidth 
                            startIcon={<Users size={16} />}
                            onClick={() => {
                              handlePageChange('clients');
                              trackAction('add_client_click', { location: 'quick_actions' });
                            }}
                            sx={{ 
                              justifyContent: 'flex-start', 
                              textTransform: 'none',
                              borderRadius: '8px',
                              padding: '8px 12px',
                              borderColor: 'rgba(139, 92, 246, 0.5)',
                              color: '#8b5cf6',
                              '&:hover': {
                                borderColor: '#8b5cf6',
                                backgroundColor: 'rgba(139, 92, 246, 0.04)'
                              }
                            }}
                          >
                            Add New Client
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

            {/* Recent Invoices Section */}
                <Card sx={{ 
                  borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid rgba(230, 232, 240, 1)'
                }}>
                  <Box 
                    sx={{ 
                      p: 2, 
                      borderBottom: '1px solid rgba(0,0,0,0.08)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      Recent Invoices
                    </Typography>
                    <Button 
                      size="small"
                      endIcon={<ArrowRight size={16} />}
                      onClick={() => {
                        handlePageChange('invoices');
                        trackAction('view_all_invoices_click');
                      }}
                      sx={{ textTransform: 'none' }}
                    >
                      View All
                    </Button>
                  </Box>
                  <Box sx={{ p: 0 }}>
                    {renderRecentInvoices()}
                  </Box>
                </Card>
        </Box>
      );
    } else {
      return (
        <Box p={isMobile ? 2 : 3}>
                          <Box 
                            display="flex" 
            flexDirection={isMobile ? "column" : "row"}
            justifyContent="space-between" 
            alignItems={isMobile ? "flex-start" : "center"}
            mb={3}
          >
                                        <Typography 
              variant={isMobile ? "h6" : "h5"} 
              component="h1" 
              fontWeight="bold" 
              mb={isMobile ? 2 : 0}
            >
              Dashboard
                        </Typography>
                        
            {!loading && stats.lastUpdated && (
              <Typography variant="body2" color="text.secondary">
                Last updated: {formatDate(stats.lastUpdated)}
                            </Typography>
            )}
          </Box>
          
          {activePage === 'invoices' && <Invoices />}
          {activePage === 'clients' && <Client />}
          {activePage === 'templates' && <Templates />}
          {activePage === 'help' && <HelpAndSupport />}
          </Box>
        );
    }
  };

  if (loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-poppins-medium">Loading dashboard...</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Sidebar Component */}
      <Side_menu 
        user={user}
        activePage={activePage}
        setActivePage={handlePageChange}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 lg:overflow-auto">
        <header className="bg-white shadow-sm lg:block hidden sticky top-0 z-10">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-poppins-bold text-gray-900">
              {activePage === 'dashboard' ? 'Dashboard' : activePage.charAt(0).toUpperCase() + activePage.slice(1)}
            </h1>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="lg:hidden mb-6">
            <h1 className="text-2xl font-poppins-bold text-gray-900">
              {activePage === 'dashboard' ? 'Dashboard' : activePage.charAt(0).toUpperCase() + activePage.slice(1)}
            </h1>
          </div>
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;