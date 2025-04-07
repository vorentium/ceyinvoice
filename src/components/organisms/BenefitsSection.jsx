import React, { useEffect, useRef, useState } from 'react';
import Benefit1 from '../molecules/Benefit1';
import Benefit2 from '../molecules/Benefit2';
import Benefit3 from '../molecules/Benefit3';
import Benefit4 from '../molecules/Benefit4';
import Benefit5 from '../molecules/Benefit5';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function BenefitsSection() {
  const sectionRef = useRef(null);
  const panelsContainerRef = useRef(null);
  const panelsRef = useRef([]);
  const [activePanelIndex, setActivePanelIndex] = useState(0);
  
  const benefits = [
    { id: 0, Component: Benefit1 },
    { id: 1, Component: Benefit2 },
    { id: 2, Component: Benefit3 },
    { id: 3, Component: Benefit4 },
    { id: 4, Component: Benefit5 }
  ];

  useEffect(() => {
    if (!sectionRef.current || !panelsContainerRef.current) return;
    
    // Make sure all panels are in the refs array
    if (panelsRef.current.length !== benefits.length) {
      console.log("Panel refs not initialized correctly");
      return;
    }
    
    // Check that all panel refs are valid DOM elements
    const allPanelsValid = panelsRef.current.every((panel, index) => {
      const isValid = panel !== null && panel !== undefined;
      if (!isValid) console.log(`Panel ${index} is not valid`);
      return isValid;
    });
    
    if (!allPanelsValid) return;
    
    // Clear existing ScrollTriggers
    ScrollTrigger.getAll().forEach(st => st.kill());
    
    // Reset all panels to initial state
    panelsRef.current.forEach((panel, i) => {
      gsap.set(panel, { 
        y: i === 0 ? '0%' : '100%', 
        opacity: i === 0 ? 1 : 0,
        zIndex: benefits.length - i
      });
    });
    
    // Set section height to accommodate all panels
    const totalHeight = benefits.length * 100;
    sectionRef.current.style.height = `${totalHeight}vh`;
    
    // Create a single ScrollTrigger for the entire section
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      pin: panelsContainerRef.current,
      anticipatePin: 1,
      onUpdate: self => {
        // Calculate which panel should be active based on scroll progress
        const scrollProgress = self.progress;
        const panelCount = benefits.length;
        const panelHeight = 1 / panelCount; // Height of each panel as a fraction of total scroll
        
        let newActivePanel = Math.floor(scrollProgress / panelHeight);
        newActivePanel = Math.min(newActivePanel, panelCount - 1);
        
        if (newActivePanel !== activePanelIndex) {
          // Update active panel index
          setActivePanelIndex(newActivePanel);
          
          // Animate new panel in
          gsap.to(panelsRef.current[newActivePanel], {
            y: '0%',
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
            zIndex: 100,
            onComplete: () => {
              // Ensure the active panel has highest z-index
              gsap.set(panelsRef.current[newActivePanel], { zIndex: 100 });
            }
          });
          
          // If going forward, move previous panel out of the way
          if (newActivePanel > activePanelIndex) {
            gsap.to(panelsRef.current[activePanelIndex], {
              y: '-100%',
              opacity: 0,
              duration: 0.5,
              ease: "power2.in",
              zIndex: 90
            });
          } 
          // If going backward, send next panel back down
          else if (newActivePanel < activePanelIndex) {
            gsap.to(panelsRef.current[activePanelIndex], {
              y: '100%',
              opacity: 0,
              duration: 0.5,
              ease: "power2.in",
              zIndex: 90
            });
          }
        }
      }
    });
    
    // Responsive handling
    const handleResize = () => {
      ScrollTrigger.refresh(true);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Force a refresh after a short delay to ensure everything is properly initialized
    setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 200);
    
    return () => {
      st.kill();
      window.removeEventListener('resize', handleResize);
    };
  }, [benefits.length, activePanelIndex]);

  return (
    <section 
      ref={sectionRef} 
      id="benefits"
      className="benefits-section relative"
      style={{ overflowX: 'hidden' }}
    >
      <div 
        ref={panelsContainerRef}
        className="panels-container h-screen w-full overflow-hidden"
        style={{ position: 'sticky', top: 0 }}
      >
        {benefits.map((benefit, index) => (
          <div 
            key={benefit.id}
            ref={el => panelsRef.current[index] = el}
            className="panel absolute inset-0 w-full h-full"
          >
            <benefit.Component />
          </div>
        ))}
      </div>
    </section>
  );
}

export default BenefitsSection; 