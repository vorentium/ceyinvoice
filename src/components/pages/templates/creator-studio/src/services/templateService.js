import  {supabase}  from '../../../../../../utils/supabaseClient';

/**
 * Save a template to the database
 * @param {Object} templateData - The template data to save
 * @returns {Promise<Object>} - The saved template
 */
export const saveTemplateToDatabase = async (templateData) => {
  try {
    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData?.user) {
      throw new Error('Authentication required');
    }
    
    const userId = userData.user.id;
    
    // Prepare template data
    const template = {
      user_id: userId,
      name: templateData.name || 'Untitled Template',
      description: templateData.description || '',
      thumbnail: templateData.thumbnail || null,
      elements: templateData.elements || [],
    };
    
    // Insert into database
    const { data, error } = await supabase
      .from('templates')
      .insert(template)
      .select()
      .single();
    
    if (error) {
      console.error('Error saving template:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in saveTemplateToDatabase:', error);
    throw error;
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
    
    // Fetch templates for this user
    const { data, error } = await supabase
      .from('templates')
      .select('*')
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
 * Delete a template from the database
 * @param {string} templateId - The ID of the template to delete
 * @returns {Promise<void>}
 */
export const deleteTemplateFromDatabase = async (templateId) => {
  try {
    const { error } = await supabase
      .from('templates')
      .delete()
      .match({ id: templateId });
    
    if (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteTemplateFromDatabase:', error);
    throw error;
  }
};

/**
 * Import a template from JSON data
 * @param {string} jsonData - JSON string of template data
 * @returns {Promise<Object>} - The imported template
 */
export const importTemplateFromJson = async (jsonData) => {
  try {
    const templateData = JSON.parse(jsonData);
    
    // Validate the imported data
    if (!templateData.name || !Array.isArray(templateData.elements)) {
      throw new Error('Invalid template format');
    }
    
    // Save to database
    return await saveTemplateToDatabase(templateData);
  } catch (error) {
    console.error('Error importing template:', error);
    throw error;
  }
};

/**
 * Convert a template to JSON and trigger download
 * @param {Object} template - The template to download
 */
export const downloadTemplateAsJson = (template) => {
  try {
    // Create template export object (without the thumbnail to save space)
    const exportTemplate = {
      name: template.name,
      description: template.description,
      elements: template.elements,
      exportedAt: new Date().toISOString()
    };
    
    // Convert to JSON string
    const jsonString = JSON.stringify(exportTemplate, null, 2);
    
    // Create download link
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `template-${template.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading template:', error);
    throw error;
  }
};

/**
 * Update an existing template in the database
 * @param {string} templateId - The ID of the template to update
 * @param {Object} templateData - The updated template data
 * @returns {Promise<Object>} - The updated template
 */
export const updateTemplateInDatabase = async (templateId, templateData) => {
  try {
    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData?.user) {
      throw new Error('Authentication required');
    }
    
    // Prepare template data for update
    const updatedTemplate = {
      name: templateData.name || 'Untitled Template',
      description: templateData.description || '',
      thumbnail: templateData.thumbnail || null,
      elements: templateData.elements || [],
      updated_at: new Date().toISOString()
    };
    
    // Update in database
    const { data, error } = await supabase
      .from('templates')
      .update(updatedTemplate)
      .match({ id: templateId })
      .select()
      .single();
    
    if (error) {
      console.error('Error updating template:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateTemplateInDatabase:', error);
    throw error;
  }
}; 