import React, { useState, useEffect } from 'react';
import { X, Save, UserPlus, Briefcase, Mail, Phone, MapPin } from 'lucide-react';
import { addClient, updateClient } from '../../../utils/supabaseClient';

const ClientAuthModal = ({ isOpen, onClose, onSave, clientToEdit = null, isEditMode = false }) => {
  const [clientData, setClientData] = useState({
    clientId: '',
    clientName: '',
    clientMobile: '',
    clientEmail: '',
    clientAddress: ''
  });
  
  // Store the actual database ID (primary key) for updates
  const [clientPrimaryId, setClientPrimaryId] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // When in edit mode, populate the form with existing client data
  useEffect(() => {
    if (isEditMode && clientToEdit) {
      setClientData({
        clientId: clientToEdit.client_id,
        clientName: clientToEdit.name,
        clientMobile: clientToEdit.phone,
        clientEmail: clientToEdit.email,
        clientAddress: clientToEdit.address
      });
      
      // Store the primary key ID for update operations
      setClientPrimaryId(clientToEdit.id);
    } else if (!isEditMode && !clientToEdit) {
      // Reset form when opening in add mode
      setClientData({
        clientId: '',
        clientName: '',
        clientMobile: '',
        clientEmail: '',
        clientAddress: ''
      });
      setClientPrimaryId(null);
    }
  }, [isEditMode, clientToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData({
      ...clientData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      let savedClient;
      
      if (isEditMode) {
        // Update existing client using the primary key ID
        savedClient = await updateClient(clientPrimaryId, clientData);
      } else {
        // Save new client
        savedClient = await addClient(clientData);
      }
      
      // Call the onSave function with the client data
      if (onSave) {
        onSave(clientData, isEditMode);
      }
      
      // Reset form
      setClientData({
        clientId: '',
        clientName: '',
        clientMobile: '',
        clientEmail: '',
        clientAddress: ''
      });
      setClientPrimaryId(null);
      
      // Close modal
      if (onClose) {
        onClose();
      }
    } catch (err) {
      setError(err.message || 'An error occurred while saving the client');
      console.error("Error saving client:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black-transparent flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden animate-fade-in-down">
        <div className="bg-gradient-to-r from-neutral-500 to-neutral-700 px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-poppins-bold text-white flex items-center">
            <UserPlus className="w-5 h-5 mr-2" />
            {isEditMode ? 'Edit Client' : 'Add New Client'}
          </h3>
          <button 
            onClick={onClose} 
            className="text-white cursor-pointer hover:text-gray-200 transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
              <p>{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-poppins-medium text-gray-700 mb-1">
                Client ID <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </span>
                <input
                  type="text"
                  name="clientId"
                  value={clientData.clientId}
                  onChange={handleChange}
                  className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="CL-001"
                  required
                  disabled={loading || isEditMode} /* Disable editing client ID when in edit mode */
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-poppins-medium text-gray-700 mb-1">
                Client Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserPlus className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </span>
                <input
                  type="text"
                  name="clientName"
                  value={clientData.clientName}
                  onChange={handleChange}
                  className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="ABC Company"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-poppins-medium text-gray-700 mb-1">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </span>
                <input
                  type="tel"
                  name="clientMobile"
                  value={clientData.clientMobile}
                  onChange={handleChange}
                  className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="+94 7X XXX XXXX"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-poppins-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </span>
                <input
                  type="email"
                  name="clientEmail"
                  value={clientData.clientEmail}
                  onChange={handleChange}
                  className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="client@example.com"
                  disabled={loading}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-poppins-medium text-gray-700 mb-1">
                Address
              </label>
              <div className="relative">
                <span className="absolute top-2 left-0 pl-3 flex items-start pointer-events-none">
                  <MapPin className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </span>
                <textarea
                  name="clientAddress"
                  value={clientData.clientAddress}
                  onChange={handleChange}
                  rows="3"
                  className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="Client address"
                  disabled={loading}
                ></textarea>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-3 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-poppins-medium text-sm transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-neutral-600 cursor-pointer text-white font-poppins-medium rounded-md shadow-sm hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  {isEditMode ? 'Updating...' : 'Saving...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditMode ? 'Update Client' : 'Save Client'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientAuthModal;
