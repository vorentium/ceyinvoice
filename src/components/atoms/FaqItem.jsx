import React, { useState, useRef, useEffect } from 'react';

function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef(null);
  const iconRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const contentHeight = contentRef.current.scrollHeight;
      setHeight(contentHeight);
    } else {
      setHeight(0);
    }

    // Animate icon rotation
    if (iconRef.current) {
      if (isOpen) {
        iconRef.current.style.transform = 'rotate(90deg)';
      } else {
        iconRef.current.style.transform = 'rotate(0deg)';
      }
    }
  }, [isOpen]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-6 w-full max-w-4xl transform transition-all duration-300 hover:shadow-md font-sans">
      <div 
        className={`rounded-2xl bg-white border-2 border-var-primary p-4 cursor-pointer transition-all duration-300 ${isOpen ? 'border-opacity-100' : 'border-opacity-80 hover:border-opacity-100'}`}
        onClick={toggleOpen}
      >
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-4">
            <div 
              className="w-6 h-6 border-2 border-var-primary flex items-center justify-center rounded-l transition-all duration-300"
              ref={iconRef}
            >
              <span className="text-var-primary text-xl font-bold leading-none transition-transform duration-500 font-sans">
                {isOpen ? '−' : '+'}
              </span>
            </div>
          </div>
          <h3 className="text-black font-normal text-xl font-sans">{question}</h3>
        </div>
        
        <div 
          ref={contentRef} 
          className="overflow-hidden transition-all duration-500 ease-in-out"
          style={{ maxHeight: `${height}px` }}
        >
          <div className="mt-4 pl-10 text-gray-700 font-sans">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FaqItem; 