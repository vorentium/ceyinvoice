import React from 'react';
import Navbar from '../components/molecules/Navbar';
import Footer from '../components/organisms/Footer';

function LicensePage() {
  return (
    <div className="license-page">
      <Navbar />
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-12 text-center">LICENSE INFORMATION</h2>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4">Free & Open Source</h3>
              <p className="text-gray-600 mb-4">
                CeyInvoice is 100% free and open source software. There are no usage restrictions, limitations, or premium tiers.
                You are free to use, modify, and distribute this software for any purpose.
              </p>
              
              <div className="border-l-4 border-var-primary pl-4 py-2 bg-gray-50">
                <p className="text-gray-800 font-medium">
                  CeyInvoice is released under the MIT License:
                </p>
              </div>
            </div>
            
            <div className="mb-8 bg-gray-50 p-6 rounded-lg">
              <h4 className="text-xl font-semibold mb-3 text-var-primary">MIT License</h4>
              <p className="text-gray-600 mb-4">
                Copyright © {new Date().getFullYear()} CeyInvoice
              </p>
              <p className="text-gray-600 mb-4">
                Permission is hereby granted, free of charge, to any person obtaining a copy
                of this software and associated documentation files (the "Software"), to deal
                in the Software without restriction, including without limitation the rights
                to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                copies of the Software, and to permit persons to whom the Software is
                furnished to do so, subject to the following conditions:
              </p>
              <p className="text-gray-600 mb-4">
                The above copyright notice and this permission notice shall be included in all
                copies or substantial portions of the Software.
              </p>
              <p className="text-gray-600">
                THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                SOFTWARE.
              </p>
            </div>
            
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4">What This Means For You</h3>
              
              <div className="space-y-4">
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                  <li>You can use CeyInvoice for <strong>both personal and commercial purposes</strong> at no cost</li>
                  <li>You can create <strong>unlimited invoices</strong> with no restrictions</li>
                  <li>All features are available to everyone - there are <strong>no premium tiers</strong></li>
                  <li>You can modify the software to suit your needs</li>
                  <li>You can distribute your modified version</li>
                  <li>You can include CeyInvoice in your own projects</li>
                </ul>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold mb-4">Contributing To The Project</h3>
              <p className="text-gray-600 mb-4">
                CeyInvoice is a community project. We welcome contributions of all kinds - from bug fixes to feature enhancements.
                If you're interested in contributing, visit our GitHub repository.
              </p>
              
              <div className="flex justify-center mt-8">
                <a 
                  href="https://github.com/CeyInvoice/ceyinvoice" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-var-primary text-white rounded-md hover:bg-opacity-90 transition-colors duration-300"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  View On GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default LicensePage; 