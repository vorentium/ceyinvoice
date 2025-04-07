import React, { useEffect } from 'react';
import Section1 from '../components/organisms/Section1';
import Features from '../components/organisms/Features';
import HowItWorksSection from '../components/organisms/HowItWorksSection';
import BenefitsSection from '../components/organisms/BenefitsSection';
import ReviewsSection from '../components/organisms/ReviewsSection';
import FaqsSection from '../components/organisms/FaqsSection';
import { scrollToSection } from '../utils/scrollUtils';

function Home() {
  // Handle initial scrolling
  useEffect(() => {
    // If no hash in URL, scroll to top
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    } 
    // If there's a hash in the URL, scroll to that section
    else {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        scrollToSection(id);
      }, 500); // Small delay to ensure components are rendered
    }
  }, []);

  return (
    <div className="home-page">
      <Section1 />
      <Features />
      <HowItWorksSection />
      <BenefitsSection />
      <ReviewsSection />
      <FaqsSection />
    </div>
  );
}

export default Home; 