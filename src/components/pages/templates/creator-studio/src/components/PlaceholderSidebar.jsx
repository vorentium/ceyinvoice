import React from 'react';
import { X, Image as ImageIcon, Square as SquareIcon, FileText, CalendarDays, DollarSign, Percent, CreditCard, MessageSquare, Hash, Building, MapPin, Phone, User } from 'lucide-react';
import { Droppable, Draggable } from '@hello-pangea/dnd';

// --- Placeholder Data ---
const placeholderItems = [
  { 
    id: 'ph-logo-round', 
    name: 'Logo Here (Round)', 
    icon: ImageIcon, 
    defaultText: 'LOGO',
    props: { 
      fontSize: 18, 
      fontFamily: 'Arial',
      fontStyle: 'bold',
      fill: '#555555',
      width: 100,
      height: 100,
      stroke: '#555555',
      strokeWidth: 1,
      dash: [10, 5],
      background: 'transparent',
      radius: 50
    }
  },
  { 
    id: 'ph-logo-square', 
    name: 'Logo Here (Square)', 
    icon: SquareIcon,
    defaultText: 'LOGO',
    props: { 
      fontSize: 18, 
      fontFamily: 'Arial',
      fontStyle: 'bold',
      fill: '#555555',
      width: 100,
      height: 100,
      stroke: '#555555',
      strokeWidth: 1,
      dash: [10, 5],
      background: 'transparent'
    }
  },
  { 
    id: 'ph-invoice-no', 
    name: 'Invoice No',
    icon: Hash,
    defaultText: 'Invoice #: INV-001',
    props: { 
      fontSize: 14, 
      fontFamily: 'Arial',
      fontStyle: 'normal',
      fill: '#333333',
      width: 180
    }
  },
  { 
    id: 'ph-company-name', 
    name: 'Company Name',
    icon: Building,
    defaultText: 'Company Name',
    props: { 
      fontSize: 16, 
      fontFamily: 'Arial',
      fontStyle: 'bold',
      fill: '#333333',
      width: 180
    }
  },
  { 
    id: 'ph-company-addr1', 
    name: 'Company Address Line 1',
    icon: MapPin,
    defaultText: 'Street Address, Building',
    props: { 
      fontSize: 12, 
      fontFamily: 'Arial',
      fontStyle: 'normal',
      fill: '#555555',
      width: 180
    }
  },
  { 
    id: 'ph-company-addr2', 
    name: 'Company Address Line 2',
    icon: MapPin,
    defaultText: 'City, State, ZIP',
    props: { 
      fontSize: 12, 
      fontFamily: 'Arial',
      fontStyle: 'normal',
      fill: '#555555',
      width: 180
    }
  },
  { 
    id: 'ph-company-mobile', 
    name: 'Company Mobile No',
    icon: Phone,
    defaultText: 'Tel: +1 234 567 8900',
    props: { 
      fontSize: 12, 
      fontFamily: 'Arial',
      fontStyle: 'normal',
      fill: '#555555',
      width: 180
    }
  },
  { 
    id: 'ph-customer-name', 
    name: 'Customer Name',
    icon: User,
    defaultText: 'Customer Name',
    props: { 
      fontSize: 14, 
      fontFamily: 'Arial',
      fontStyle: 'bold',
      fill: '#333333',
      width: 180
    }
  },
  { 
    id: 'ph-customer-addr1', 
    name: 'Customer Address Line 1',
    icon: MapPin,
    defaultText: 'Customer Street Address',
    props: { 
      fontSize: 12, 
      fontFamily: 'Arial',
      fontStyle: 'normal',
      fill: '#555555',
      width: 180
    }
  },
  { 
    id: 'ph-customer-addr2', 
    name: 'Customer Address Line 2',
    icon: MapPin,
    defaultText: 'Customer City, State, ZIP',
    props: { 
      fontSize: 12, 
      fontFamily: 'Arial',
      fontStyle: 'normal',
      fill: '#555555',
      width: 180
    }
  },
  { 
    id: 'ph-customer-mobile', 
    name: 'Customer Mobile No',
    icon: Phone,
    defaultText: 'Tel: +1 234 567 8900',
    props: { 
      fontSize: 12, 
      fontFamily: 'Arial',
      fontStyle: 'normal',
      fill: '#555555',
      width: 180
    }
  },
  { 
    id: 'ph-issue-date', 
    name: 'Issue Date',
    icon: CalendarDays,
    defaultText: 'Date: 01/01/2024',
    props: { 
      fontSize: 12, 
      fontFamily: 'Arial',
      fontStyle: 'normal',
      fill: '#555555',
      width: 180
    }
  },
  { 
    id: 'ph-due-date', 
    name: 'Due Date',
    icon: CalendarDays,
    defaultText: 'Due Date: 15/01/2024',
    props: { 
      fontSize: 12, 
      fontFamily: 'Arial',
      fontStyle: 'normal',
      fill: '#555555',
      width: 180
    }
  },
  { 
    id: 'ph-item-name', 
    name: 'Item Name',
    icon: FileText,
    defaultText: '[Item Name]',
    props: { 
      fontSize: 15, 
      fontFamily: 'Arial',
      fontStyle: 'normal',
      fill: '#333333',
      width: 200,
      height: 50,
      dash: [10, 5],
      background: 'transparent'
    }
  },
  { 
    id: 'ph-item-quantity', 
    name: 'Item Quantity',
    icon: FileText,
    defaultText: '[Item Quantity]',
    props: { 
      fontSize: 14, 
      fontFamily: 'Arial',
      fontStyle: 'normal',
      fill: '#333333',
      width: 100,
      height: 50,
      dash: [10, 5],
      background: 'transparent'
    }
  },
  { 
    id: 'ph-item-price', 
    name: 'Item Price',
    icon: FileText,
    defaultText: '[Item Price]',
    props: { 
      fontSize: 14, 
      fontFamily: 'Arial',
      fontStyle: 'normal',
      fill: '#333333',
      width: 100,
      height: 50,
      dash: [10, 5],
      background: 'transparent'
    }
  },
  { 
    id: 'ph-item-amount', 
    name: 'Item Amount',
    icon: FileText,
    defaultText: '[Item Amount]',
    props: { 
      fontSize: 14, 
      fontFamily: 'Arial',
      fontStyle: 'normal',
      fill: '#333333',
      width: 100,
      height: 50,
      dash: [10, 5],
      background: 'transparent'
    }
  },
  { 
    id: 'ph-total', 
    name: 'Total',
    icon: DollarSign,
    defaultText: 'Total: $0.00',
    props: { 
      fontSize: 14, 
      fontFamily: 'Arial',
      fontStyle: 'bold',
      fill: '#333333',
      width: 180
    }
  },
  { 
    id: 'ph-vat', 
    name: 'VAT (%)',
    icon: Percent,
    defaultText: 'VAT (20%): $0.00',
    props: { 
      fontSize: 12, 
      fontFamily: 'Arial',
      fontStyle: 'normal',
      fill: '#555555',
      width: 180
    }
  },
  { 
    id: 'ph-discount', 
    name: 'Discount (%)',
    icon: Percent,
    defaultText: 'Discount (10%): $0.00',
    props: { 
      fontSize: 12, 
      fontFamily: 'Arial',
      fontStyle: 'normal',
      fill: '#555555',
      width: 180
    }
  },
  { 
    id: 'ph-subtotal', 
    name: 'SubTotal',
    icon: DollarSign,
    defaultText: 'Subtotal: $0.00',
    props: { 
      fontSize: 14, 
      fontFamily: 'Arial',
      fontStyle: 'bold',
      fill: '#333333',
      width: 180
    }
  },
  { 
    id: 'ph-terms', 
    name: 'Terms & Conditions',
    icon: FileText,
    defaultText: 'Terms & Conditions: Payment due within 14 days...',
    props: { 
      fontSize: 10, 
      fontFamily: 'Arial',
      fontStyle: 'normal',
      fill: '#777777',
      width: 300
    }
  },
  { 
    id: 'ph-payment', 
    name: 'Payment Method',
    icon: CreditCard,
    defaultText: 'Payment Method: Bank Transfer',
    props: { 
      fontSize: 12, 
      fontFamily: 'Arial',
      fontStyle: 'normal',
      fill: '#555555',
      width: 180
    }
  },
  { 
    id: 'ph-greeting', 
    name: 'Greeting Message',
    icon: MessageSquare,
    defaultText: 'Thank you for your business!',
    props: { 
      fontSize: 14, 
      fontFamily: 'Arial',
      fontStyle: 'italic',
      fill: '#555555',
      width: 250
    }
  },
];

// Export placeholder items for use in other components
export const AllPlaceholders = placeholderItems;

const PlaceholderSidebar = ({ isActive, onClose }) => {
  // Helper function to render the placeholder item inside Draggable
  const renderPlaceholderContent = (item) => (
    <>
      {item.icon && <item.icon className="h-5 w-5 mr-2 text-gray-600" strokeWidth={1.5} />}
      <span className="text-sm leading-tight">{item.name}</span>
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
      aria-label="Placeholders Sidebar"
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-700">Placeholders</h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            aria-label="Close Placeholders panel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-grow p-4 overflow-y-auto">
          {/* Placeholder List */}
          <Droppable droppableId="sidebar-placeholders" isDropDisabled={true}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-2"
              >
                {placeholderItems.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(providedDraggable, snapshotDraggable) => (
                      <div
                        ref={providedDraggable.innerRef}
                        {...providedDraggable.draggableProps}
                        {...providedDraggable.dragHandleProps}
                        className={`
                          flex items-center p-3 border rounded-md
                          transition duration-150 ease-in-out
                          ${snapshotDraggable.isDragging ? 'bg-blue-100 border-blue-300 shadow-lg' : 'bg-white border-gray-200 hover:bg-gray-100'}
                          focus:outline-none focus:ring-2 focus:ring-indigo-300
                          cursor-grab
                        `}
                        title={`Add placeholder: ${item.name}`}
                      >
                        {renderPlaceholderContent(item)}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Instructions
            </h3>
            <p className="text-xs text-gray-500 mb-2">
              Drag placeholders onto the canvas to add them to your invoice.
            </p>
            <p className="text-xs text-gray-500">
              Use placeholders for dynamic content that will be filled with real data.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default PlaceholderSidebar;