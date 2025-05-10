import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd'; // Import dnd components
import {
  X, Minus, Square, Circle, Triangle, Star, Pentagon, Image as ImageIcon
} from 'lucide-react';

// Element Data with type and default props
const lineElements = [
  { id: 'line-straight', name: 'Straight Line', icon: Minus, type: 'Line', props: { points: [0, 0, 100, 0], stroke: 'black', strokeWidth: 2 } },
  { id: 'line-dotted', name: 'Dotted Line', icon: Minus, type: 'DottedLine', props: { points: [0, 0, 100, 0], stroke: 'black', strokeWidth: 2, dash: [5, 5] } },
];
const shapeElements = [
  { id: 'shape-rect', name: 'Rectangle', icon: Square, type: 'Rect', props: { width: 80, height: 60, fill: '#cccccc' } },
  { id: 'shape-rounded-rect', name: 'Rounded Rect', icon: Square, type: 'RoundedRect', props: { width: 80, height: 60, fill: '#cccccc', cornerRadius: 10 } },
  { id: 'shape-circle', name: 'Circle', icon: Circle, type: 'Circle', props: { radius: 40, fill: '#cccccc' } },
  { id: 'shape-triangle', name: 'Triangle', icon: Triangle, type: 'Triangle', props: { sides: 3, radius: 40, fill: '#cccccc' } },
  { id: 'shape-star', name: 'Star', icon: Star, type: 'Star', props: { numPoints: 5, innerRadius: 20, outerRadius: 40, fill: '#cccccc' } },
  { id: 'shape-pentagon', name: 'Pentagon', icon: Pentagon, type: 'Pentagon', props: { sides: 5, radius: 40, fill: '#cccccc' } },
];

// Helper function to render the button content inside Draggable
const renderElementButtonContent = (element) => (
    <>
      <element.icon className="h-8 w-8 mb-1 text-gray-600" strokeWidth={1.5} />
      <span className="text-xs text-gray-700 leading-tight">{element.name}</span>
    </>
);


const ElementSidebar = ({ isActive, onClose }) => {

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
      aria-label="Elements Sidebar"
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-700">Elements</h2>
          <button onClick={onClose} className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500" aria-label="Close Elements panel">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-grow p-4 overflow-y-auto">

          {/* Lines Category */}
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">Lines</h3>
            {/* Ensure Droppable uses the function-as-child pattern */}
            <Droppable droppableId="sidebar-lines" isDropDisabled={true}>
              {(provided, snapshot) => ( // This function is the REQUIRED child
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="grid grid-cols-2 gap-3"
                >
                  {lineElements.map((element, index) => (
                    <Draggable key={element.id} draggableId={element.id} index={index}>
                      {(providedDraggable, snapshotDraggable) => ( // Draggable also uses function-as-child
                        <button // Render a button or div as the draggable item
                          ref={providedDraggable.innerRef}
                          {...providedDraggable.draggableProps}
                          {...providedDraggable.dragHandleProps}
                          type="button"
                          className={`
                            flex flex-col items-center justify-center p-2 border rounded-md text-center
                            transition duration-150 ease-in-out
                            ${snapshotDraggable.isDragging ? 'bg-blue-100 border-blue-300 shadow-lg' : 'bg-white border-gray-200 hover:bg-gray-100'}
                            focus:outline-none focus:ring-2 focus:ring-indigo-300
                          `}
                          title={element.name}
                        >
                         {renderElementButtonContent(element)}
                        </button>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder} {/* Placeholder for Droppable */}
                </div>
              )}
            </Droppable>
          </div>

          {/* Shapes Category */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">Shapes</h3>
            {/* Ensure Droppable uses the function-as-child pattern */}
            <Droppable droppableId="sidebar-shapes" isDropDisabled={true}>
             {(provided, snapshot) => ( // This function is the REQUIRED child
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="grid grid-cols-2 gap-3"
                >
                  {shapeElements.map((element, index) => (
                    <Draggable key={element.id} draggableId={element.id} index={index}>
                     {(providedDraggable, snapshotDraggable) => ( // Draggable also uses function-as-child
                        <button // Render a button or div as the draggable item
                          ref={providedDraggable.innerRef}
                          {...providedDraggable.draggableProps}
                          {...providedDraggable.dragHandleProps}
                           type="button"
                           className={`
                             flex flex-col items-center justify-center p-2 border rounded-md text-center
                             transition duration-150 ease-in-out
                             ${snapshotDraggable.isDragging ? 'bg-blue-100 border-blue-300 shadow-lg' : 'bg-white border-gray-200 hover:bg-gray-100'}
                             focus:outline-none focus:ring-2 focus:ring-indigo-300
                           `}
                           title={element.name}
                        >
                           {renderElementButtonContent(element)}
                         </button>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder} {/* Placeholder for Droppable */}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </div>
    </aside>
  );
};

// Export the combined elements data
export const AllElements = [...lineElements, ...shapeElements];
export default ElementSidebar;