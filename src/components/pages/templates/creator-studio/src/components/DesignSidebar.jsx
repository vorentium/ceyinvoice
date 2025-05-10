import React, { useState, useEffect } from 'react';
import { X, Plus, FileText, Loader } from 'lucide-react'; // Added Loader icon
import { useNavigate, useLocation } from 'react-router-dom';
import TemplateGrid, { getAllTemplates, deleteTemplate, importTemplate } from './Designs/SavedTemplates';

// isActive: boolean to control visibility
// onClose: function to call when close button is clicked
// onApplyTemplate: function to apply selected template to canvas
const DesignSidebar = ({ isActive, onClose, onApplyTemplate }) => {
  const [templates, setTemplates] = useState([]);
  const [activeTab, setActiveTab] = useState('templates'); // 'templates' or 'create'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Load templates on mount and when the sidebar becomes active
  useEffect(() => {
    if (isActive) {
      loadTemplates();
    }
  }, [isActive]);

  const loadTemplates = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const allTemplates = await getAllTemplates();
      setTemplates(allTemplates);
    } catch (err) {
      console.error('Error loading templates:', err);
      setError('Failed to load templates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTemplate = (template) => {
    if (onApplyTemplate) {
      onApplyTemplate(template.elements, template);
    }
    
    try {
      // Update URL with template ID if navigation is available
      if (navigate && location) {
        const currentParams = new URLSearchParams(location.search);
        currentParams.set('template', template.id);
        navigate(`${location.pathname}?${currentParams.toString()}`);
      }
    } catch (error) {
      console.error("Error updating URL:", error);
      // Continue with applying the template even if URL update fails
    }
    
    onClose(); // Close sidebar after selection
  };

  const handleDeleteTemplate = async (templateId) => {
    setLoading(true);
    setError(null);
    
    try {
      await deleteTemplate(templateId);
      await loadTemplates(); // Refresh templates
      return true; // Return success
    } catch (err) {
      console.error('Error deleting template:', err);
      setError('Failed to delete template. Please try again.');
      throw err; // Propagate error to caller
    } finally {
      setLoading(false);
    }
  };
  
  const handleImportTemplate = async (jsonData) => {
    setLoading(true);
    try {
      const newTemplate = await importTemplate(jsonData);
      await loadTemplates(); // Refresh templates
      alert(`Template "${newTemplate.name}" imported successfully!`);
    } catch (err) {
      console.error('Error importing template:', err);
      alert(`Failed to import template: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Fixed position for mobile overlay, static for large screens to sit next to main sidebar
    // Higher z-index (z-50) than main sidebar (z-40) for mobile overlay effect
    // Transition for sliding effect
    // Conditional transform based on isActive
    <aside
      className={`
        fixed inset-y-0 left-0 z-50
        h-screen w-64 bg-white shadow-lg border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isActive ? 'translate-x-0' : '-translate-x-full'}
        lg:static lg:inset-auto lg:z-auto lg:h-auto // On large screens, part of flex layout
        lg:translate-x-0 // Override transform on large screens
        ${isActive ? 'lg:block' : 'lg:hidden'} // Control visibility on large screens with display
        flex-shrink-0 // Prevent shrinking in flex layout
      `}
      aria-label="Designs Sidebar"
    >
      <div className="flex h-full flex-col overflow-y-auto">
        {/* Header with Title and Close Button */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-700">Designs</h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            aria-label="Close Designs panel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('templates')}
              className={`py-3 px-4 text-sm font-medium flex-1 text-center border-b-2 ${
                activeTab === 'templates'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="inline-block h-4 w-4 mr-1" />
              Saved Templates
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`py-3 px-4 text-sm font-medium flex-1 text-center border-b-2 ${
                activeTab === 'create'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Plus className="inline-block h-4 w-4 mr-1" />
              Create New
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-grow overflow-y-auto">
          {activeTab === 'templates' ? (
            <>
              {error && (
                <div className="p-4 bg-red-50 text-red-700 text-sm">
                  {error}
                  <button 
                    onClick={loadTemplates} 
                    className="ml-2 underline font-medium"
                  >
                    Retry
                  </button>
                </div>
              )}
              
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <Loader className="h-6 w-6 text-indigo-500 animate-spin" />
                  <span className="ml-2 text-sm text-gray-600">Loading templates...</span>
                </div>
              ) : (
                <TemplateGrid 
                  templates={templates}
                  onSelectTemplate={handleSelectTemplate}
                  onDeleteTemplate={handleDeleteTemplate}
                  onImportTemplate={handleImportTemplate}
                />
              )}
            </>
          ) : (
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Create New Template</h3>
              <p className="text-xs text-gray-500 mb-4">
                Use the editor to design your invoice and then click "Export as Template" to save it.
              </p>
              <div className="border border-dashed border-gray-300 rounded-md p-6 text-center">
                <p className="text-sm text-gray-500">Design your invoice and save it as a template</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default DesignSidebar;