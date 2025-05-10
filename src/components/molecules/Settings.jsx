import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useCurrency } from '../../contexts/CurrencyContext';
import { ArrowLeft, Shield, Trash2, User, AlertTriangle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = ({ user }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const { currency, setCurrency } = useCurrency();
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isCurrencyLoading, setIsCurrencyLoading] = useState(false);
  const [isPasswordChecking, setIsPasswordChecking] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [profileMessage, setProfileMessage] = useState({ text: '', type: '' });
  const [currencyMessage, setCurrencyMessage] = useState({ text: '', type: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Common currencies used worldwide
  const currencies = [
    { code: 'USD', name: 'US Dollar ($)' },
    { code: 'EUR', name: 'Euro (€)' },
    { code: 'GBP', name: 'British Pound (£)' },
    { code: 'JPY', name: 'Japanese Yen (¥)' },
    { code: 'CAD', name: 'Canadian Dollar (C$)' },
    { code: 'AUD', name: 'Australian Dollar (A$)' },
    { code: 'CHF', name: 'Swiss Franc (CHF)' },
    { code: 'CNY', name: 'Chinese Yuan (¥)' },
    { code: 'INR', name: 'Indian Rupee (₹)' },
    { code: 'LKR', name: 'Sri Lankan Rupee (Rs)' }
  ];

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Error fetching user:', error);
          return;
        }
        
        if (data && data.user) {
          setCurrentUser(data.user);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUser) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, currency')
          .eq('id', currentUser.id)
          .single();
          
        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }
        
        if (data) {
          setFullName(data.full_name || '');
          if (data.currency) {
            setCurrency(data.currency);
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    fetchUserProfile();
  }, [currentUser, setCurrency]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!fullName.trim()) {
      setProfileMessage({ text: 'Please enter your full name', type: 'error' });
      return;
    }
    
    if (!currentUser) {
      setProfileMessage({ text: 'User not found, please sign in again', type: 'error' });
      return;
    }
    
    setIsProfileLoading(true);
    setProfileMessage({ text: '', type: '' });
    
    try {
      // Update profile in the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          full_name: fullName
        })
        .eq('id', currentUser.id);
        
      if (profileError) {
        throw profileError;
      }
      
      // Also update the display_name in Supabase Auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { display_name: fullName }
      });
      
      if (authError) {
        console.error('Error updating auth metadata:', authError);
        // Continue even if auth metadata update fails
      }
      
      setProfileMessage({ text: 'Profile updated successfully', type: 'success' });
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setProfileMessage({ text: '', type: '' });
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setProfileMessage({ text: 'Error updating profile', type: 'error' });
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handleUpdateCurrency = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setCurrencyMessage({ text: 'User not found, please sign in again', type: 'error' });
      return;
    }
    
    setIsCurrencyLoading(true);
    setCurrencyMessage({ text: '', type: '' });
    
    try {
      // Update currency in the profiles table
      const { error: currencyError } = await supabase
        .from('profiles')
        .update({ 
          currency: currency
        })
        .eq('id', currentUser.id);
        
      if (currencyError) {
        throw currencyError;
      }
      
      // Update the currency using the context (which saves to localStorage)
      setCurrency(currency);
      
      setCurrencyMessage({ text: 'Currency updated successfully', type: 'success' });
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setCurrencyMessage({ text: '', type: '' });
      }, 3000);
    } catch (error) {
      console.error('Error updating currency:', error);
      setCurrencyMessage({ text: 'Error updating currency', type: 'error' });
    } finally {
      setIsCurrencyLoading(false);
    }
  };

  const verifyCurrentPassword = async () => {
    setIsPasswordChecking(true);
    setMessage({ text: 'Verifying current password...', type: 'info' });
    
    try {
      if (!currentUser || !currentUser.email) {
        setMessage({ text: 'User information not available. Please sign in again.', type: 'error' });
        setIsPasswordChecking(false);
        return false;
      }
      
      // Use signInWithPassword to verify the current password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: currentUser.email,
        password: currentPassword,
      });
      
      if (error) {
        setMessage({ text: 'Current password is incorrect', type: 'error' });
        setIsPasswordChecking(false);
        return false;
      }
      
      setMessage({ text: 'Current password verified', type: 'success' });
      return true;
    } catch (error) {
      console.error('Error verifying password:', error);
      setMessage({ text: 'Error verifying current password', type: 'error' });
      setIsPasswordChecking(false);
      return false;
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setMessage({ text: 'Please fill in all fields', type: 'error' });
      return;
    }
    
    // Password requirements check
    if (newPassword.length < 6) {
      setMessage({ text: 'New password must be at least 6 characters long', type: 'error' });
      return;
    }

    // First verify the current password
    setIsLoading(true);
    
    const isPasswordValid = await verifyCurrentPassword();
    
    if (!isPasswordValid) {
      setIsLoading(false);
      return;
    }
    
    // If password is valid, proceed with updating
    try {
      setMessage({ text: 'Updating password...', type: 'info' });
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw error;
      }
      
      setMessage({ text: 'Password updated successfully', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage({ text: error.message || 'Error updating password', type: 'error' });
    } finally {
      setIsLoading(false);
      setIsPasswordChecking(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      if (!currentUser) {
        setMessage({ text: 'User information not available. Please sign in again.', type: 'error' });
        return;
      }

      // Set a loading state for the delete operation
      setIsLoading(true);
      setMessage({ text: 'Deleting your account...', type: 'info' });

      // 1. Get the auth token
      console.log('Fetching current session...');
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error(`Failed to get session: ${sessionError.message}`);
      }
      
      if (!sessionData?.session?.access_token) {
        console.error('No access token in session:', sessionData);
        throw new Error('No valid session found. Please sign in again.');
      }
      
      const token = sessionData.session.access_token;
      console.log('Token retrieved, length:', token.length);

      // 2. Call the backend endpoint to perform deletion
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      console.log(`Sending DELETE request to ${backendUrl}/api/users/me`);
      
      try {
        const response = await fetch(`${backendUrl}/api/users/me`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        
        // Try to parse response as JSON
        let result;
        const responseText = await response.text();
        try {
          result = responseText ? JSON.parse(responseText) : {};
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
          console.log('Raw response:', responseText);
          result = { message: 'Could not parse server response' };
        }
        
        console.log('Response status:', response.status);
        console.log('Response data:', result);

        if (!response.ok) {
          // Handle errors from the backend
          throw new Error(result.message || result.error || `Server responded with status ${response.status}`);
        }

        // 3. Backend confirmed deletion, now sign out client-side
        setMessage({ text: 'Account successfully deleted. Signing out...', type: 'success' });
        await supabase.auth.signOut();
        
        // 4. Redirect to auth page after a short delay
        setTimeout(() => {
        window.location.href = '/auth';
        }, 1500);
      } catch (fetchError) {
        console.error('Fetch error details:', fetchError);
        throw new Error(`Network error: ${fetchError.message}`);
      }
      
    } catch (error) {
      console.error('Error deleting account:', error);
      setMessage({ text: `Error deleting account: ${error.message}`, type: 'error' });
      setIsLoading(false); // Ensure loading state is turned off on error
    }
  };

  // Delete Account Modal
  const DeleteAccountModal = () => {
    if (!showDeleteModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black-transparent flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
          <button 
            onClick={() => setShowDeleteModal(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center mb-4 text-red-600">
            <AlertTriangle size={24} className="mr-2" />
            <h3 className="text-lg font-bold">Delete Account</h3>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-700 font-medium mb-2">
              ACCOUNT DELETION WARNING
            </p>
            <p className="text-red-600 mb-4">
              You are about to permanently delete your account and all associated data including:
            </p>
            <ul className="list-disc pl-5 mb-4 text-red-600">
              <li>Invoices and invoice details</li>
              <li>Clients</li>
              <li>Templates</li>
              <li>Profile information</li>
              <li>Analytics data</li>
            </ul>
            <p className="text-red-600 font-bold">
              This action cannot be reversed.
            </p>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setShowDeleteModal(false);
                handleDeleteAccount();
              }}
              className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition"
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
        <div className="mb-8 flex items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="mr-4 p-2 rounded-full text-gray-500 hover:bg-gray-200 transition"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">Account Settings</h1>
        </div>
        
        {/* Render the delete account modal */}
        <DeleteAccountModal />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar with sections */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <nav className="space-y-1 py-2">
                <a href="#profile" className="flex items-center px-4 py-3 text-gray-800 bg-gray-100 border-l-4 border-gray-800 font-medium">
                  <User size={18} className="mr-3 text-gray-800" />
                  <span>Profile Information</span>
                </a>
                <a href="#security" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-800">
                  <Shield size={18} className="mr-3 text-gray-400" />
                  <span>Security</span>
                </a>
                <a href="#danger" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-800">
                  <Trash2 size={18} className="mr-3 text-gray-400" />
                  <span>Danger Zone</span>
                </a>
              </nav>
            </div>
          </div>
          
          {/* Main content */}
          <div className="md:col-span-2 space-y-6">
            {/* Profile Information Section */}
            <section id="profile" className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="border-b border-gray-200">
                <h2 className="px-6 py-4 text-lg font-medium text-gray-800">Profile Information</h2>
              </div>
              
              <div className="p-6 space-y-8">
                {/* Full Name Form */}
                <div className="border-b border-gray-100 pb-6">
                  <h3 className="text-md font-medium text-gray-700 mb-4">Personal Details</h3>
                <form onSubmit={handleUpdateProfile}>
                  {profileMessage.text && (
                    <div className={`mb-5 p-3 rounded text-sm ${
                      profileMessage.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 
                      profileMessage.type === 'info' ? 'bg-gray-50 text-gray-700 border border-gray-200' : 
                      'bg-green-50 text-green-700 border border-green-200'
                    }`}>
                      {profileMessage.text}
                    </div>
                  )}
                  
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
                      />
                    </div>
                    
                    <div className="mt-4">
                      <button
                        type="submit"
                        disabled={isProfileLoading}
                        className="px-4 py-2 bg-gray-800 text-white font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProfileLoading ? 'Updating Name...' : 'Update Name'}
                      </button>
                    </div>
                  </form>
                </div>
                
                {/* Currency Form */}
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-4">Currency Settings</h3>
                  <form onSubmit={handleUpdateCurrency}>
                    {currencyMessage.text && (
                      <div className={`mb-5 p-3 rounded text-sm ${
                        currencyMessage.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 
                        currencyMessage.type === 'info' ? 'bg-gray-50 text-gray-700 border border-gray-200' : 
                        'bg-green-50 text-green-700 border border-green-200'
                      }`}>
                        {currencyMessage.text}
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
                      >
                        {currencies.map((currencyOption) => (
                          <option key={currencyOption.code} value={currencyOption.code}>
                            {currencyOption.name}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-xs text-gray-500">
                        This will be used for displaying amounts throughout the application.
                      </p>
                  </div>
                  
                    <div className="mt-4">
                    <button
                      type="submit"
                        disabled={isCurrencyLoading}
                      className="px-4 py-2 bg-gray-800 text-white font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isCurrencyLoading ? 'Updating Currency...' : 'Update Currency'}
                    </button>
                  </div>
                </form>
                </div>
              </div>
            </section>
            
            {/* Security Section */}
            <section id="security" className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="border-b border-gray-200">
                <h2 className="px-6 py-4 text-lg font-medium text-gray-800">Security</h2>
              </div>
              
              <div className="p-6">
                <form onSubmit={handleChangePassword}>
                  {message.text && (
                    <div className={`mb-5 p-3 rounded text-sm ${
                      message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 
                      message.type === 'info' ? 'bg-gray-50 text-gray-700 border border-gray-200' : 
                      'bg-green-50 text-green-700 border border-green-200'
                    }`}>
                      {message.text}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
                        disabled={isLoading && !isPasswordChecking}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
                        disabled={isLoading && !isPasswordChecking}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Password must be at least 6 characters long.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-gray-800 text-white font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading 
                        ? isPasswordChecking 
                          ? 'Verifying...' 
                          : 'Updating...' 
                        : 'Change Password'
                      }
                    </button>
                  </div>
                </form>
              </div>
            </section>
            
            {/* Danger Zone Section */}
            <section id="danger" className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="border-b border-gray-200">
                <h2 className="px-6 py-4 text-lg font-medium text-red-600">Danger Zone</h2>
              </div>
              
              <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                  <h3 className="text-sm font-medium text-red-800 mb-1">Delete Account</h3>
                  <p className="text-sm text-red-700">
                    Once you delete your account, there is no going back. All of your data will be permanently removed.
                  </p>
                </div>
                
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-white border border-red-600 text-red-600 font-medium rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition"
                >
                  Delete Account
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
