import React from 'react';
import FaqItem from '../atoms/FaqItem';

// FAQ data
const faqData = [
  {
    id: 1,
    question: "Is this invoicing platform really 100% free?",
    answer: "Yes, our core invoicing platform is completely free to use with no hidden fees or charges. We offer unlimited invoicing, client management, and basic reporting at no cost. For advanced features such as custom branding, API access, and advanced analytics, we do offer premium tiers."
  },
  {
    id: 2,
    question: "How do I create an invoice?",
    answer: "Creating an invoice is simple! After logging in, click on 'New Invoice' from your dashboard. Select a client (or add a new one), add your items or services with descriptions and prices, set payment terms, add any notes or terms & conditions, and click 'Save' or 'Send'. You can also use our templates or duplicate previous invoices to save time."
  },
  {
    id: 3,
    question: "Do I need to install any software?",
    answer: "No installation required! Our platform is entirely cloud-based, so you can access it from any device with an internet connection through your web browser. We also offer mobile apps for iOS and Android for on-the-go invoicing, but these are optional and not required to use our service."
  },
  {
    id: 4,
    question: "How do I send invoices to my clients?",
    answer: "You have multiple options for sending invoices. The most common method is email delivery directly from our platform - just enter your client's email address and hit send. You can also generate a shareable link, download the invoice as a PDF to send manually, or even set up automatic recurring invoices for regular clients. All sent invoices are tracked so you know when they've been viewed."
  },
  {
    id: 5,
    question: "How do I get started?",
    answer: "Getting started is easy! Simply create a free account using your email address. Once verified, you'll be guided through a quick setup process to customize your account. Add your business details, logo, and start adding clients. We offer an interactive tutorial to help you create your first invoice, and our help center has guides and videos if you need additional assistance. You can have your first invoice created and sent in under 5 minutes!"
  }
];

// The slideInLeft animation is already defined in tailwind.config.js
function FaqList() {
  return (
    <div className="flex flex-col items-center w-full font-sans">
      {faqData.map((faq, index) => (
        <div 
          key={faq.id} 
          className="w-full transform transition-all duration-500 font-sans animate-slide-in-left"
          style={{ 
            animationDelay: `${index * 150}ms`,
            opacity: 0,
            animation: `slideInLeft 0.7s ease-out ${index * 150}ms forwards`
          }}
        >
          <FaqItem
            question={faq.question}
            answer={faq.answer}
          />
        </div>
      ))}

      <style jsx="true">{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

export default FaqList; 