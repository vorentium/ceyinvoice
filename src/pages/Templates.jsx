import React from 'react';
import { Link } from 'react-router-dom';

const Templates = () => {
  const templates = [
    {
      id: 'basic',
      name: 'Basic Template',
      description: 'A clean, professional invoice layout with company details on the left, invoice information on the right, and a clear tabular format for line items.',
      features: [
        'Traditional invoice format',
        'Clear sections for company and client details',
        'Organized line items table',
        'Payment and terms sections'
      ],
      color: 'bg-blue-50',
      accentColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-200',
      tags: ['Professional', 'Simple'],
      tagColors: ['bg-blue-100 text-blue-800', 'bg-gray-100 text-gray-800'],
      bestFor: 'Small businesses and freelancers looking for a standard invoice format'
    },
    {
      id: 'minimal',
      name: 'Minimal Template',
      description: 'A sleek, minimalist black and white design that focuses on essential information with a compact and elegant layout.',
      features: [
        'Clean black and white design',
        'Compact spacing',
        'Rounded logo placement',
        'Simplified line items display'
      ],
      color: 'bg-gray-50',
      accentColor: 'bg-gray-200',
      textColor: 'text-gray-800',
      borderColor: 'border-gray-200',
      tags: ['Elegant', 'Minimal'],
      tagColors: ['bg-gray-100 text-gray-800', 'bg-indigo-100 text-indigo-800'],
      bestFor: 'Designers, creative professionals, and modern businesses'
    },
    {
      id: 'modern',
      name: 'Modern Template',
      description: 'A contemporary design with stylish black accents, wave elements, and a sophisticated layout for a premium look.',
      features: [
        'Bold black accent colors',
        'Distinctive wave design elements',
        'Bold invoice heading',
        'Clean and modern layout'
      ],
      color: 'bg-gray-50',
      accentColor: 'bg-gray-800',
      textColor: 'text-gray-800',
      borderColor: 'border-gray-200',
      tags: ['Creative', 'Modern'],
      tagColors: ['bg-gray-100 text-gray-800', 'bg-gray-700 text-white'],
      bestFor: 'Agencies, consultants, and businesses with a modern brand identity'
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl font-sans">
            Invoice Templates
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500 font-sans">
            Choose from our professionally designed invoice templates to create the perfect invoice for your business.
          </p>
              </div>

        {/* Template Gallery */}
        <div className="grid grid-cols-1 gap-y-10 gap-x-8 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-10">
          {templates.map((template) => (
            <div 
              key={template.id} 
              className="group rounded-xl overflow-hidden shadow-lg bg-white transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 border border-gray-100"
            >
              {/* Template Preview */}
              <div className={`aspect-w-4 aspect-h-3 ${template.color} relative`}>
                {template.id === 'basic' && (
                  <div className="p-6 relative">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="h-4 bg-gray-800 w-20 mb-1"></div>
                        <div className="h-2 bg-gray-400 w-12 mb-2"></div>
                      </div>
                      <div className="h-10 w-10 border border-gray-300 flex items-center justify-center bg-white">
                        <div className="text-xs text-gray-400 font-sans">LOGO</div>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 w-full mt-3 mb-2"></div>
                    <div className="mt-2 flex">
                      <div className="w-2/3">
                        <div className="h-2 bg-gray-300 w-full mb-1"></div>
                        <div className="h-2 bg-gray-300 w-2/3"></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {template.id === 'minimal' && (
                  <div className="p-6 relative">
                    <div className="flex justify-center mb-2">
                      <div className="h-4 bg-gray-800 w-20 mb-1"></div>
                    </div>
                    <div className="flex justify-between mt-3">
                      <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center bg-white">
                        <div className="text-xs text-gray-400 font-sans">LOGO</div>
                      </div>
                      <div className="w-1/4">
                        <div className="h-2 bg-gray-800 w-full mb-1"></div>
                        <div className="h-2 bg-gray-300 w-full"></div>
                      </div>
                      <div className="w-1/4">
                        <div className="h-2 bg-gray-800 w-full mb-1"></div>
                        <div className="h-2 bg-gray-300 w-full"></div>
                      </div>
                    </div>
                    <div className="h-1 bg-gray-800 w-full mt-6"></div>
                  </div>
                )}
                
                {template.id === 'modern' && (
                  <div className="p-6 relative bg-var-primary">
                    {/* Logo and header content */}
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                        <div className="text-xs text-gray-400 font-sans">LOGO</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-white font-sans">INVOICE</div>
                        <div className="text-xs text-white opacity-80 font-sans">#INV-001</div>
                      </div>
                    </div>
                    
                    {/* Simple content representation */}
                    <div className="mt-4 bg-white p-3 rounded">
                      <div className="flex justify-between mb-3">
                        <div>
                          <div className="h-2 bg-var-primary w-12 mb-1 rounded-sm"></div>
                          <div className="h-2 bg-gray-700 w-16 mb-1 rounded-sm"></div>
                        </div>
                        <div>
                          <div className="h-2 bg-var-primary w-12 mb-1 rounded-sm"></div>
                          <div className="h-2 bg-gray-700 w-16 mb-1 rounded-sm"></div>
                        </div>
                      </div>
                      
                      {/* Table header */}
                      <div className="mt-3 bg-var-primary p-1 rounded flex justify-between">
                        <div className="h-2 bg-white opacity-60 w-1/2 rounded-sm"></div>
                        <div className="flex space-x-2 w-1/2 justify-end">
                          <div className="h-2 bg-white opacity-60 w-8 rounded-sm"></div>
                          <div className="h-2 bg-white opacity-60 w-8 rounded-sm"></div>
                          <div className="h-2 bg-white opacity-60 w-12 rounded-sm"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Wave at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-6 overflow-hidden">
                      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="fill-var-primary w-full h-full">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C50,0,100,5.94,150.65,11.41c39.06,4.21,78.69,10.42,113.77,26.32C283.76,44.25,302.48,50.71,321.39,56.44Z"></path>
                      </svg>
                    </div>
                  </div>
                )}
                
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                  style={{ backgroundColor: 'var(--var-primary)' }}
                ></div>
              </div>
              
              {/* Template Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 font-sans">{template.name}</h3>
                  <div className="flex space-x-1">
                    {template.tags.map((tag, idx) => (
                      <span key={idx} className={`inline-block text-xs px-2 py-1 rounded-full ${template.tagColors[idx]} font-sans`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 font-sans line-clamp-2">{template.description}</p>
                
                <h4 className="font-semibold text-gray-900 mb-2 font-sans">Key Features:</h4>
                <ul className="mb-4 text-sm text-gray-600 space-y-1 font-sans">
                  {template.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg className="h-5 w-5 text-var-primary mt-0.5 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 font-sans">
                    <span className="font-medium text-gray-700">Best for:</span> {template.bestFor}
                  </p>
                </div>

                <div className="mt-6">
                    <Link
                      to={`/creator-studio?template=${template.id}`}
                    className="block w-full text-center py-3 rounded-md transition-colors font-sans cursor-pointer bg-var-primary text-white hover:bg-var-primary-dark"
                    style={{ backgroundColor: 'var(--var-primary)', borderColor: 'var(--var-primary)' }}
                    >
                    Use This Template
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        
        {/* Call to Action */}
        <div className="text-center mt-16 bg-white p-10 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 font-sans">Need a custom invoice template?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto font-sans">
            Our team can design a custom invoice template that perfectly matches your brand identity and business needs.
          </p>
          <button 
            className="bg-white border-2 border-var-primary text-var-primary px-8 py-3 rounded-full font-medium hover:bg-var-primary hover:text-white transition-colors cursor-pointer font-sans"
            style={{ borderColor: 'var(--var-primary)', color: 'var(--var-primary)' }}
          >
            Contact Our Team
          </button>
        </div>
      </div>
    </div>
  );
};

export default Templates; 