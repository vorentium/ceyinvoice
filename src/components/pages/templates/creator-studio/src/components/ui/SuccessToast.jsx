import React, { useEffect, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';

const SuccessToast = ({ message, duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        if (onClose) onClose();
      }, 300); // Wait for fade out animation before calling onClose
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible && !message) return null;

  return (
    <div 
      className={`fixed bottom-4 right-4 z-50 flex items-center p-4 text-sm text-green-800 border border-green-100 rounded-lg bg-green-50 shadow-lg transform transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
      role="alert"
    >
      <CheckCircle className="flex-shrink-0 w-5 h-5 mr-2" />
      <span className="sr-only">Success</span>
      <div>{message}</div>
      <button
        type="button"
        className="ml-4 -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg p-1.5 hover:bg-green-100 inline-flex items-center justify-center h-6 w-6"
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => {
            if (onClose) onClose();
          }, 300);
        }}
        aria-label="Close"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default SuccessToast; 