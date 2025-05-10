import React, { useState, useEffect } from 'react';
import { X, Trash2, Grid } from 'lucide-react';

const PropertiesSidebar = ({ 
  isActive, 
  onClose, 
  selectedElement, 
  onUpdateElement,
  onDeleteElement,
  snapToGrid,
  setSnapToGrid,
  gridSize,
  setGridSize 
}) => {
  // Local state for the form values
  const [formValues, setFormValues] = useState({});
  
  // Reset form values when selected element changes
  useEffect(() => {
    if (selectedElement) {
      setFormValues({
        ...selectedElement.props,
        type: selectedElement.type
      });
    } else {
      setFormValues({});
    }
  }, [selectedElement]);
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Convert numerical values
    let parsedValue = value;
    if (type === 'number') {
      parsedValue = parseFloat(value);
    } else if (type === 'checkbox') {
      parsedValue = checked;
    }
    
    setFormValues({
      ...formValues,
      [name]: parsedValue
    });
  };
  
  // Apply changes to the element
  const handleApplyChanges = () => {
    if (!selectedElement) return;
    
    // Create updated element with new props
    const updatedElement = {
      ...selectedElement,
      props: { ...formValues }
    };
    
    // Remove type from props (it was added for the form)
    delete updatedElement.props.type;
    
    // Update the element
    onUpdateElement(updatedElement);
  };
  
  // Save changes when form values change (debounced)
  useEffect(() => {
    if (!selectedElement || Object.keys(formValues).length === 0) return;
    
    const timer = setTimeout(() => {
      handleApplyChanges();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [formValues]); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Is the element a text element?
  const isTextElement = selectedElement?.type?.startsWith('text-') || selectedElement?.type === 'Text';
  
  // Determine what properties to show based on element type
  const renderProperties = () => {
    if (!selectedElement) return null;
    
    const { type } = selectedElement;
    const common = (
      <>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Position X</label>
          <input
            type="number"
            name="x"
            value={formValues.x || 0}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Position Y</label>
          <input
            type="number"
            name="y"
            value={formValues.y || 0}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Rotation</label>
          <input
            type="number"
            name="rotation"
            value={formValues.rotation || 0}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Fill Color</label>
          <div className="flex space-x-2">
            <input
              type="color"
              name="fill"
              value={formValues.fill || '#cccccc'}
              onChange={handleInputChange}
              className="h-10 w-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              name="fill"
              value={formValues.fill || '#cccccc'}
              onChange={handleInputChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </>
    );
    
    // Text specific properties
    if (isTextElement) {
      return (
        <>
          {common}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Text Content</label>
            <textarea
              name="text"
              value={formValues.text || ''}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
            <input
              type="number"
              name="fontSize"
              value={formValues.fontSize || 14}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
            <select
              name="fontFamily"
              value={formValues.fontFamily || 'Arial'}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Verdana">Verdana</option>
              <option value="Georgia">Georgia</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Font Style</label>
            <select
              name="fontStyle"
              value={formValues.fontStyle || 'normal'}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
              <option value="italic">Italic</option>
              <option value="bold italic">Bold Italic</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
            <input
              type="number"
              name="width"
              value={formValues.width || 200}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Text Align</label>
            <select
              name="align"
              value={formValues.align || 'left'}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </>
      );
    }
    // Specific properties based on element type
    else if (type === 'Rect' || type === 'RoundedRect') {
      return (
        <>
          {common}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
            <input
              type="number"
              name="width"
              value={formValues.width || 0}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
            <input
              type="number"
              name="height"
              value={formValues.height || 0}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          {type === 'RoundedRect' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Corner Radius</label>
              <input
                type="number"
                name="cornerRadius"
                value={formValues.cornerRadius || 0}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          )}
        </>
      );
    } 
    else if (type === 'Circle' || type === 'Triangle' || type === 'Pentagon') {
      return (
        <>
          {common}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Radius</label>
            <input
              type="number"
              name="radius"
              value={formValues.radius || 0}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </>
      );
    } 
    else if (type === 'Star') {
      return (
        <>
          {common}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Inner Radius</label>
            <input
              type="number"
              name="innerRadius"
              value={formValues.innerRadius || 0}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Outer Radius</label>
            <input
              type="number"
              name="outerRadius"
              value={formValues.outerRadius || 0}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
            <input
              type="number"
              name="numPoints"
              value={formValues.numPoints || 5}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </>
      );
    } 
    else if (type === 'Line' || type === 'DottedLine') {
      return (
        <>
          {common}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Stroke Width</label>
            <input
              type="number"
              name="strokeWidth"
              value={formValues.strokeWidth || 1}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Stroke Color</label>
            <div className="flex space-x-2">
              <input
                type="color"
                name="stroke"
                value={formValues.stroke || '#000000'}
                onChange={handleInputChange}
                className="h-10 w-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                name="stroke"
                value={formValues.stroke || '#000000'}
                onChange={handleInputChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          
          {type === 'DottedLine' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Dash Pattern</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  name="dash-0"
                  value={(formValues.dash && formValues.dash[0]) || 5}
                  onChange={(e) => {
                    const dash = [...(formValues.dash || [5, 5])];
                    dash[0] = parseFloat(e.target.value);
                    setFormValues({
                      ...formValues,
                      dash
                    });
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <input
                  type="number"
                  name="dash-1"
                  value={(formValues.dash && formValues.dash[1]) || 5}
                  onChange={(e) => {
                    const dash = [...(formValues.dash || [5, 5])];
                    dash[1] = parseFloat(e.target.value);
                    setFormValues({
                      ...formValues,
                      dash
                    });
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          )}
        </>
      );
    }
    
    return common;
  };
  
  return (
    <aside
      className={`
        fixed inset-y-0 right-0 z-50
        h-screen w-80 bg-white shadow-lg border-l border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isActive ? 'translate-x-0' : 'translate-x-full'}
        lg:relative lg:inset-auto lg:z-auto lg:h-auto
        lg:transform-none
        lg:transition-none
        ${isActive ? 'lg:block' : 'lg:hidden'}
        flex-shrink-0
      `}
      aria-label="Properties Sidebar"
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-700">
            {selectedElement 
              ? isTextElement 
                ? 'Text Properties' 
                : 'Element Properties' 
              : 'Properties'}
          </h2>
          <button onClick={onClose} className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500" aria-label="Close Properties panel">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-grow p-4 overflow-y-auto">
          {selectedElement ? (
            <>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Element Type</h3>
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {isTextElement ? selectedElement.type.replace('text-', '') : selectedElement.type}
                  </span>
                </div>
                
                {renderProperties()}
                
                <div className="mt-6">
                  <button
                    onClick={onDeleteElement}
                    className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Element
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-10 text-gray-500">
              Select an element to edit its properties
            </div>
          )}
          
          {/* Grid Settings */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">Canvas Settings</h3>
            
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <div className="mr-2">
                    <Grid className="h-5 w-5 text-gray-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Snap to Grid</span>
                </label>
                
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={snapToGrid} 
                    onChange={(e) => setSnapToGrid(e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Grid Size</label>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={gridSize}
                onChange={(e) => setGridSize(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">5px</span>
                <span className="text-xs text-gray-500">{gridSize}px</span>
                <span className="text-xs text-gray-500">50px</span>
              </div>
            </div>
            
            <div className="mt-4 text-xs text-gray-500">
              <p>Keyboard Shortcuts:</p>
              <ul className="mt-1 space-y-1">
                <li>Press <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">G</kbd> to toggle grid</li>
                <li>Press <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Delete</kbd> to remove selected element</li>
                <li>Press <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Escape</kbd> to deselect element</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default PropertiesSidebar; 