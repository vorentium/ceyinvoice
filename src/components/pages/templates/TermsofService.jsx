import React from 'react';
import { ExternalLink } from 'lucide-react';

const TermsofService = () => {
  return (
    <div className="min-h-screen text-gray-300" style={{
      background: 'radial-gradient(ellipse at center, rgb(22, 22, 22) 0%, rgba(0, 0, 0, 1) 100%)',
      backgroundAttachment: 'fixed'
    }}>
      {/* Header */}
      <header className="bg-neutral-900 border-b border-neutral-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-poppins-bold text-white">Terms of Service</h1>
            <span className="text-sm text-gray-500">Last Updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-neutral-800 p-8 rounded-lg shadow-md border border-neutral-700">
          <div className="prose prose-invert max-w-none text-gray-400">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Introduction</h2>
              <p>
                Welcome to CeyInvoice, an open-source invoice management application. These Terms of Service ("Terms") govern your use of the CeyInvoice software and associated documentation ("Software").
              </p>
              <p>
                By downloading, installing, or using CeyInvoice, you agree to be bound by these Terms. If you do not agree to these Terms, do not use the Software.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Open Source License</h2>
              <p>
                CeyInvoice is released under the MIT License, which is included in the repository and documentation. This open-source license grants you certain rights to use, copy, modify, and distribute the Software, subject to the conditions of the license.
              </p>
              <p className="mt-2">
                The full text of the MIT License can be found in the LICENSE file included with the Software or on the GitHub repository.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Use of the Software</h2>
              <p>You may use CeyInvoice for any lawful purpose, including:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Creating and managing invoices for your business</li>
                <li>Managing client information</li>
                <li>Designing and using invoice templates</li>
                <li>Extending or modifying the Software for your needs</li>
                <li>Redistributing the Software in accordance with the MIT License</li>
              </ul>
              <p className="mt-4">
                However, you may not use the Software in any way that violates applicable laws or regulations.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Self-Hosting Responsibilities</h2>
              <p>
                As CeyInvoice is self-hosted software, you are responsible for:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Providing the infrastructure to host the Software</li>
                <li>Ensuring the security of your installation</li>
                <li>Backing up your data regularly</li>
                <li>Complying with all laws and regulations applicable to your use of the Software, including data protection and privacy laws</li>
                <li>Maintaining and updating the Software as needed</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Contributions</h2>
              <p>
                We welcome contributions to CeyInvoice from the community. By submitting code, documentation, or other contributions to the project, you agree that your contributions will be licensed under the same MIT License that covers the Software.
              </p>
              <p className="mt-2">
                For detailed information on how to contribute, please refer to the CONTRIBUTING.md file in our repository.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Disclaimer of Warranty</h2>
              <p className="font-medium text-gray-300">
                THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
              </p>
              <p className="mt-2">
                In no event shall the authors, copyright holders, or contributors be liable for any claim, damages, or other liability, whether in an action of contract, tort, or otherwise, arising from, out of, or in connection with the Software or the use or other dealings in the Software.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, the developers, contributors, and maintainers of CeyInvoice shall not be liable for any direct, indirect, incidental, special, exemplary, or consequential damages (including, but not limited to, procurement of substitute goods or services; loss of use, data, or profits; or business interruption) however caused and on any theory of liability, whether in contract, strict liability, or tort (including negligence or otherwise) arising in any way out of the use of this Software, even if advised of the possibility of such damage.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Third-Party Services and Integrations</h2>
              <p>
                CeyInvoice may integrate with third-party services or include third-party libraries and components. These third-party elements may have their own terms of service and privacy policies. It is your responsibility to comply with these terms when using such services or components.
              </p>
              <p className="mt-2">
                The CeyInvoice team is not responsible for the practices or policies of any third-party service you choose to integrate with the Software.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Trademark and Branding</h2>
              <p>
                The CeyInvoice name and logo are trademarks of the project maintainers. When redistributing the Software or creating derived works, please respect these trademarks by:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Not using them in a way that suggests your fork or modification is the official CeyInvoice</li>
                <li>Changing the name and branding if you significantly modify the Software</li>
                <li>Not using them for commercial purposes without permission</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Changes to These Terms</h2>
              <p>
                We may update these Terms from time to time to reflect changes in the Software, legal requirements, or for other reasons. We will post the revised Terms on our GitHub repository and update the "Last Updated" date.
              </p>
              <p className="mt-2">
                Your continued use of the Software after such changes constitutes your acceptance of the revised Terms.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
              <p>
                If you have questions or concerns about these Terms, please:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Open an issue on our GitHub repository</li>
                <li>Contact the maintainers via email at [project email address]</li>
                <li>Join our community discussion channels</li>
              </ul>
            </section>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <a 
            href="/" 
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 cursor-pointer"
          >
            Back to Home
          </a>
          <a 
            href="/privacy" 
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 cursor-pointer ml-6"
          >
            Privacy Policy <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TermsofService;
