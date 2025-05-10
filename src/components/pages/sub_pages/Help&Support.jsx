import React, { useState, useEffect } from 'react';
import { Mail, MessageCircle, ExternalLink, ChevronDown, ChevronUp, Search, MessageSquare, Bot } from 'lucide-react';

const HelpAndSupport = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBotNotification, setShowBotNotification] = useState(false);

  // Add animation styles to the document head
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      @keyframes fadeInDown {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes fadeOut {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
      }

      .animate-fade-in-down {
        animation: fadeInDown 0.5s ease-out forwards, fadeOut 0.5s ease-in forwards 2.5s;
      }
    `;
    document.head.appendChild(styleEl);

    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const handleBotChatClick = () => {
    setShowBotNotification(true);
    setTimeout(() => {
      setShowBotNotification(false);
    }, 3000);
  };

  const faqs = [
    {
      category: 'Account Management',
      questions: [
        {
          question: 'How do I reset my password?',
          answer: 'To reset your password, click on the "Forgot Password" link on the login page. You will receive an email with instructions to reset your password. Follow the link in the email to set a new password.'
        },
        {
          question: 'How do I update my account information?',
          answer: 'You can update your account information by going to the "Settings" page. Click on your profile icon in the top-right corner and select "Settings" from the dropdown menu. There, you can edit your profile information, company details, and preferences.'
        },
        {
          question: 'Can I have multiple users on my account?',
          answer: 'CeyInvoice currently doesn\'t support multiple users on a single account. Each account is limited to a single user. However, this feature is planned for a future update which will allow team collaboration and role-based permissions.'
        }
      ]
    },
    {
      category: 'Invoice Creation',
      questions: [
        {
          question: 'How do I create a new invoice?',
          answer: 'To create a new invoice, navigate to the "Invoices" section and click on the "Create New Invoice" button. Fill in the client information, add line items, set payment terms, and click "Save" or "Send" when you\'re ready.'
        },
        {
          question: 'Can I customize my invoice templates?',
          answer: 'Yes, you can customize your invoice templates in the "Templates" section. Click on "Create New Template" or edit an existing one. You can change colors, add your logo, rearrange elements, and save your custom design for future use.'
        },
        {
          question: 'How do I add my company logo to invoices?',
          answer: 'You can add your company logo in the invoice editor. When creating or editing an invoice, click on the "Add Logo" button in the top section of the template. Upload your logo file (PNG or JPG format recommended), and it will appear on your invoice. You can resize and position it as needed.'
        },
        {
          question: 'Can I generate recurring invoices?',
          answer: 'Currently, CeyInvoice does not support recurring invoices. Each invoice needs to be created manually. We understand this is an important feature for many businesses, and it is on our roadmap for future development.'
        }
      ]
    },
    {
      category: 'Payments',
      questions: [
        {
          question: 'What payment methods are supported?',
          answer: 'Payments are currently not supported in CeyInvoice. At this time, the system is focused on invoice creation and management. Payment processing capabilities are planned for a future update. For now, you can use external payment methods and manually mark invoices as paid.'
        },
        {
          question: 'How do I know when a client has paid an invoice?',
          answer: 'Since payments are not currently integrated into CeyInvoice, you\'ll need to manually update the invoice status to "Paid" after receiving payment through your external payment methods. You can do this by editing the invoice and changing its status.'
        },
        {
          question: 'How can I set up payment reminders?',
          answer: 'Automatic payment reminders are not currently supported. As a workaround, you can track due dates on your dashboard and manually send reminder emails to clients. This feature is on our development roadmap and will be implemented in a future update.'
        }
      ]
    },
    {
      category: 'Reports & Exports',
      questions: [
        {
          question: 'How do I generate financial reports?',
          answer: 'Currently, CeyInvoice does not support generating financial reports. This feature is planned for a future update, which will allow you to create various reports such as income summaries, tax reports, and client statements. For now, you can view basic invoice statistics on your dashboard and manually track your financial data.'
        },
        {
          question: 'Can I export my data for accounting software?',
          answer: 'Exporting data to accounting software is not currently supported in CeyInvoice. We understand the importance of integration with accounting platforms like QuickBooks, Xero, and FreshBooks, and this functionality is on our development roadmap. In the meantime, you can manually export your invoice data as CSV files for record-keeping.'
        }
      ]
    }
  ];

  // Filter FAQs based on search query
  const filteredFaqs = searchQuery
    ? faqs.map(category => ({
        ...category,
        questions: category.questions.filter(
          item => 
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.questions.length > 0)
    : faqs;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      {/* Notification Modal */}
      {showBotNotification && (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center animate-fade-in-down">
          <div className="mt-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
            <Bot className="h-5 w-5 mr-2" />
            <span>Chat bot is currently in development mode and not available yet.</span>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-poppins-bold text-gray-900 mb-4">Help & Support Center</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Find answers to common questions or reach out to our support team for assistance.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-10">
        <div className="relative max-w-xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-indigo-50 rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
          <div className="bg-indigo-100 p-3 rounded-full mb-4">
            <Mail className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="font-poppins-bold text-gray-900 mb-2">Email Support</h3>
          <p className="text-gray-600 mb-4">Send us an email and we'll respond within 24 hours.</p>
          <a href="mailto:support@ceyinvoice.com" className="text-indigo-600 font-medium hover:text-indigo-800">support@ceyinvoice.com</a>
        </div>

        <div className="bg-green-50 rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
          <div className="bg-green-100 p-3 rounded-full mb-4">
            <MessageCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-poppins-bold text-gray-900 mb-2">Bot Chat Support</h3>
          <p className="text-gray-600 mb-4">Get immediate responses from our AI assistant for common questions.</p>
          <button 
            onClick={handleBotChatClick}
            className="text-green-600 font-medium hover:text-green-800 cursor-pointer"
          >
            Start chatting with bot
          </button>
        </div>

        <div className="bg-amber-50 rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
          <div className="bg-amber-100 p-3 rounded-full mb-4">
            <MessageSquare className="h-6 w-6 text-amber-600" />
          </div>
          <h3 className="font-poppins-bold text-gray-900 mb-2">WhatsApp Support</h3>
          <p className="text-gray-600 mb-4">Chat with us on WhatsApp for quick responses</p>
          <a 
            href="https://wa.me/94776921838" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-amber-600 font-medium hover:text-amber-800 cursor-pointer"
          >
            +94 776921838
          </a>
        </div>
      </div>

      {/* FAQ Accordions */}
      <div className="mb-12">
        <h2 className="text-2xl font-poppins-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600">No results found for "{searchQuery}"</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
            >
              Clear search
            </button>
          </div>
        ) : (
          filteredFaqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-6">
              <h3 className="text-lg font-poppins-semibold text-gray-800 mb-4">{category.category}</h3>
              <div className="space-y-3">
                {category.questions.map((faq, faqIndex) => {
                  const accordionIndex = `${categoryIndex}-${faqIndex}`;
                  return (
                    <div key={faqIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        className="w-full px-4 py-3 text-left bg-white hover:bg-gray-50 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        onClick={() => toggleAccordion(accordionIndex)}
                      >
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        {activeAccordion === accordionIndex ? 
                          <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        }
                      </button>
                      {activeAccordion === accordionIndex && (
                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Resources Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-poppins-bold text-gray-900 mb-6">Additional Resources</h2>
        <div className="grid grid-cols-1 gap-6">
          <a 
            href="/documentation" 
            className="block p-6 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all flex items-start space-x-4"
          >
            <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-md">
              <ExternalLink className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Documentation</h3>
              <p className="text-gray-600 text-sm">Detailed guides and API documentation</p>
            </div>
          </a>
        </div>
      </div>

      {/* Still Need Help Section */}
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <h2 className="text-xl font-poppins-bold text-gray-900 mb-4">Still Need Help?</h2>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          Our support team is ready to assist you with any questions or issues you may have.
        </p>
        <a
          href="mailto:support@ceyinvoice.com"
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <Mail className="mr-2 h-5 w-5" />
          Contact Support
        </a>
      </div>
    </div>
  );
};

export default HelpAndSupport;
