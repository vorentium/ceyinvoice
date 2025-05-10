import React from 'react';
import { motion } from 'framer-motion';
import { Home, Calendar } from 'lucide-react';

const Changelog = () => {
  // Updated changelog data with actual entries
  const changelogData = [
    { 
      date: "May 5, 2025", 
      version: "v2.0.0",
      category: "Release",
      description: "New version Release with significant improvements and features." 
    },
    { 
      date: "April 30, 2025", 
      version: "v1.9.0",
      category: "Feature",
      description: "New Form to add invoice details with improved data entry experience." 
    },
    { 
      date: "April 26, 2025", 
      version: "v1.8.0",
      category: "Feature",
      description: "Account deletion and username changing ability added for better user control." 
    },
    { 
      date: "April 25, 2025", 
      version: "v1.7.0",
      category: "UI",
      description: "Landing page dark theme only and other white theme options introduced." 
    },
    { 
      date: "April 24, 2025", 
      version: "v1.6.0",
      category: "Enhancement",
      description: "Documentation, Privacy Policy, and Terms of Service updated." 
    },
    { 
      date: "April 23, 2025", 
      version: "v1.5.0",
      category: "UI",
      description: "Modern UI implemented across the platform for better user experience." 
    },
    { 
      date: "April 21, 2025", 
      version: "v1.4.0",
      category: "Feature",
      description: "Client & Invoice Management system added with improved organization tools." 
    },
    { 
      date: "April 20, 2025", 
      version: "v1.3.0",
      category: "Feature",
      description: "Analytical dashboard launched for better insights and reporting." 
    },
    { 
      date: "April 18, 2025", 
      version: "v1.2.0",
      category: "Security",
      description: "New Authentication System implemented for enhanced security." 
    },
    { 
      date: "April 15, 2025", 
      version: "v1.1.0",
      category: "Feature",
      description: "Creator Studio launched for advanced template customization." 
    },
    { 
      date: "April 10, 2025", 
      version: "v1.0.1",
      category: "Enhancement",
      description: "Custom invoice templates added with more design options." 
    },
    { 
      date: "April 7, 2025", 
      version: "v1.0.0",
      category: "Release",
      description: "Initial Release of Ceyinvoice with core functionality." 
    }
  ];

  // Get category badge style
  const getCategoryStyle = (category) => {
    switch(category) {
      case 'UI': return 'text-purple-300 border-purple-800';
      case 'Security': return 'text-red-300 border-red-800';
      case 'Feature': return 'text-blue-300 border-blue-800';
      case 'Enhancement': return 'text-green-300 border-green-800';
      case 'Release': return 'text-amber-300 border-amber-800';
      default: return 'text-neutral-300 border-neutral-800';
    }
  };

  return (
    <div className="min-h-screen text-gray-300" style={{
      background: 'radial-gradient(ellipse at center, rgb(22, 22, 22) 0%, rgba(0, 0, 0, 1) 100%)',
      backgroundAttachment: 'fixed'
    }}>
      {/* Simple Header */}
      <header className="bg-neutral-900 border-b border-neutral-800 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-5">
            <div className="flex items-center space-x-4">
              <a href="/" className="text-neutral-400 hover:text-white flex items-center text-sm">
                <Home className="w-4 h-4 mr-2" />
                Home
              </a>
              <h1 className="text-2xl font-semibold text-white">Changelog</h1>
            </div>
            <span className="text-sm text-neutral-500">v{changelogData[0].version}</span>
          </div>
        </div>
      </header>

      {/* Content with clean timeline */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <p className="text-center text-gray-400 mb-16">
          Track the evolution of Ceyinvoice with our latest updates and improvements.
        </p>

        <div className="space-y-16">
          {changelogData.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Date marker */}
              <div className="flex items-center mb-3">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-neutral-500 mr-2" />
                  <span className="text-sm text-neutral-400">{item.date}</span>
                </div>
                <div className="mx-3 h-px bg-neutral-800 flex-grow"></div>
                <span className="text-xs px-2 py-1 rounded border-l-2 bg-neutral-900 text-neutral-400">
                  {item.version}
                </span>
              </div>
              
              {/* Content card */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
                <div className="flex items-center mb-3">
                  <span className={`text-xs font-medium border-l-2 pl-2 ${getCategoryStyle(item.category)}`}>
                    {item.category}
                  </span>
                </div>
                <p className="text-white">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="bg-neutral-900 border-t border-neutral-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="py-8 text-center">
            <p className="text-sm text-neutral-500">
              © {new Date().getFullYear()} CeyInvoice by Vorentium. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Changelog;
