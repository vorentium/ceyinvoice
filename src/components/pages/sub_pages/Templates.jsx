import React, { useState, useEffect } from 'react';
import { FileUp, Loader, Edit, Trash2, Plus, X } from 'lucide-react';
import { getUserTemplates, deleteTemplate } from '../../../utils/supabaseClient';

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch templates from templateService
        const templatesData = await getUserTemplates();
        setTemplates(templatesData);
      } catch (err) {
        console.error('Error fetching templates:', err);
        setError('Failed to load templates. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleEditTemplate = (template) => {
    // Navigate to creator studio with the template ID as a URL parameter
    window.open(`/creator-studio?template=${template.id}`, '_blank');
  };

  const handleDeleteClick = (template) => {
    setTemplateToDelete(template);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!templateToDelete) return;
    
    try {
      setDeleteLoading(true);
      await deleteTemplate(templateToDelete.id);
      // Remove template from the local state
      setTemplates(templates.filter(t => t.id !== templateToDelete.id));
      setShowDeleteModal(false);
      setTemplateToDelete(null);
    } catch (err) {
      console.error('Error deleting template:', err);
      alert('Failed to delete template. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setTemplateToDelete(null);
  };

  // Delete Confirmation Modal
  const DeleteModal = () => {
    if (!showDeleteModal) return null;

    return (
      <div className="fixed inset-0 bg-black-transparent flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-poppins-bold text-gray-900">Confirm Delete</h3>
            <button 
              onClick={handleCancelDelete}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete the template "{templateToDelete?.name}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleCancelDelete}
              className="cursor-pointer px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={deleteLoading}
              className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
            >
              {deleteLoading ? (
                <>
                  <Loader size={16} className="animate-spin mr-2" />
                  Deleting...
                </>
              ) : "Delete Template"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader className="h-8 w-8 text-indigo-500 animate-spin" />
        <span className="ml-3 text-lg text-gray-600">Loading templates...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-lg">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-100 rounded-lg p-8 max-w-md mx-auto">
          <h3 className="text-xl font-poppins-bold text-gray-800 mb-2">No Templates Found</h3>
          <p className="text-gray-600 mb-6">You haven't created any templates yet.</p>
          <a 
            href="/creator-studio" 
            target="_blank"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-black text-white rounded-md hover:bg[--color-black-900]"
          >
            <Plus size={18} />
            CREATE NEW TEMPLATE
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-poppins-bold text-gray-900">Your Templates</h2>
          <p className="text-gray-600">Reuse your custom invoice templates to save time</p>
        </div>
        <a 
          href="/creator-studio" 
          target="_blank"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-black text-white rounded-md hover:bg-neutral-800 transition-all duration-300"
        >
          <Plus size={18} />
          CREATE NEW TEMPLATE
        </a>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Template
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created Date
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {templates.map((template) => (
              <tr key={template.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-12 w-16 flex-shrink-0 mr-4 bg-gray-100 rounded overflow-hidden">
                      {template.thumbnail ? (
                        <img 
                          src={template.thumbnail} 
                          alt={template.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-gray-400 text-xs">No Preview</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{template.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 max-w-xs truncate">
                    {template.description || 'No description'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(template.created_at || template.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex justify-end space-x-3">
                    <button
                      className="text-blue-500 hover:text-blue-700 cursor-pointer"
                      title="Edit template"
                      onClick={() => handleEditTemplate(template)}
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                      title="Delete template"
                      onClick={() => handleDeleteClick(template)}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Render the delete confirmation modal */}
      <DeleteModal />
    </div>
  );
};

export default Templates; 