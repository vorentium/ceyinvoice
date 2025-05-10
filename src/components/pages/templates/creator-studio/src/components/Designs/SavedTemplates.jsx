import React, { useState, useEffect } from 'react';
import { Trash2, Download } from 'lucide-react';
import { 
  saveTemplateToDatabase, 
  getUserTemplates, 
  deleteTemplateFromDatabase, 
  importTemplateFromJson,
  downloadTemplateAsJson,
  updateTemplateInDatabase
} from '../../services/templateService';
import ConfirmDialog from '../ui/ConfirmDialog';

// Function to save a new template
export const saveTemplate = async (templateData) => {
  try {
    // Save to database
    return await saveTemplateToDatabase(templateData);
  } catch (error) {
    console.error('Error saving template:', error);
    
    // Fallback to localStorage if database operation fails
  const newTemplate = {
    id: `template-${Date.now()}`,
      name: templateData.name || `Template ${Date.now()}`,
    description: templateData.description || '',
    thumbnail: templateData.thumbnail || null,
    elements: templateData.elements || [],
    createdAt: new Date().toISOString(),
  };

    // Get current templates from localStorage
    let savedTemplates = [];
    try {
      const storedTemplates = localStorage.getItem('invoiceTemplates');
      if (storedTemplates) {
        savedTemplates = JSON.parse(storedTemplates);
      }
    } catch (err) {
      console.error('Error reading from localStorage:', err);
    }
    
    // Add new template and save back to localStorage
  savedTemplates = [newTemplate, ...savedTemplates];
    localStorage.setItem('invoiceTemplates', JSON.stringify(savedTemplates));
  
  return newTemplate;
  }
};

// Function to get all saved templates
export const getAllTemplates = async () => {
  try {
    // Get templates from database
    return await getUserTemplates();
  } catch (error) {
    console.error('Error fetching templates from database:', error);
    
    // Fallback to localStorage
    try {
      const storedTemplates = localStorage.getItem('invoiceTemplates');
      return storedTemplates ? JSON.parse(storedTemplates) : [];
    } catch (err) {
      console.error('Error reading from localStorage:', err);
      return [];
    }
  }
};

// Function to get a template by ID
export const getTemplateById = async (templateId) => {
  try {
    // Try to get from database
    const templates = await getUserTemplates();
    return templates.find(template => template.id === templateId);
  } catch (error) {
    console.error('Error fetching template from database:', error);
    
    // Fallback to localStorage
    try {
      const storedTemplates = localStorage.getItem('invoiceTemplates');
      if (storedTemplates) {
        const templates = JSON.parse(storedTemplates);
        return templates.find(template => template.id === templateId);
      }
      return null;
    } catch (err) {
      console.error('Error reading from localStorage:', err);
      return null;
    }
  }
};

// Function to delete a template
export const deleteTemplate = async (templateId) => {
  try {
    // Delete from database
    await deleteTemplateFromDatabase(templateId);
  } catch (error) {
    console.error('Error deleting template from database:', error);
    
    // Fallback to localStorage
    try {
      const storedTemplates = localStorage.getItem('invoiceTemplates');
      if (storedTemplates) {
        const templates = JSON.parse(storedTemplates).filter(template => template.id !== templateId);
        localStorage.setItem('invoiceTemplates', JSON.stringify(templates));
      }
    } catch (err) {
      console.error('Error updating templates in localStorage:', err);
    }
  }
};

// Function to import a template from JSON file
export const importTemplate = async (jsonData) => {
  try {
    // Import to database
    return await importTemplateFromJson(jsonData);
  } catch (error) {
    console.error('Error importing template to database:', error);
    
    // Fallback to localStorage
  try {
    const templateData = JSON.parse(jsonData);
    
    // Validate the imported data
    if (!templateData.name || !Array.isArray(templateData.elements)) {
      throw new Error('Invalid template format');
    }
    
    // Add to templates with a new ID and timestamp
    const newTemplate = {
      ...templateData,
      id: `template-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
      // Get current templates from localStorage
      let savedTemplates = [];
      const storedTemplates = localStorage.getItem('invoiceTemplates');
      if (storedTemplates) {
        savedTemplates = JSON.parse(storedTemplates);
      }
      
      // Add new template and save back to localStorage
    savedTemplates = [newTemplate, ...savedTemplates];
    localStorage.setItem('invoiceTemplates', JSON.stringify(savedTemplates));
    
    return newTemplate;
    } catch (err) {
      console.error('Error importing to localStorage:', err);
      throw err;
    }
  }
};

// Function to update an existing template
export const updateTemplate = async (templateId, templateData) => {
  try {
    // Update in database
    return await updateTemplateInDatabase(templateId, templateData);
  } catch (error) {
    console.error('Error updating template:', error);
    
    // Fallback to localStorage if database operation fails
    try {
      const storedTemplates = localStorage.getItem('invoiceTemplates');
      if (storedTemplates) {
        let templates = JSON.parse(storedTemplates);
        const templateIndex = templates.findIndex(t => t.id === templateId);
        
        if (templateIndex !== -1) {
          // Update the template at found index
          templates[templateIndex] = {
            ...templates[templateIndex],
            name: templateData.name || templates[templateIndex].name,
            description: templateData.description || templates[templateIndex].description,
            thumbnail: templateData.thumbnail || templates[templateIndex].thumbnail,
            elements: templateData.elements || templates[templateIndex].elements,
            updatedAt: new Date().toISOString()
          };
          
          // Save back to localStorage
          localStorage.setItem('invoiceTemplates', JSON.stringify(templates));
          return templates[templateIndex];
        }
      }
    } catch (err) {
      console.error('Error updating template in localStorage:', err);
    }
    
    throw error;
  }
};

// Template Preview Component
const TemplatePreview = ({ template, onSelect, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Function to download template as JSON
  const handleDownload = (e) => {
    e.stopPropagation(); // Prevent template selection when clicking download
    
    try {
      downloadTemplateAsJson(template);
    } catch (error) {
      console.error('Error downloading template:', error);
      alert('Failed to download template');
    }
  };

  // Function to handle delete with confirmation
  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent template selection when clicking delete
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(template.id);
    } catch (error) {
      console.error('Error deleting template:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className={`relative group border border-gray-200 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* Template Thumbnail or Preview */}
      <div 
        className="w-full h-32 bg-white cursor-pointer"
        onClick={() => onSelect(template)}
      >
        {template.thumbnail ? (
          <img
            src={template.thumbnail}
            alt={template.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            <span>No Preview</span>
          </div>
        )}
      </div>
      
      {/* Template Info */}
      <div className="p-3 bg-white">
        <h3 className="text-sm font-medium text-gray-700 truncate">{template.name}</h3>
        <p className="text-xs text-gray-500 mt-1 truncate">{template.description || 'No description'}</p>
        
        {/* Date */}
        <div className="mt-2">
          <span className="text-xs text-gray-400">
              {new Date(template.created_at || template.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        {/* Actions */}
        <div className="mt-2 flex justify-start space-x-2">
          {/* Download button */}
          <button
            onClick={handleDownload}
            className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
            title="Download template as JSON"
              disabled={isDeleting}
          >
            <Download size={16} strokeWidth={2} />
          </button>
          
          {/* Delete button */}
          <button
              onClick={handleDelete}
            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
            title="Delete template"
              disabled={isDeleting}
          >
            <Trash2 size={16} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
      
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Template"
        message={`Are you sure you want to delete "${template.name}"? This action cannot be undone.`}
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        cancelText="Cancel"
      />
    </>
  );
};

// Template Grid Component
const TemplateGrid = ({ templates, onSelectTemplate, onDeleteTemplate, onImportTemplate }) => {
  // File input ref for template upload
  const fileInputRef = React.useRef(null);
  
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        if (onImportTemplate && e.target?.result) {
          onImportTemplate(e.target.result);
        }
      } catch (error) {
        alert('Failed to import template: Invalid format');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
    
    // Clear the input so the same file can be uploaded again
    event.target.value = '';
  };

  if (!templates || templates.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No templates saved yet.</p>
        <p className="text-gray-400 text-sm mt-2">Create a design and export it as a template!</p>
        <div className="mt-4">
          <button
            onClick={handleImportClick}
            className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
          >
            Import Template
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json"
            className="hidden"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-700">Your Templates</h3>
        <button
          onClick={handleImportClick}
          className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
        >
          Import Template
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".json"
          className="hidden"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {templates.map(template => (
          <TemplatePreview
            key={template.id}
            template={template}
            onSelect={onSelectTemplate}
            onDelete={onDeleteTemplate}
          />
        ))}
      </div>
    </div>
  );
};

export default TemplateGrid;
