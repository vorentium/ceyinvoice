import React, { forwardRef, useEffect, useRef, useImperativeHandle } from 'react';
import { Stage, Layer, Rect, Line, Circle, Star, RegularPolygon, Transformer, Text } from 'react-konva';

// A4 Dimensions in pixels at 96 DPI (common screen DPI)
// Width = 210mm / 25.4 mm/inch * 96 DPI = 793.7 pixels
// Height = 297mm / 25.4 mm/inch * 96 DPI = 1122.5 pixels
const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

// Component to render the appropriate element based on type
const ElementRenderer = ({ 
  element, 
  isSelected, 
  onSelect, 
  onChange,
  snapToGrid,
  gridSize 
}) => {
  const { type, props } = element;
  const shapeRef = useRef();
  const trRef = useRef();
  
  // Handle selection by click
  const handleSelect = () => {
    onSelect(element.id);
  };
  
  // Handle changes during drag or transform
  const handleDragEnd = (e) => {
    let newX = e.target.x();
    let newY = e.target.y();
    
    // Apply snap to grid if enabled
    if (snapToGrid) {
      newX = Math.round(newX / gridSize) * gridSize;
      newY = Math.round(newY / gridSize) * gridSize;
      
      // Update position to the snapped position
      e.target.position({ x: newX, y: newY });
    }
    
    onChange({
      ...element,
      props: {
        ...element.props,
        x: newX,
        y: newY
      }
    });
  };
  
  // Handle text editing
  const handleTextEdit = (e) => {
    // This would be implemented for double-click to edit text
    // For now, just log as placeholder
    console.log('Text edit started:', element.id);
  };
  
  // Handle transform (resize, rotate)
  const handleTransformEnd = (e) => {
    // Get transformer reference
    const transformer = trRef.current;
    if (!transformer || !shapeRef.current) return;
    
    // Get shape node
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const rotation = node.rotation();
    
    // Reset scale to prevent accumulation
    node.scaleX(1);
    node.scaleY(1);
    
    let newProps = { ...element.props };
    
    // Different properties need to be updated based on element type
    if (type === 'Rect' || type === 'RoundedRect') {
      newProps = {
        ...newProps,
        x: node.x(),
        y: node.y(),
        width: Math.max(5, node.width() * scaleX),
        height: Math.max(5, node.height() * scaleY),
        rotation
      };
    } else if (type === 'Circle') {
      newProps = {
        ...newProps,
        x: node.x(),
        y: node.y(),
        radius: Math.max(5, node.radius() * scaleX),
        rotation
      };
    } else if (type === 'Triangle' || type === 'Pentagon') {
      newProps = {
        ...newProps,
        x: node.x(),
        y: node.y(),
        radius: Math.max(5, (element.props.radius || 40) * scaleX),
        rotation
      };
    } else if (type === 'Star') {
      newProps = {
        ...newProps,
        x: node.x(),
        y: node.y(),
        innerRadius: Math.max(5, (element.props.innerRadius || 20) * scaleX),
        outerRadius: Math.max(10, (element.props.outerRadius || 40) * scaleX),
        rotation
      };
    } else if (type === 'Line' || type === 'DottedLine') {
      // For lines, scale the points
      const oldPoints = [...element.props.points];
      const newPoints = [];
      for (let i = 0; i < oldPoints.length; i += 2) {
        newPoints.push(oldPoints[i] * scaleX);
        newPoints.push(oldPoints[i + 1] * scaleY);
      }
      
      newProps = {
        ...newProps,
        x: node.x(),
        y: node.y(),
        points: newPoints,
        rotation
      };
    } else if (type === 'Text' || type.startsWith('text-')) {
      // For text elements, update width and height
      newProps = {
        ...newProps,
        x: node.x(),
        y: node.y(),
        fontSize: Math.max(8, (element.props.fontSize || 14) * scaleX),
        width: Math.max(20, (element.props.width || 100) * scaleX),
        rotation
      };
    }
    
    // Apply snap to grid if enabled
    if (snapToGrid) {
      newProps.x = Math.round(newProps.x / gridSize) * gridSize;
      newProps.y = Math.round(newProps.y / gridSize) * gridSize;
      
      // Update position to the snapped position
      node.position({ x: newProps.x, y: newProps.y });
    }
    
    onChange({
      ...element,
      props: newProps
    });
  };
  
  // Set up transformer when element is selected
  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);
  
  // Common props for all shape elements
  const commonProps = {
    onClick: handleSelect,
    onTap: handleSelect,
    onDragEnd: handleDragEnd,
    draggable: true,
    ref: shapeRef
  };
  
  // Determine if the element is a text element
  const isTextElement = type === 'Text' || type.startsWith('text-');
  
  // Render the appropriate element based on type
  let renderedElement;
  switch (type) {
    case 'Line':
      renderedElement = <Line {...props} {...commonProps} />;
      break;
    case 'DottedLine':
      renderedElement = <Line {...props} {...commonProps} />;
      break;
    case 'Rect':
      renderedElement = <Rect {...props} {...commonProps} />;
      break;
    case 'RoundedRect':
      renderedElement = <Rect {...props} cornerRadius={10} {...commonProps} />;
      break;
    case 'Circle':
      renderedElement = <Circle {...props} {...commonProps} />;
      break;
    case 'Triangle':
      renderedElement = <RegularPolygon {...props} sides={3} {...commonProps} />;
      break;
    case 'Star':
      renderedElement = <Star {...props} {...commonProps} />;
      break;
    case 'Pentagon':
      renderedElement = <RegularPolygon {...props} sides={5} {...commonProps} />;
      break;
    case 'text-heading':
    case 'text-subheading':
    case 'text-body':
    case 'Text':
      renderedElement = (
        <Text 
          {...props} 
          {...commonProps}
          onDblClick={handleTextEdit}
          onDblTap={handleTextEdit}
          // Make sure to set ellipsis for text overflow and wrap for word wrapping
          ellipsis={true}
          wrap="word"
        />
      );
      break;
    default:
      return null;
  }
  
  return (
    <>
      {renderedElement}
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit minimum size
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
          onTransformEnd={handleTransformEnd}
          rotateEnabled={true}
          // Keep ratio for circle, triangle, star, pentagon - not for text
          keepRatio={!isTextElement && (type === 'Circle' || type === 'Triangle' || type === 'Star' || type === 'Pentagon')}
          // Only use corner anchors for regular shapes, add more for text
          enabledAnchors={
            isTextElement 
              ? ['top-left', 'top-center', 'top-right', 'middle-right', 'middle-left', 'bottom-left', 'bottom-center', 'bottom-right']
              : ['top-left', 'top-right', 'bottom-left', 'bottom-right']
          }
        />
      )}
    </>
  );
};

const A4Canvas = forwardRef(({ 
  scale, 
  canvasElements = [], 
  selectedElement,
  onSelectElement,
  onUpdateElement,
  snapToGrid = false,
  gridSize = 10,
  canvasHeight = A4_HEIGHT, // Default to standard A4 height if not provided
  onStageClick // Receive stage click handler from props
}, ref) => {
  const stageRefInternal = useRef(); // Internal ref for the actual Konva Stage

  // Expose a method to the parent component (InvoiceView)
  useImperativeHandle(ref, () => ({
    getImageDataURL: (config) => {
      if (!stageRefInternal.current) {
        console.error("Internal stage ref not available in A4Canvas");
        return null;
      }
      console.log("A4Canvas: Generating image data URL with config:", config);
      return stageRefInternal.current.toDataURL(config);
    },
    // Expose stage dimensions if needed by parent
    getStageWidth: () => stageRefInternal.current?.width() || A4_WIDTH,
    getStageHeight: () => stageRefInternal.current?.height() || A4_HEIGHT, // Use A4_HEIGHT as default
  }));

  // Handle clicks on the stage (e.g., to deselect elements)
  const handleStageClick = (e) => {
    // Pass the click event up to the parent if handler is provided
    if (onStageClick) {
      onStageClick(e);
    }
  };
  
  return (
    <div
      id="canvas-container"
      className="shadow-lg" // Add shadow to the container for visual separation
      style={{
        width: `${A4_WIDTH * scale}px`, // Container width adjusts with zoom
        height: `${canvasHeight * scale}px`, // Container height adjusts with zoom and custom height
        backgroundColor: 'transparent',
      }}
    >
      <Stage
        ref={stageRefInternal} // Use the internal ref here
        width={A4_WIDTH}   // Use fixed A4 width
        height={canvasHeight} // Use dynamic height received from props
        scaleX={scale}
        scaleY={scale}
        onMouseDown={handleStageClick} // Use the internal handler
        onTouchStart={handleStageClick} // Use the internal handler
        className="shadow-lg bg-white" // Ensure background is white for capture
      >
        <Layer>
          {/* White Background Rect simulating A4 Paper */}
          <Rect
            x={0}
            y={0}
            width={A4_WIDTH}
            height={canvasHeight}
            fill="white"
            shadowBlur={5} // Optional shadow on the paper itself
            shadowOffsetX={2}
            shadowOffsetY={2}
            shadowOpacity={0.3}
          />
          
          {/* Optional Grid for snap */}
          {snapToGrid && (
            <>
              {/* Vertical lines */}
              {Array.from({ length: Math.floor(A4_WIDTH / gridSize) }).map((_, i) => (
                <Line
                  key={`vgrid-${i}`}
                  points={[i * gridSize, 0, i * gridSize, canvasHeight]}
                  stroke="#ddd"
                  strokeWidth={0.5}
                />
              ))}
              
              {/* Horizontal lines */}
              {Array.from({ length: Math.floor(canvasHeight / gridSize) }).map((_, i) => (
                <Line
                  key={`hgrid-${i}`}
                  points={[0, i * gridSize, A4_WIDTH, i * gridSize]}
                  stroke="#ddd"
                  strokeWidth={0.5}
                />
              ))}
            </>
          )}
          
          {/* Render all canvas elements */}
          {canvasElements.map((element) => (
            <ElementRenderer 
              key={element.id} 
              element={element}
              isSelected={selectedElement === element.id}
              onSelect={onSelectElement}
              onChange={onUpdateElement}
              snapToGrid={snapToGrid}
              gridSize={gridSize}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
});

// Add display name for debugging purposes
A4Canvas.displayName = 'A4Canvas';

export { A4_WIDTH, A4_HEIGHT }; // Export dimensions if needed elsewhere
export default A4Canvas;