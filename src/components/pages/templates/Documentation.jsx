import React, { useState, useEffect } from 'react';
import { ChevronRight, Search, BookOpen, FileText, Users, Layout, AlertCircle, Lock, Code, Coffee, PlusCircle, Palette, Move, Image, Save } from 'lucide-react';

const Documentation = () => {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');

  const sections = [
    { id: 'getting-started', name: 'Getting Started', icon: <BookOpen size={18} /> },
    { id: 'invoices', name: 'Invoices', icon: <FileText size={18} /> },
    { id: 'clients', name: 'Clients', icon: <Users size={18} /> },
    { id: 'templates', name: 'Templates', icon: <Layout size={18} /> },
    { id: 'template-creation', name: 'Creating Templates', icon: <PlusCircle size={18} /> },
    { id: 'faq', name: 'FAQ', icon: <AlertCircle size={18} /> },
  ];

  const documentationContent = {
    'getting-started': {
      title: 'Getting Started with CeyInvoice',
      content: [
        {
          title: 'Introduction',
          description: 'CeyInvoice is a modern invoice management application that helps you create, manage, and track invoices. With an intuitive interface and powerful features, CeyInvoice simplifies your invoicing workflow.',
          image: null
        },
        {
          title: 'Setting Up Your Account',
          description: (
            <ol className="list-decimal ml-5 space-y-2 text-gray-400">
              <li>Sign up for a CeyInvoice account using your email address.</li>
              <li>Complete your profile information, including your business details.</li>
              <li>Customize your invoice settings with your logo and preferred currency.</li>
              <li>You're now ready to create your first invoice!</li>
            </ol>
          )
        },
        {
          title: 'Dashboard Overview',
          description: 'The dashboard provides a central view of your invoicing activity, including total invoices, revenue, and client statistics. It also displays recent invoices for quick access.',
          image: null
        },
        {
          title: 'Navigation',
          description: 'Use the sidebar to navigate between different sections of the application. You can access Invoices, Clients, Templates, and Settings from here.'
        }
      ]
    },
    'invoices': {
      title: 'Working with Invoices',
      content: [
        {
          title: 'Creating an Invoice',
          description: (
            <div>
              <p className="mb-3 text-gray-300">To create a new invoice:</p>
              <ol className="list-decimal ml-5 space-y-2 text-gray-400">
                <li>Navigate to the Invoices section and click "Create New Invoice".</li>
                <li>Select a client from your list or add a new one.</li>
                <li>Add line items with descriptions, quantities, and prices.</li>
                <li>Set the invoice date and payment terms.</li>
                <li>Optionally add notes or terms and conditions.</li>
                <li>Save or send the invoice directly to your client.</li>
              </ol>
            </div>
          )
        },
        {
          title: 'Managing Invoices',
          description: 'View all your invoices in the Invoices section. You can filter by status (Paid, Pending, Overdue) and search for specific invoices. Click on an invoice to view details or edit it.'
        },
        {
          title: 'Invoice Status',
          description: (
            <div>
              <p className="mb-2 text-gray-300">Invoices can have the following statuses:</p>
              <ul className="list-disc ml-5 space-y-1 text-gray-400">
                <li><span className="text-emerald-400 font-medium">Paid</span> - The invoice has been paid by the client.</li>
                <li><span className="text-yellow-400 font-medium">Pending</span> - The invoice has been sent but not yet paid.</li>
                <li><span className="text-red-400 font-medium">Overdue</span> - The payment deadline has passed without payment.</li>
                <li><span className="text-gray-500 font-medium">Draft</span> - The invoice is saved but not yet finalized or sent.</li>
              </ul>
            </div>
          )
        },
        {
          title: 'Recurring Invoices',
          description: 'Note: Recurring invoices are not currently supported but will be available in a future update.'
        }
      ]
    },
    'clients': {
      title: 'Managing Clients',
      content: [
        {
          title: 'Adding a Client',
          description: (
            <div>
              <p className="mb-3 text-gray-300">To add a new client:</p>
              <ol className="list-decimal ml-5 space-y-2 text-gray-400">
                <li>Go to the Clients section and click "Add Client".</li>
                <li>Enter the client's name, email, phone number, and address.</li>
                <li>Click "Save" to add the client to your list.</li>
              </ol>
            </div>
          )
        },
        {
          title: 'Editing Client Information',
          description: 'To edit a client\'s information, find them in your client list and click the edit button. Update their details and save your changes.'
        },
        {
          title: 'Client Overview',
          description: 'Each client has an overview page showing their contact information and invoice history. You can see total invoiced amount, payment status, and other key metrics.'
        }
      ]
    },
    'templates': {
      title: 'Invoice Templates',
      content: [
        {
          title: 'Using Templates',
          description: 'Templates allow you to create consistent invoice designs. You can create multiple templates for different purposes or clients. When creating a new invoice, you can select from your saved templates to start with a pre-designed layout.'
        },
        {
          title: 'Accessing Templates',
          description: 'You can access your templates from the Templates section in the dashboard. From there, you can view, edit, or use any of your saved templates.'
        },
        {
          title: 'Applying Templates',
          description: 'To apply a template to a new invoice, select the template from the dropdown menu when creating a new invoice. The template will load with all your predefined design elements, and you can then customize it for the specific invoice.'
        }
      ]
    },
    'template-creation': {
      title: 'Creating Invoice Templates',
      content: [
        {
          title: 'Getting Started with Creator Studio',
          description: (
            <div>
              <p className="mb-3 text-gray-300">The Creator Studio is CeyInvoice\'s powerful template design tool. To access it:</p>
              <ol className="list-decimal ml-5 space-y-2 text-gray-400">
                <li>Navigate to the Templates section in your dashboard.</li>
                <li>Click on "Create New Template" or select "Creator Studio" from the sidebar.</li>
                <li>You\'ll be presented with a blank A4 canvas where you can design your invoice template.</li>
              </ol>
            </div>
          )
        },
        {
          title: 'Adding Elements to Your Template',
          description: (
            <div>
              <p className="mb-3 text-gray-300">The Creator Studio offers various elements you can add to your invoice:</p>
              <ul className="list-disc ml-5 space-y-2 text-gray-400">
                <li><span className="font-medium flex items-center text-gray-200"><FileText className="inline-block mr-1" size={16} /> Text Elements</span> - Add headings, paragraphs, and formatted text to your invoice.</li>
                <li><span className="font-medium flex items-center text-gray-200"><Image className="inline-block mr-1" size={16} /> Image Elements</span> - Upload and position your company logo and other images.</li>
                <li><span className="font-medium flex items-center text-gray-200"><Layout className="inline-block mr-1" size={16} /> Tables</span> - Add tables to display invoice items, quantities, and prices.</li>
                <li><span className="font-medium flex items-center text-gray-200"><Palette className="inline-block mr-1" size={16} /> Shapes</span> - Add rectangles, circles, and other shapes for visual design.</li>
              </ul>
              <p className="mt-3 text-gray-300">To add an element, simply drag it from the sidebar onto your canvas.</p>
            </div>
          )
        },
        {
          title: 'Positioning and Styling Elements',
          description: (
            <div>
              <p className="mb-3 text-gray-300">Once elements are on your canvas:</p>
              <ul className="list-disc ml-5 space-y-2 text-gray-400">
                <li><span className="font-medium flex items-center text-gray-200"><Move className="inline-block mr-1" size={16} /> Move</span> - Click and drag elements to position them precisely on your invoice.</li>
                <li><span className="font-medium flex items-center text-gray-200"><Palette className="inline-block mr-1" size={16} /> Style</span> - Select an element and use the properties panel to customize its appearance (color, font, size, etc.).</li>
                <li><span className="font-medium text-gray-200">Resize</span> - Grab the handles on the corners or edges of an element to resize it.</li>
                <li><span className="font-medium text-gray-200">Align</span> - Use the grid and snap functionality to ensure perfect alignment of elements.</li>
              </ul>
            </div>
          )
        },
        {
          title: 'Adding Dynamic Fields',
          description: (
            <div>
              <p className="mb-3 text-gray-300">Dynamic fields automatically populate with invoice data:</p>
              <ul className="list-disc ml-5 space-y-2 text-gray-400">
                <li>Add placeholders for client information, invoice numbers, dates, and line items.</li>
                <li>These fields will automatically fill with the correct information when you create an invoice using the template.</li>
                <li>Find dynamic fields in the "Placeholders" tab in the Creator Studio sidebar.</li>
              </ul>
            </div>
          )
        },
        {
          title: 'Saving Your Template',
          description: (
            <div>
              <p className="mb-3 text-gray-300">When you're satisfied with your design:</p>
              <ol className="list-decimal ml-5 space-y-2 text-gray-400">
                <li>Click the <span className="font-medium flex items-center inline-flex text-gray-200"><Save className="inline-block mr-1" size={16} /> Save</span> button in the top bar.</li>
                <li>Give your template a descriptive name and optional description.</li>
                <li>Click "Save Template" to store it for future use.</li>
                <li>Your template will now appear in your templates list and be available when creating new invoices.</li>
              </ol>
            </div>
          )
        },
        {
          title: 'Template Tips and Best Practices',
          description: (
            <div>
              <ul className="list-disc ml-5 space-y-2 text-gray-400">
                <li><span className="font-medium text-gray-200">Keep it simple</span> - Avoid cluttering your invoice with too many elements.</li>
                <li><span className="font-medium text-gray-200">Use consistent fonts</span> - Stick to 1-2 font families for a professional look.</li>
                <li><span className="font-medium text-gray-200">Include essential information</span> - Make sure your template includes all legally required invoice elements.</li>
                <li><span className="font-medium text-gray-200">Test your template</span> - Create a test invoice with your template to ensure all dynamic fields work correctly.</li>
                <li><span className="font-medium text-gray-200">Create multiple templates</span> - Consider creating different templates for different types of clients or services.</li>
              </ul>
            </div>
          )
        }
      ]
    },
    'faq': {
      title: 'Frequently Asked Questions',
      content: [
        {
          title: 'Can I have multiple users on my account?',
          description: 'CeyInvoice currently doesn\'t support multiple users on a single account. Each account is limited to a single user. However, this feature is planned for a future update which will allow team collaboration and role-based permissions.'
        },
        {
          title: 'Can I generate recurring invoices?',
          description: 'Currently, CeyInvoice does not support recurring invoices. Each invoice needs to be created manually. We understand this is an important feature for many businesses, and it is on our roadmap for future development.'
        },
        {
          title: 'What payment methods are supported?',
          description: 'Payments are currently not supported in CeyInvoice. At this time, the system is focused on invoice creation and management. Payment processing capabilities are planned for a future update. For now, you can use external payment methods and manually mark invoices as paid.'
        },
        {
          title: 'How do I generate financial reports?',
          description: 'Currently, CeyInvoice does not support generating financial reports. This feature is planned for a future update, which will allow you to create various reports such as income summaries, tax reports, and client statements. For now, you can view basic invoice statistics on your dashboard and manually track your financial data.'
        },
        {
          title: 'Can I export my data for accounting software?',
          description: 'Exporting data to accounting software is not currently supported in CeyInvoice. We understand the importance of integration with accounting platforms like QuickBooks, Xero, and FreshBooks, and this functionality is on our development roadmap. In the meantime, you can manually export your invoice data as CSV files for record-keeping.'
        }
      ]
    }
  };

  const filteredSections = sections.filter(section => {
    const sectionContent = documentationContent[section.id];
    if (!sectionContent) return false;
    const query = searchQuery.toLowerCase();

    // Check section name
    if (section.name.toLowerCase().includes(query)) return true;
    // Check section title
    if (sectionContent.title.toLowerCase().includes(query)) return true;
    // Check content items
    return sectionContent.content.some(item => {
      if (item.title.toLowerCase().includes(query)) return true;
      if (typeof item.description === 'string' && item.description.toLowerCase().includes(query)) return true;
      if (typeof item.description !== 'string' && item.description?.props?.children) {
        try {
            const checkChildren = (children) => {
                if (!children) return false;
                if (typeof children === 'string') return children.toLowerCase().includes(query);
                if (Array.isArray(children)) return children.some(child => checkChildren(child));
                if (typeof children === 'object' && children.props?.children) return checkChildren(children.props.children);
                return false;
            }
            return checkChildren(item.description.props.children);
        } catch (e) {
            return false;
        }
      }
      return false;
    });
  });

  useEffect(() => {
    if (searchQuery && filteredSections.length > 0 && !filteredSections.some(sec => sec.id === activeSection)) {
      setActiveSection(filteredSections[0].id);
    } else if (!searchQuery) {
    }
  }, [searchQuery, filteredSections, activeSection]);

  return (
    <div className="min-h-screen text-gray-300" style={{
      background: 'radial-gradient(ellipse at center, rgb(22, 22, 22) 0%, rgba(0, 0, 0, 1) 100%)',
      backgroundAttachment: 'fixed'
    }}>
      {/* Header */}
      <header className="bg-neutral-900 border-b border-neutral-700 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <a href="/" className="text-neutral-400 hover:text-white mr-4 text-sm flex items-center">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                 </svg>
                 Home
              </a>
              <h1 className="md:text-3xl text-2xl font-poppins-bold text-white">Documentation</h1>
            </div>
            <div className="flex items-center pl-10">
              <div className="relative w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  className="block md:w-full w-48 pl-10 pr-3 py-2 border border-neutral-600 rounded-md leading-5 bg-neutral-800 text-white placeholder-gray-500 focus:outline-none focus:ring-neutral-500 focus:border-neutral-500 sm:text-sm cursor-text"
                  placeholder="Search documentation"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar / Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-1 sticky top-[100px]">
              {filteredSections.length > 0 ? (
                  filteredSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left cursor-pointer ${
                        activeSection === section.id
                          ? 'bg-neutral-700 text-white'
                          : 'text-gray-400 hover:bg-neutral-700 hover:text-white'
                      }`}
                    >
                      <span className="mr-3">{section.icon}</span>
                      {section.name}
                      {activeSection === section.id && <ChevronRight className="ml-auto h-4 w-4" />}
                    </button>
                  ))
              ) : (
                <p className="text-sm text-gray-500 px-3 py-2">No sections found.</p>
              )}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {filteredSections.length > 0 ? (
              filteredSections.some(sec => sec.id === activeSection) && documentationContent[activeSection] ? (
                <div>
                  <h2 className="text-3xl font-poppins-bold text-white mb-6">
                    {documentationContent[activeSection].title}
                  </h2>
                  <div className="space-y-10">
                    {documentationContent[activeSection].content.map((item, index) => (
                      <div key={index} className="bg-neutral-800 p-6 rounded-lg shadow-md border border-neutral-700">
                        <h3 className="text-xl font-poppins-semibold text-white mb-4">
                          {item.title}
                        </h3>
                        <div className="prose prose-invert max-w-none text-gray-400">
                          {item.description}
                        </div>
                        {item.image && (
                          <div className="mt-4 border border-neutral-700 rounded-lg overflow-hidden">
                            <img src={item.image} alt={item.title} className="w-full" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : ( 
                <div className="text-center py-10">
                  <p className="text-gray-400">Select a section from the list to view its content.</p>
                </div>
              )
            ) : (
              <div className="text-center py-20">
                <AlertCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No results found</h3>
                <p className="text-gray-400">
                  No documentation matches your search for "<span className="font-semibold text-gray-200">{searchQuery}</span>".
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-4 py-2 bg-neutral-700 text-neutral-100 rounded-md hover:bg-neutral-600 cursor-pointer"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-neutral-900 border-t border-neutral-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Support</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a href="/help-support" className="text-base text-gray-400 hover:text-white cursor-pointer">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="/tutorials" className="text-base text-gray-400 hover:text-white cursor-pointer">
                      Video Tutorials
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Legal</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a href="/privacy" className="text-base text-gray-400 hover:text-white cursor-pointer">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="/terms" className="text-base text-gray-400 hover:text-white cursor-pointer">
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <p className="mt-8 text-base text-gray-500 text-center">
              &copy; {new Date().getFullYear()} CeyInvoice. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Documentation;
