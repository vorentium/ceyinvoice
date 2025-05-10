import React from 'react';
import { ExternalLink } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen text-gray-300" style={{
      background: 'radial-gradient(ellipse at center, rgb(22, 22, 22) 0%, rgba(0, 0, 0, 1) 100%)',
      backgroundAttachment: 'fixed'
    }}>
      {/* Header */}
      <header className="bg-neutral-900 border-b border-neutral-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-poppins-bold text-white">Privacy Policy</h1>
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
                CeyInvoice is an open-source invoice management application. As an open-source project, we are committed to transparency in how we handle your data. This Privacy Policy explains how we collect, use, and protect information when you use our application.
              </p>
              <p>
                Since CeyInvoice is self-hosted, most of your data remains under your control on your own servers. However, certain interactions with external services may involve data processing outside your environment.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Information We Collect</h2>
              <p>CeyInvoice collects the following types of information:</p>
              <h3 className="text-xl font-medium text-gray-200 mt-4 mb-2">Application Data</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Invoice data (including client information, items, pricing, etc.)</li>
                <li>Client records and contact information</li>
                <li>Template designs and configurations</li>
                <li>User account information (for authentication purposes)</li>
              </ul>
              <p className="mt-4">
                <strong>Important:</strong> This data is stored exclusively on your self-hosted server and is not transmitted to us or any third parties unless you have explicitly configured integrations with external services.
              </p>

              <h3 className="text-xl font-medium text-gray-200 mt-4 mb-2">Usage Data and Analytics</h3>
              <p>
                By default, CeyInvoice does not collect usage analytics. However, you may optionally enable analytics to help us improve the application. If enabled, we collect:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Anonymous usage statistics (feature usage, performance metrics)</li>
                <li>Error reports to improve reliability</li>
                <li>General information about your environment (browser type, operating system)</li>
              </ul>
              <p className="mt-2">
                You can disable analytics collection at any time in the application settings.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold text-white mb-4">How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Provide, maintain, and improve CeyInvoice</li>
                <li>Identify and fix bugs</li>
                <li>Develop new features based on user needs</li>
                <li>Generate aggregate insights about application usage (if analytics are enabled)</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Data Storage and Security</h2>
              <p>
                Since CeyInvoice is self-hosted, you maintain control over your data storage and security. We recommend:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Keeping your server environment updated with the latest security patches</li>
                <li>Using strong passwords and enabling two-factor authentication if available</li>
                <li>Implementing regular data backups</li>
                <li>Using encrypted connections (HTTPS) for accessing your instance</li>
                <li>Following security best practices for your hosting environment</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Third-Party Services</h2>
              <p>
                CeyInvoice may integrate with third-party services based on your configuration choices. These may include:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Payment processing services</li>
                <li>Email delivery services</li>
                <li>Cloud storage providers</li>
                <li>Analytics platforms (if enabled)</li>
              </ul>
              <p className="mt-2">
                Each third-party service has its own privacy policy governing how they handle your data. We encourage you to review their policies before enabling integrations.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Open Source Commitment</h2>
              <p>
                As an open-source project, our code is publicly available for review. This transparency extends to our data handling practices. You can audit how we process information by examining our codebase on GitHub.
              </p>
              <p className="mt-2">
                We welcome contributions from the community to improve our privacy and security measures.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will post the revised policy on our GitHub repository and update the "Last Updated" date.
              </p>
              <p className="mt-2">
                For significant changes, we will provide a more prominent notice, such as an email notification to repository watchers or an announcement in our release notes.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
              <p>
                If you have questions or concerns about this Privacy Policy or our data practices, please:
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
            href="/terms" 
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 cursor-pointer ml-6"
          >
            Terms of Service <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
