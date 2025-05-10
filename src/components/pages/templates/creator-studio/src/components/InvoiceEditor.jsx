import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase, getInvoiceById } from '../../../../../../utils/supabaseClient';
import A4Canvas, { A4_WIDTH, A4_HEIGHT } from './A4Canvas';
import ZoomControls from './ZoomControls';
import Header from './Header';
import Sidebar from './Sidebar';
import ElementSidebar, { AllElements } from './ElementSidebar'; // <-- Import AllElements
import DesignSidebar from './DesignSidebar';
import TextSidebar, { AllTextStyles } from './TextSidebar';
import PlaceholderSidebar, { AllPlaceholders } from './PlaceholderSidebar';
import PropertiesSidebar from './PropertiesSidebar'; // Import the new Properties sidebar
import ExportTemplateDialog from './ui/ExportTemplateDialog'; // Import the new dialog component
import SuccessToast from './ui/SuccessToast'; // Import the success toast component
import ConfirmDialog from './ui/ConfirmDialog';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { v4 as uuidv4 } from 'uuid';
import { saveTemplate, updateTemplate, getAllTemplates, getTemplateById } from './Designs/SavedTemplates';

const InvoiceEditor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [zoom, setZoom] = useState(0.75);
  const minZoom = 0.2;
  const maxZoom = 3.0;
  const zoomStep = 0.1;

  // Active Template State
  const [activeTemplate, setActiveTemplate] = useState(null);

  // Invoice Data State
  const [invoiceData, setInvoiceData] = useState(null);
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const [invoiceError, setInvoiceError] = useState(null);

  // --- Auth Check and Invoice Loading ---
  useEffect(() => {
    const checkAuthAndLoadInvoice = async () => {
      const { data, error } = await supabase.auth.getUser();
      
      if (error || !data?.user) {
        console.error("Authentication error:", error);
        navigate('/auth');
        return;
      }
      
      // Check for invoice ID and template ID in URL query params
      const params = new URLSearchParams(location.search);
      const invoiceId = params.get('invoice');
      const templateId = params.get('template');
      
      // If template ID is provided, load it
      if (templateId) {
        console.log("Template ID from URL:", templateId);
        try {
          setLoadingInvoice(true);
          
          // Get template by ID directly
          const selectedTemplate = await getTemplateById(templateId);
          
          if (selectedTemplate) {
            // Apply the template to the canvas
            if (selectedTemplate.elements && selectedTemplate.elements.length > 0) {
              setCanvasElements(selectedTemplate.elements);
            }
            
            // Set the active template
            setActiveTemplate(selectedTemplate);
            setCurrentTemplate(selectedTemplate);
            setShowUpdateButton(true);
          } else {
            console.error("Template not found with ID:", templateId);
          }
        } catch (error) {
          console.error("Error loading template:", error);
        } finally {
          setLoadingInvoice(false);
        }
      }
      
      if (invoiceId) {
        setLoadingInvoice(true);
        try {
          const invoiceDetails = await getInvoiceById(invoiceId);
          setInvoiceData(invoiceDetails);
          
          // Create placeholders for invoice data
          const invoicePlaceholders = createInvoicePlaceholders(invoiceDetails);
          setCanvasElements(prev => [...prev, ...invoicePlaceholders]);
          
        } catch (error) {
          console.error("Error loading invoice:", error);
          setInvoiceError(error.message);
        } finally {
          setLoadingInvoice(false);
        }
      }
    };
    
    checkAuthAndLoadInvoice();
    
    // Set up auth state listener to redirect on logout
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          navigate('/auth');
        }
      }
    );

    // Clean up subscription on unmount
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate, location.search]);

  // Function to create placeholders for invoice data
  const createInvoicePlaceholders = (invoice) => {
    if (!invoice) return [];
    
    const placeholders = [];
    let yPos = 100; // Starting Y position
    
    // Invoice Number
    placeholders.push({
      id: uuidv4(),
      type: 'text',
      x: 50,
      y: yPos,
      text: `Invoice #${invoice.invoiceNumber}`,
      fontSize: 24,
      fontFamily: 'Arial',
      fontStyle: 'bold',
      fill: '#333333',
      draggable: true,
      width: 300
    });
    
    yPos += 40;
    
    // Date Information
    placeholders.push({
      id: uuidv4(),
      type: 'text',
      x: 50,
      y: yPos,
      text: `Date: ${invoice.date}`,
      fontSize: 14,
      fontFamily: 'Arial',
      fill: '#555555',
      draggable: true,
      width: 300
    });
    
    yPos += 20;
    
    // Due Date
    if (invoice.dueDate) {
      placeholders.push({
        id: uuidv4(),
        type: 'text',
        x: 50,
        y: yPos,
        text: `Due Date: ${invoice.dueDate}`,
        fontSize: 14,
        fontFamily: 'Arial',
        fill: '#555555',
        draggable: true,
        width: 300
      });
      yPos += 40;
    }
    
    // Client Information
    if (invoice.clientName) {
      placeholders.push({
        id: uuidv4(),
        type: 'text',
        x: 50,
        y: yPos,
        text: 'Bill To:',
        fontSize: 16,
        fontFamily: 'Arial',
        fontStyle: 'bold',
        fill: '#333333',
        draggable: true,
        width: 300
      });
      
      yPos += 25;
      
      placeholders.push({
        id: uuidv4(),
        type: 'text',
        x: 50,
        y: yPos,
        text: invoice.clientName,
        fontSize: 14,
        fontFamily: 'Arial',
        fill: '#555555',
        draggable: true,
        width: 300
      });
      
      yPos += 20;
    }
    
    if (invoice.clientAddress) {
      placeholders.push({
        id: uuidv4(),
        type: 'text',
        x: 50,
        y: yPos,
        text: invoice.clientAddress,
        fontSize: 14,
        fontFamily: 'Arial',
        fill: '#555555',
        draggable: true,
        width: 300
      });
      
      yPos += 40;
    }
    
    // Items Table Headers
    placeholders.push({
      id: uuidv4(),
      type: 'text',
      x: 50,
      y: yPos,
      text: 'Item',
      fontSize: 14,
      fontFamily: 'Arial',
      fontStyle: 'bold',
      fill: '#333333',
      draggable: true,
      width: 250
    });
    
    placeholders.push({
      id: uuidv4(),
      type: 'text',
      x: 300,
      y: yPos,
      text: 'Qty',
      fontSize: 14,
      fontFamily: 'Arial',
      fontStyle: 'bold',
      fill: '#333333',
      draggable: true,
      width: 50
    });
    
    placeholders.push({
      id: uuidv4(),
      type: 'text',
      x: 350,
      y: yPos,
      text: 'Price',
      fontSize: 14,
      fontFamily: 'Arial',
      fontStyle: 'bold',
      fill: '#333333',
      draggable: true,
      width: 100
    });
    
    placeholders.push({
      id: uuidv4(),
      type: 'text',
      x: 450,
      y: yPos,
      text: 'Amount',
      fontSize: 14,
      fontFamily: 'Arial',
      fontStyle: 'bold',
      fill: '#333333',
      draggable: true,
      width: 100
    });
    
    yPos += 25;
    
    // Add a line below headers
    placeholders.push({
      id: uuidv4(),
      type: 'line',
      points: [50, yPos, 550, yPos],
      stroke: '#cccccc',
      strokeWidth: 1,
      draggable: true
    });
    
    yPos += 15;
    
    // Items Data
    if (invoice.items && Array.isArray(invoice.items)) {
      invoice.items.forEach((item, index) => {
        // Item Name
        placeholders.push({
          id: uuidv4(),
          type: 'text',
          x: 50,
          y: yPos,
          text: item.name,
          fontSize: 14,
          fontFamily: 'Arial',
          fill: '#555555',
          draggable: true,
          width: 250
        });
        
        // Quantity
        placeholders.push({
          id: uuidv4(),
          type: 'text',
          x: 300,
          y: yPos,
          text: item.quantity.toString(),
          fontSize: 14,
          fontFamily: 'Arial',
          fill: '#555555',
          draggable: true,
          width: 50
        });
        
        // Price
        placeholders.push({
          id: uuidv4(),
          type: 'text',
          x: 350,
          y: yPos,
          text: `${invoice.currency} ${item.price.toFixed(2)}`,
          fontSize: 14,
          fontFamily: 'Arial',
          fill: '#555555',
          draggable: true,
          width: 100
        });
        
        // Amount
        placeholders.push({
          id: uuidv4(),
          type: 'text',
          x: 450,
          y: yPos,
          text: `${invoice.currency} ${item.amount.toFixed(2)}`,
          fontSize: 14,
          fontFamily: 'Arial',
          fill: '#555555',
          draggable: true,
          width: 100
        });
        
        yPos += 25;
      });
    }
    
    yPos += 10;
    
    // Add a line above totals
    placeholders.push({
      id: uuidv4(),
      type: 'line',
      points: [350, yPos, 550, yPos],
      stroke: '#cccccc',
      strokeWidth: 1,
      draggable: true
    });
    
    yPos += 15;
    
    // Subtotal
    placeholders.push({
      id: uuidv4(),
      type: 'text',
      x: 350,
      y: yPos,
      text: 'Subtotal:',
      fontSize: 14,
      fontFamily: 'Arial',
      fill: '#555555',
      draggable: true,
      width: 100
    });
    
    placeholders.push({
      id: uuidv4(),
      type: 'text',
      x: 450,
      y: yPos,
      text: `${invoice.currency} ${invoice.subtotal}`,
      fontSize: 14,
      fontFamily: 'Arial',
      fill: '#555555',
      draggable: true,
      width: 100
    });
    
    yPos += 20;
    
    // Tax
    if (invoice.tax) {
      placeholders.push({
        id: uuidv4(),
        type: 'text',
        x: 350,
        y: yPos,
        text: `Tax (${invoice.tax}%):`,
        fontSize: 14,
        fontFamily: 'Arial',
        fill: '#555555',
        draggable: true,
        width: 100
      });
      
      const taxAmount = (parseFloat(invoice.subtotal) * parseFloat(invoice.tax) / 100).toFixed(2);
      
      placeholders.push({
        id: uuidv4(),
        type: 'text',
        x: 450,
        y: yPos,
        text: `${invoice.currency} ${taxAmount}`,
        fontSize: 14,
        fontFamily: 'Arial',
        fill: '#555555',
        draggable: true,
        width: 100
      });
      
      yPos += 20;
    }
    
    // Discount
    if (invoice.discount) {
      placeholders.push({
        id: uuidv4(),
        type: 'text',
        x: 350,
        y: yPos,
        text: `Discount (${invoice.discount}%):`,
        fontSize: 14,
        fontFamily: 'Arial',
        fill: '#555555',
        draggable: true,
        width: 100
      });
      
      const discountAmount = (parseFloat(invoice.subtotal) * parseFloat(invoice.discount) / 100).toFixed(2);
      
      placeholders.push({
        id: uuidv4(),
        type: 'text',
        x: 450,
        y: yPos,
        text: `- ${invoice.currency} ${discountAmount}`,
        fontSize: 14,
        fontFamily: 'Arial',
        fill: '#555555',
        draggable: true,
        width: 100
      });
      
      yPos += 20;
    }
    
    // Total
    placeholders.push({
      id: uuidv4(),
      type: 'text',
      x: 350,
      y: yPos,
      text: 'Total:',
      fontSize: 16,
      fontFamily: 'Arial',
      fontStyle: 'bold',
      fill: '#333333',
      draggable: true,
      width: 100
    });
    
    placeholders.push({
      id: uuidv4(),
      type: 'text',
      x: 450,
      y: yPos,
      text: `${invoice.currency} ${invoice.total}`,
      fontSize: 16,
      fontFamily: 'Arial',
      fontStyle: 'bold',
      fill: '#333333',
      draggable: true,
      width: 100
    });
    
    return placeholders;
  };

  // --- Sidebar States ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Main sidebar mobile toggle
  const [activeSubMenu, setActiveSubMenu] = useState(null); // Tracks which sub-menu is open ('Elements', 'Text', etc. or null)

  // --- Drag State ---
  const [isDragging, setIsDragging] = useState(false);
  const [previousSidebarState, setPreviousSidebarState] = useState({ 
    isSidebarOpen: false, 
    activeSubMenu: null 
  });

  // --- Canvas Elements State ---
  const [canvasElements, setCanvasElements] = useState([]);
  
  // --- History States for Undo/Redo ---
  const [history, setHistory] = useState([[]]);  // Initialize with empty canvas state
  const [historyIndex, setHistoryIndex] = useState(0);  // Start at index 0
  const isHistoryOperation = useRef(false);
  
  // --- Selected Element State ---
  const [selectedElementId, setSelectedElementId] = useState(null);

  // --- Snap to Grid State ---
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [gridSize, setGridSize] = useState(10);
  
  // --- Drag Position Tracking ---
  const currentDragPosition = useRef({ x: 0, y: 0 });
  const stageRef = useRef(null);

  // --- Hand Tool State ---
  const [isHandToolActive, setIsHandToolActive] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const startPanCoords = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });
  const stageContainerRef = useRef(null);
  // ----------------------

  // --- Export Template State ---
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportThumbnail, setExportThumbnail] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Current template tracking
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);

  // --- Undo/Redo Functions ---
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      isHistoryOperation.current = true;
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCanvasElements(history[newIndex]);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isHistoryOperation.current = true;
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCanvasElements(history[newIndex]);
    }
  }, [history, historyIndex]);

  // Record history when canvasElements changes
  useEffect(() => {
    // Skip if this change was triggered by an undo/redo operation
    if (isHistoryOperation.current) {
      isHistoryOperation.current = false;
      return;
    }
    
    // Only add to history if the state is different from current
    if (historyIndex >= 0 && 
        JSON.stringify(history[historyIndex]) === JSON.stringify(canvasElements)) {
      return;
    }
    
    // Add current state to history
    setHistory(prev => {
      // If we're in the middle of the history and make a change,
      // discard the "future" states
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, canvasElements];
    });
    setHistoryIndex(prev => prev + 1);
  }, [canvasElements, history, historyIndex]);

  // Toggle main sidebar (mobile)
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
    // If opening main sidebar, ensure sub menu is closed
    if (!isSidebarOpen) {
        setActiveSubMenu(null); // Close sub-menu when opening main
    }
  }, [isSidebarOpen]);

  // Close main sidebar (mobile) - used by overlay/escape key
  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  // Close *both* sidebars (mobile) - used by overlay/escape key
  const closeAllSidebars = useCallback(() => {
      setIsSidebarOpen(false);
      setActiveSubMenu(null);
  }, []);

  // Set the active sub menu (called from Sidebar component)
  const handleSetActiveSubMenu = useCallback((menuKey) => {
      setActiveSubMenu(menuKey);
      // On small screens, opening a sub-menu might implicitly close the main toggle state?
      // Or rely on the overlay/structure to handle it. Let's keep main toggle independent for now.
      // setIsSidebarOpen(false); // Optional: close main flyout when sub opens on mobile
  }, []);

  // Toggle hand tool active state
  const toggleHandTool = useCallback(() => {
    setIsHandToolActive(prev => !prev);
    if (isHandToolActive) {
      setIsPanning(false);
    }
  }, [isHandToolActive]);

  const handleZoomIn = () => setZoom((prevZoom) => Math.min(maxZoom, prevZoom + zoomStep));
  const handleZoomOut = () => setZoom((prevZoom) => Math.max(minZoom, prevZoom - zoomStep));

  // --- Element Selection and Update Handlers ---
  const handleSelectElement = useCallback((elementId) => {
    setSelectedElementId(elementId);
    
    // When an element is selected, automatically open the properties sidebar
    if (elementId) {
      setActiveSubMenu('Properties');
    }
  }, []);
  
  const handleUpdateElement = useCallback((updatedElement) => {
    setCanvasElements(prevElements => 
      prevElements.map(el => 
        el.id === updatedElement.id ? updatedElement : el
      )
    );
  }, []);
  
  const handleDeleteElement = useCallback(() => {
    if (selectedElementId) {
      setCanvasElements(prevElements => 
        prevElements.filter(el => el.id !== selectedElementId)
      );
      setSelectedElementId(null);
    }
  }, [selectedElementId]);

  // Get selected element for properties panel
  const selectedElement = canvasElements.find(el => el.id === selectedElementId);

  // --- Hand Tool Event Handlers (Update checks) ---
  const handleKeyDown = useCallback((event) => {
      const isInputFocused = document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA';
      const isLgScreen = window.innerWidth >= 1024;
      const isAnySidebarOverlayActive = (isSidebarOpen || activeSubMenu !== null) && !isLgScreen;

      // Undo - Ctrl+Z
      if (event.ctrlKey && event.key.toLowerCase() === 'z' && !event.shiftKey && !isInputFocused) {
          event.preventDefault();
          handleUndo();
          return;
      }
      
      // Redo - Ctrl+Y or Ctrl+Shift+Z
      if ((event.ctrlKey && event.key.toLowerCase() === 'y') || 
          (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'z') && 
          !isInputFocused) {
          event.preventDefault();
          handleRedo();
          return;
      }

      // Handle delete/backspace key for elements
      if ((event.key === 'Delete' || event.key === 'Backspace') && !isInputFocused && selectedElementId) {
        event.preventDefault();
        handleDeleteElement();
        return;
      }

      if (event.key.toLowerCase() === 'h' && !isInputFocused) {
          event.preventDefault();
          // Only allow activating hand tool if no overlay sidebar is active on small screens
          if (!isAnySidebarOverlayActive) {
              toggleHandTool();
          }
      } else if (event.key.toLowerCase() === 'g' && !isInputFocused) {
          // Toggle snap to grid with G key
          event.preventDefault();
          setSnapToGrid(prev => !prev);
      } else if (event.key === 'Escape' && isAnySidebarOverlayActive) {
          // Close all sidebars on Escape key press when one is open on small screens
          closeAllSidebars();
      } else if (event.key === 'Escape' && selectedElementId) {
          // Deselect element on Escape key
          setSelectedElementId(null);
      }
  }, [isHandToolActive, isSidebarOpen, activeSubMenu, closeAllSidebars, selectedElementId, handleDeleteElement, toggleHandTool, handleUndo, handleRedo]); // Add dependencies

  const handleMouseDown = useCallback((event) => {
      const isLgScreen = window.innerWidth >= 1024;
      const isAnySidebarOverlayActive = (isSidebarOpen || activeSubMenu !== null) && !isLgScreen;

      // Prevent panning if Hand tool is active AND an overlay sidebar is open on small screens
      if (isHandToolActive && stageContainerRef.current && !isAnySidebarOverlayActive) {
          if (event.target === stageContainerRef.current || event.target.closest('.konvajs-content')) {
              event.preventDefault();
              setIsPanning(true);
              startPanCoords.current = {
                  x: event.clientX, y: event.clientY,
                  scrollLeft: stageContainerRef.current.scrollLeft, scrollTop: stageContainerRef.current.scrollTop
              };
          }
      }
  }, [isHandToolActive, isSidebarOpen, activeSubMenu]); // Add dependencies

  const handleMouseMove = useCallback((event) => {
    if (isPanning && stageContainerRef.current) {
      const dx = event.clientX - startPanCoords.current.x;
      const dy = event.clientY - startPanCoords.current.y;
      stageContainerRef.current.scrollLeft = startPanCoords.current.scrollLeft - dx;
      stageContainerRef.current.scrollTop = startPanCoords.current.scrollTop - dy;
    }
    
    // Track mouse position for drag operations
    currentDragPosition.current = { x: event.clientX, y: event.clientY };
  }, [isPanning]);

  const handleMouseUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
    }
  }, [isPanning]);

  // --- Effects (Listeners) ---
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

   useEffect(() => {
     const container = stageContainerRef.current;
     if (!container) return;
     container.addEventListener('mousedown', handleMouseDown);
     window.addEventListener('mousemove', handleMouseMove);
     window.addEventListener('mouseup', handleMouseUp);
     return () => {
       container.removeEventListener('mousedown', handleMouseDown);
       window.removeEventListener('mousemove', handleMouseMove);
       window.removeEventListener('mouseup', handleMouseUp);
     };
   }, [handleMouseDown, handleMouseMove, handleMouseUp]);


  // --- Effect for Cursor (Update checks) ---
  useEffect(() => {
    const container = stageContainerRef.current;
    if (!container) return;
    const isLgScreen = window.innerWidth >= 1024;
    const isAnySidebarOverlayActive = (isSidebarOpen || activeSubMenu !== null) && !isLgScreen;

    let cursorStyle = 'default';
    // Only allow grab cursor if hand tool is active AND no overlay sidebar is active on small screens
    if (isHandToolActive && !isAnySidebarOverlayActive) {
      cursorStyle = isPanning ? 'grabbing' : 'grab';
    }
    container.style.cursor = cursorStyle;

  }, [isHandToolActive, isPanning, isSidebarOpen, activeSubMenu]); // Add dependencies

  // --- Effect to restore sidebar state after dragging ends ---
  useEffect(() => {
    if (!isDragging && previousSidebarState.activeSubMenu !== null) {
      // Only restore on large screens, keep closed on mobile
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(previousSidebarState.isSidebarOpen);
        setActiveSubMenu(previousSidebarState.activeSubMenu);
      }
      // Reset the previous state
      setPreviousSidebarState({ isSidebarOpen: false, activeSubMenu: null });
    }
  }, [isDragging, previousSidebarState]);

  // Helper function to calculate canvas coordinates from mouse position
  const getCanvasPosition = useCallback((mouseX, mouseY) => {
    const stageContainer = document.querySelector('#canvas-container');
    
    if (!stageContainer) return { x: A4_WIDTH / 2, y: A4_HEIGHT / 3 };
    
    // Get stage container bounds
    const containerRect = stageContainer.getBoundingClientRect();
    
    // Calculate position relative to stage container
    let relativeX = (mouseX - containerRect.left) / zoom;
    let relativeY = (mouseY - containerRect.top) / zoom;
    
    // Ensure the position is within canvas bounds
    relativeX = Math.max(0, Math.min(relativeX, A4_WIDTH));
    relativeY = Math.max(0, Math.min(relativeY, A4_HEIGHT));
    
    return { x: relativeX, y: relativeY };
  }, [zoom]);

  // Called when drag starts
  const onDragStart = useCallback(() => {
    // Only hide sidebars on small screens
    if (window.innerWidth < 1024) {
      // Save current sidebar states
      setPreviousSidebarState({
        isSidebarOpen,
        activeSubMenu
      });
      // Hide all sidebars to maximize canvas visibility during drag
      setIsSidebarOpen(false);
      setActiveSubMenu(null);
    }
    setIsDragging(true);
  }, [isSidebarOpen, activeSubMenu]);

  // Update drag position during drag
  const onDragUpdate = useCallback((update) => {
    if (!update.destination) return;
  }, []);

  // Called when drag ends
  const onDragEnd = useCallback((result) => {
    setIsDragging(false);
    const { source, destination, draggableId } = result;
    
    // If there's no destination or source is the same as destination, do nothing
    if (!destination) return;
    
      const isLgScreen = window.innerWidth >= 1024;
      const isAnySidebarOverlayActive = (isSidebarOpen || activeSubMenu !== null) && !isLgScreen;

      // Prevent DND if Hand tool is active OR if any overlay sidebar is active on small screens
      if (isHandToolActive || isAnySidebarOverlayActive) {
          return;
      }

    // Check if the destination is the canvas
    if (destination.droppableId === 'canvas-droppable') {
        // Determine if the dragged item is a shape or text element
        const isTextElement = draggableId.startsWith('text-');
        const isPlaceholderElement = draggableId.startsWith('ph-');
        
        if (isTextElement) {
            // Find the text style from AllTextStyles
            const textStyle = AllTextStyles.find(style => style.id === draggableId);
            
            if (textStyle) {
                // Get mouse position and convert to canvas coordinates
                const position = getCanvasPosition(
                  currentDragPosition.current.x,
                  currentDragPosition.current.y
                );
                
                // Apply snap to grid if enabled
                let adjustedX = position.x;
                let adjustedY = position.y;
                
                if (snapToGrid) {
                  adjustedX = Math.round(adjustedX / gridSize) * gridSize;
                  adjustedY = Math.round(adjustedY / gridSize) * gridSize;
                }
                
                // Create new text element with a unique id
                const newElementId = uuidv4();
                const newElement = {
                    id: newElementId,
                    type: textStyle.id, // Use the text style ID as the type
                    props: {
                        ...textStyle.props,
                        x: adjustedX,
                        y: adjustedY,
                        text: textStyle.defaultText // Set default text from style
                    }
                };
                
                // Add the new element to the canvas
                setCanvasElements(prevElements => [...prevElements, newElement]);
                
                // Select the newly added element
                setSelectedElementId(newElementId);
                // Open properties panel on larger screens
                if (window.innerWidth >= 1024) {
                  setActiveSubMenu('Properties');
                }
            }
        } else if (isPlaceholderElement) {
            // Handle placeholder elements
            const placeholderTemplate = AllPlaceholders.find(ph => ph.id === draggableId);
            
            if (placeholderTemplate) {
                // Get mouse position and convert to canvas coordinates
                const position = getCanvasPosition(
                  currentDragPosition.current.x,
                  currentDragPosition.current.y
                );
                
                // Apply snap to grid if enabled
                let adjustedX = position.x;
                let adjustedY = position.y;
                
                if (snapToGrid) {
                  adjustedX = Math.round(adjustedX / gridSize) * gridSize;
                  adjustedY = Math.round(adjustedY / gridSize) * gridSize;
                }
                
                // Create new placeholder element with a unique id
                const newElementId = uuidv4();
                const newElement = {
                    id: newElementId,
                    type: 'Text', // Placeholders are rendered as text elements
                    props: {
                        ...placeholderTemplate.props,
                        x: adjustedX,
                        y: adjustedY,
                        text: placeholderTemplate.defaultText,
                        placeholderId: placeholderTemplate.id // Store original placeholder ID
                    }
                };
                
                // Add the new element to the canvas
                setCanvasElements(prevElements => [...prevElements, newElement]);
                
                // Select the newly added element
                setSelectedElementId(newElementId);
                // Open properties panel on larger screens
                if (window.innerWidth >= 1024) {
                  setActiveSubMenu('Properties');
                }
            }
        } else {
            // Handle shape elements as before
            const elementTemplate = AllElements.find(el => el.id === draggableId);
            
            if (elementTemplate) {
                // Get mouse position and convert to canvas coordinates
                const position = getCanvasPosition(
                  currentDragPosition.current.x,
                  currentDragPosition.current.y
                );
                
                // Adjust position based on element type/size to center under cursor
                let adjustedX = position.x;
                let adjustedY = position.y;
                
                // Adjust position based on element type and size
                if (elementTemplate.type === 'Rect' || elementTemplate.type === 'RoundedRect') {
                  adjustedX -= (elementTemplate.props.width || 80) / 2;
                  adjustedY -= (elementTemplate.props.height || 60) / 2;
                } else if (elementTemplate.type === 'Circle' || 
                           elementTemplate.type === 'Triangle' || 
                           elementTemplate.type === 'Star' || 
                           elementTemplate.type === 'Pentagon') {
                  adjustedX -= (elementTemplate.props.radius || 40);
                  adjustedY -= (elementTemplate.props.radius || 40);
                } else if (elementTemplate.type === 'Line' || elementTemplate.type === 'DottedLine') {
                  // For lines, set the start point at cursor position
                  const lineLength = 100;
                  adjustedX = position.x;
                  adjustedY = position.y;
                  elementTemplate.props.points = [0, 0, lineLength, 0];
                }
                
                // Apply snap to grid if enabled
                if (snapToGrid) {
                  adjustedX = Math.round(adjustedX / gridSize) * gridSize;
                  adjustedY = Math.round(adjustedY / gridSize) * gridSize;
                }
                
                // Create new element with a unique id and positioned at the drop point
                const newElementId = uuidv4();
                const newElement = {
                    id: newElementId, // Generate unique ID for the new element
                    type: elementTemplate.type,
                    props: {
                        ...elementTemplate.props,
                        x: adjustedX,
                        y: adjustedY
                    }
                };
                
                // Add the new element to the canvas
                setCanvasElements(prevElements => [...prevElements, newElement]);
                
                // Select the newly added element
                setSelectedElementId(newElementId);
                // Open properties panel on larger screens
                if (window.innerWidth >= 1024) {
                  setActiveSubMenu('Properties');
                }
            }
        }
    }
  }, [isHandToolActive, isSidebarOpen, activeSubMenu, getCanvasPosition, snapToGrid, gridSize]); // Add dependencies

  // Function to handle exporting as template
  const handleExportTemplate = useCallback(() => {
    // Generate template thumbnail
    let thumbnail = null;
    if (stageRef.current) {
      try {
        // Convert the stage to a data URL
        thumbnail = stageRef.current.toDataURL();
        setExportThumbnail(thumbnail);
      } catch (error) {
        console.error('Error generating thumbnail:', error);
      }
    }

    // Show the export dialog - pass different parameters depending on if we're updating
    setShowExportDialog(true);
  }, [canvasElements]);

  // Handle the save from the dialog
  const handleSaveTemplate = useCallback(async (templateData) => {
    try {
      // Save the template
      await saveTemplate({
        name: templateData.name,
        description: templateData.description,
        thumbnail: exportThumbnail,
        elements: canvasElements,
      });
      
      // Show success message using toast instead of alert
      setSuccessMessage(`Template "${templateData.name}" saved successfully!`);
    } catch (error) {
      console.error('Error saving template:', error);
      throw error; // Re-throw for the dialog to handle
    }
  }, [canvasElements, exportThumbnail]);

  // Handle the initial request to update the template (shows confirmation)
  const handleUpdateTemplateRequest = useCallback(() => {
    if (!currentTemplate) return;
    // Show confirmation dialog
    setShowUpdateConfirm(true);
  }, [currentTemplate]);
  
  // Execute the actual template update after confirmation
  const executeTemplateUpdate = useCallback(async () => {
    if (!currentTemplate) return;
    
    try {
      // Generate template thumbnail
      let thumbnail = null;
      if (stageRef.current) {
        try {
          // Convert the stage to a data URL
          thumbnail = stageRef.current.toDataURL();
        } catch (error) {
          console.error('Error generating thumbnail:', error);
        }
      }
      
      // Update the template with current canvas elements
      const updatedTemplate = await updateTemplate(currentTemplate.id, {
        name: currentTemplate.name,
        description: currentTemplate.description,
        thumbnail: thumbnail || currentTemplate.thumbnail,
        elements: canvasElements,
      });
      
      // Update the current template reference
      setCurrentTemplate(updatedTemplate);
      
      // Show success message
      setSuccessMessage(`Template "${updatedTemplate.name}" updated successfully!`);
    } catch (error) {
      console.error('Error updating template:', error);
      alert('Failed to update template. Please try again.');
    }
  }, [currentTemplate, canvasElements]);

  // Function to apply a template to the canvas
  const handleApplyTemplate = useCallback((templateElements, template = null) => {
    if (!templateElements || templateElements.length === 0) {
      return;
    }

    // Add unique IDs to elements if needed
    const elementsWithIds = templateElements.map(element => ({
      ...element,
      id: element.id || uuidv4()
    }));

    // Replace current canvas elements with template elements
    setCanvasElements(elementsWithIds);
    
    // Clear selection
    setSelectedElementId(null);
    
    // Set current template reference if provided
    if (template) {
      setCurrentTemplate(template);
      setActiveTemplate(template);
      setShowUpdateButton(true);
      
      // Update URL with template ID
      const currentParams = new URLSearchParams(location.search);
      currentParams.set('template', template.id);
      navigate(`${location.pathname}?${currentParams.toString()}`);
    } else {
      setCurrentTemplate(null);
      setActiveTemplate(null);
      setShowUpdateButton(false);
    }
  }, [location.search, location.pathname, navigate]);

  // Update the handleLogout function in the Header component
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      // Clear any user data
      localStorage.removeItem('supabase.auth.token');
      
      // Force redirect to auth page 
      window.location.href = '/auth';
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Reset current template when creating a new design
  const handleNewDesign = useCallback(() => {
    setCanvasElements([]);
    setCurrentTemplate(null);
    setActiveTemplate(null);
    setShowUpdateButton(false);
    
    // Clear template ID from URL
    const currentParams = new URLSearchParams(location.search);
    currentParams.delete('template');
    navigate(`${location.pathname}?${currentParams.toString()}`);
  }, [location.search, location.pathname, navigate]);

  return (
    <DragDropContext 
      onDragStart={onDragStart}
      onDragUpdate={onDragUpdate} 
      onDragEnd={onDragEnd}
    >
      {/* Overlay - closes ALL sidebars now */}
      {/* Show overlay if either sidebar is open on small screens */}
      {(isSidebarOpen || activeSubMenu !== null) && window.innerWidth < 1024 && (
           <div
             onClick={closeAllSidebars} // Close all sidebars when overlay is clicked
             className="fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out lg:hidden"
             aria-hidden="true"
            ></div>
       )}


      <div className="flex h-screen bg-gray-100 overflow-hidden"> {/* Root container */}

        {/* Sidebar Component - Pass new props */}
        <Sidebar
            isOpen={isSidebarOpen}
            activeSubMenu={activeSubMenu}
            setActiveSubMenu={handleSetActiveSubMenu} // Pass the handler
        />

        {/* Element Sidebar Component - Conditionally Active */}
        <ElementSidebar
            isActive={activeSubMenu === 'Elements'} // Only active for 'Elements'
            onClose={() => setActiveSubMenu(null)} // Close sets activeSubMenu to null
        />

        {/* Design Sidebar Component - Conditionally Active */}
        <DesignSidebar
            isActive={activeSubMenu === 'Designs'} // Only active for 'Designs'
            onClose={() => setActiveSubMenu(null)} // Close sets activeSubMenu to null
            onApplyTemplate={handleApplyTemplate} // Pass handler to apply templates
        />

        {/* Text Sidebar Component - Conditionally Active */}
        <TextSidebar
            isActive={activeSubMenu === 'Text'} // Only active for 'Text'
            onClose={() => setActiveSubMenu(null)} // Close sets activeSubMenu to null
        />

        {/* Placeholder Sidebar Component - Conditionally Active */}
        <PlaceholderSidebar
            isActive={activeSubMenu === 'Placeholders'} // Only active for 'Placeholders'
            onClose={() => setActiveSubMenu(null)} // Close sets activeSubMenu to null
        />

        {/* Properties Sidebar Component - Conditionally Active */}
        <PropertiesSidebar
            isActive={activeSubMenu === 'Properties'} // Only active for 'Properties'
            onClose={() => setActiveSubMenu(null)} // Close sets activeSubMenu to null
            selectedElement={selectedElement}
            onUpdateElement={handleUpdateElement}
            onDeleteElement={handleDeleteElement}
            snapToGrid={snapToGrid}
            setSnapToGrid={setSnapToGrid}
            gridSize={gridSize}
            setGridSize={setGridSize}
        />

        {/* Main Content Area Wrapper */}
        <div className="flex flex-1 flex-col overflow-hidden">

          {/* Header Component - Pass undo/redo handlers and export handler */}
          <Header 
            onToggleSidebar={toggleSidebar}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onExportTemplate={handleExportTemplate}
            onUpdateTemplate={handleUpdateTemplateRequest}
            showUpdateButton={showUpdateButton}
            currentTemplateName={currentTemplate?.name}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
            onLogout={handleLogout}
            onNewDesign={handleNewDesign}
            onToggleHandTool={toggleHandTool}
            isHandToolActive={isHandToolActive}
            onToggleGrid={() => setSnapToGrid(!snapToGrid)}
            isGridActive={snapToGrid}
            gridSize={gridSize}
            onGridSizeChange={(e) => setGridSize(parseInt(e.target.value))}
          />

          {/* Editor Canvas Area */}
          <main
            ref={stageContainerRef}
            className="flex-1 overflow-auto p-4 sm:p-6 md:p-10"
          >
            <div className="flex min-h-full items-start justify-center">
              <Droppable droppableId="canvas-droppable">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex-shrink-0 relative"
                  >
                    <A4Canvas 
                      scale={zoom} 
                      canvasElements={canvasElements}
                      ref={stageRef}
                      selectedElement={selectedElementId}
                      onSelectElement={handleSelectElement}
                      onUpdateElement={handleUpdateElement}
                      snapToGrid={snapToGrid}
                      gridSize={gridSize}
                    />
                    {provided.placeholder}
               </div>
                )}
              </Droppable>
            </div>
          </main>

        </div> {/* End Main Content Area Wrapper */}

         {/* Zoom Controls */}
         <ZoomControls
           zoom={zoom}
           onZoomIn={handleZoomIn}
           onZoomOut={handleZoomOut}
           isHandToolActive={isHandToolActive}
           onToggleHandTool={toggleHandTool}
         />
      </div> {/* End Root container */}

      {/* Export Template Dialog */}
      <ExportTemplateDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onSave={handleSaveTemplate}
        defaultName={`Template ${new Date().toLocaleDateString()}`}
      />

      {/* Update Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showUpdateConfirm}
        onClose={() => setShowUpdateConfirm(false)}
        onConfirm={executeTemplateUpdate}
        title="Update Template"
        message={`Are you sure you want to update "${currentTemplate?.name}"? This will overwrite the existing template.`}
        confirmText="Update"
        cancelText="Cancel"
      />

      {/* Success Toast */}
      {successMessage && (
        <SuccessToast
          message={successMessage}
          onClose={() => setSuccessMessage('')}
        />
      )}

      {/* Loading overlay */}
      {loadingInvoice && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-neutral-400 border-t-neutral-700 rounded-full animate-spin mb-4"></div>
            <p className="text-neutral-700 font-poppins-medium">Loading Invoice Data...</p>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {invoiceError && (
        <div className="absolute top-20 right-4 bg-red-50 border-l-4 border-red-500 p-4 max-w-md shadow-lg z-50">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{invoiceError}</p>
              <button 
                className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                onClick={() => setInvoiceError(null)}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

    </DragDropContext>
  );
};

export default InvoiceEditor;