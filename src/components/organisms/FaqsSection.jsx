import React, { useEffect } from 'react';
import FaqList from '../molecules/FaqList';

function FaqsSection() {
  useEffect(() => {
    // Add animations to elements when section comes into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add appropriate animation class when element is in view
          if (entry.target.classList.contains('faqs-heading')) {
            entry.target.classList.add('animate-slide-in-right');
          } else if (entry.target.classList.contains('faqs-list')) {
            entry.target.classList.add('animate-fade-in');
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    // Observe the heading and FAQ list
    const heading = document.querySelector('.faqs-heading');
    const faqList = document.querySelector('.faqs-list');
    
    if (heading) observer.observe(heading);
    if (faqList) observer.observe(faqList);
    
    return () => {
      if (heading) observer.unobserve(heading);
      if (faqList) observer.unobserve(faqList);
    };
  }, []);

  return (
    <section id="faqs" className="py-16 px-4 bg-gray-50 min-h-screen flex flex-col items-center justify-center overflow-hidden font-sans">
      <div className="max-w-4xl w-full mx-auto">
        <h2 className="faqs-heading text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-16 text-black opacity-0 transition-all duration-1000 font-sans">
          FAQS
        </h2>
        
        <div className="faqs-list opacity-0 transition-all duration-1000 delay-300">
          <FaqList />
        </div>
      </div>
    </section>
  );
}

export default FaqsSection; 