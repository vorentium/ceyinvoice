import React from 'react';
import { X, Type, Heading1, Heading2, FileText } from 'lucide-react';
import { Droppable, Draggable } from '@hello-pangea/dnd';

// --- Text Style Data ---
const textStyles = [
  { 
    id: 'text-heading', 
    name: 'Heading',
    label: 'Add a Heading', 
    styleClass: 'text-xl font-bold',
    icon: Heading1,
    defaultText: 'Heading Text',
    props: { 
      fontSize: 24, 
      fontFamily: 'Arial',
      fontStyle: 'bold',
      fill: '#000000',
      width: 200
    }
  },
  { 
    id: 'text-subheading', 
    name: 'Subheading',
    label: 'Add a Subheading', 
    styleClass: 'text-lg font-semibold',
    icon: Heading2,
    defaultText: 'Subheading Text',
    props: { 
      fontSize: 18, 
      fontFamily: 'Arial',
      fontStyle: 'normal',
      fill: '#333333',
      width: 180
    }
  },
  { 
    id: 'text-body', 
    name: 'Body Text',
    label: 'Add body text', 
    styleClass: 'text-sm font-normal',
    icon: FileText,
    defaultText: 'Body content goes here...',
    props: { 
      fontSize: 14, 
      fontFamily: 'Arial',
      fontStyle: 'normal',
      fill: '#555555',
      width: 160
    }
  },
];

// Export text styles for use in other components
export const AllTextStyles = textStyles;

const TextSidebar = ({ isActive, onClose }) => {
  // Helper function to render the button content inside Draggable
  const renderTextStyleButtonContent = (style) => (
    <>
      <style.icon className="h-6 w-6 mb-1 text-gray-600" strokeWidth={1.5} />
      <span className={`text-sm leading-tight ${style.styleClass}`}>
        {style.name}
      </span>
    </>
  );

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50
        h-screen w-64 bg-white shadow-lg border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isActive ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:inset-auto lg:z-auto lg:h-auto
        lg:transform-none
        lg:transition-none
        ${isActive ? 'lg:block' : 'lg:hidden'}
        flex-shrink-0
      `}
      aria-label="Text Sidebar"
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-700">Text</h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            aria-label="Close Text panel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-grow p-4 overflow-y-auto">
          {/* Text Styles Category */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Text Styles
            </h3>
            
            <Droppable droppableId="sidebar-text-styles" isDropDisabled={true}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="grid grid-cols-2 gap-3"
                >
                  {textStyles.map((style, index) => (
                    <Draggable key={style.id} draggableId={style.id} index={index}>
                      {(providedDraggable, snapshotDraggable) => (
                        <div
                          ref={providedDraggable.innerRef}
                          {...providedDraggable.draggableProps}
                          {...providedDraggable.dragHandleProps}
                          className={`
                            flex flex-col items-center justify-center p-3 border rounded-md text-center
                            transition duration-150 ease-in-out
                            ${snapshotDraggable.isDragging ? 'bg-blue-100 border-blue-300 shadow-lg' : 'bg-white border-gray-200 hover:bg-gray-100'}
                            focus:outline-none focus:ring-2 focus:ring-indigo-300
                            cursor-grab
                          `}
                          title={style.label}
                        >
                          {renderTextStyleButtonContent(style)}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Custom Text Options can be added here later */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Instructions
            </h3>
            <p className="text-xs text-gray-500 mb-2">
              Drag text styles onto the canvas to add text elements to your invoice.
            </p>
            <p className="text-xs text-gray-500">
              Double-click on text in the canvas to edit it.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default TextSidebar;