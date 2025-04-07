import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import GitHubBtn from '../atoms/GitHubBtn';
import Marquee from '../atoms/Marquee';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  // Check if the route is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full">
      {/* Welcome Banner - Only visible on desktop */}
      <div className="hidden lg:block w-full bg-white mb-0 pb-0">
        <div className="container mx-auto py-0.5 -mt-2">
          <Marquee />
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`w-full md:py-1 lg:py-1 md:h-18 lg:h-18 bg-white`}>
        <div className="container mx-auto px-4">
          {/* Mobile and Desktop Layout */}
          <div className="md:flex md:justify-between md:items-center md:py-0 md:h-full">
            {/* Top Row - Mobile */}
            <div className="flex justify-between items-center py-2">
              {/* Logo */}
              <div className="text-var-primary font-jersey font-bold text-2xl mt-2 md:font-semibold md:text-4xl md:-mt-4 lg:text-5xl lg:font-normal ">
                CEYINVOICE
              </div>

              {/* Hamburger Menu - Only on Mobile */}
              <button onClick={toggleMenu} className="md:hidden p-1">
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center space-x-3 -mt-5">
              <GitHubBtn />
            </div>
          </div>

          {/* Desktop Navigation Links - Centered */}
          <div className="hidden md:flex justify-center items-center -mt-4">
            <ul className="flex space-x-10">
              <li className={`font-sans hover:text-var-primary transition-colors relative group ${isActive('/') ? 'text-var-primary font-medium' : ''}`}>
                <Link to="/" className="block">Home</Link>
                <span className={`absolute bottom-0 h-0.5 bg-var-primary transition-all duration-300 ease-out ${isActive('/') ? 'w-full left-0' : 'w-0 left-1/2 group-hover:w-full group-hover:left-0'}`}></span>
              </li>
              <li className={`font-sans hover:text-var-primary transition-colors relative group ${isActive('/creator-studio') ? 'text-var-primary font-medium' : ''}`}>
                <Link to="/creator-studio" className="block">Create Invoice</Link>
                <span className={`absolute bottom-0 h-0.5 bg-var-primary transition-all duration-300 ease-out ${isActive('/creator-studio') ? 'w-full left-0' : 'w-0 left-1/2 group-hover:w-full group-hover:left-0'}`}></span>
              </li>
              <li className={`font-sans hover:text-var-primary transition-colors relative group ${isActive('/templates') ? 'text-var-primary font-medium' : ''}`}>
                <Link to="/templates" className="block">Templates</Link>
                <span className={`absolute bottom-0 h-0.5 bg-var-primary transition-all duration-300 ease-out ${isActive('/templates') ? 'w-full left-0' : 'w-0 left-1/2 group-hover:w-full group-hover:left-0'}`}></span>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="md:hidden px-4 py-2 bg-white border-t">
            {/* CTA Buttons in Mobile Menu */}
            <div className="flex justify-center py-3 border-b border-gray-100">
              <GitHubBtn />
            </div>
            
            {/* Navigation Links */}
            <ul className="flex flex-col space-y-4 py-3">
              <li className={`font-sans hover:text-var-primary transition-colors relative group ${isActive('/') ? 'text-var-primary font-medium' : ''}`}>
                <Link to="/" onClick={() => setIsOpen(false)} className="block">Home</Link>
                <span className={`absolute bottom-0 h-0.5 bg-var-primary transition-all duration-300 ease-out ${isActive('/') ? 'w-full left-0' : 'w-0 left-1/2 group-hover:w-full group-hover:left-0'}`}></span>
              </li>
              <li className={`font-sans hover:text-var-primary transition-colors relative group ${isActive('/creator-studio') ? 'text-var-primary font-medium' : ''}`}>
                <Link to="/creator-studio" onClick={() => setIsOpen(false)} className="block">Create Invoice</Link>
                <span className={`absolute bottom-0 h-0.5 bg-var-primary transition-all duration-300 ease-out ${isActive('/creator-studio') ? 'w-full left-0' : 'w-0 left-1/2 group-hover:w-full group-hover:left-0'}`}></span>
              </li>
              <li className={`font-sans hover:text-var-primary transition-colors relative group ${isActive('/templates') ? 'text-var-primary font-medium' : ''}`}>
                <Link to="/templates" onClick={() => setIsOpen(false)} className="block">Templates</Link>
                <span className={`absolute bottom-0 h-0.5 bg-var-primary transition-all duration-300 ease-out ${isActive('/templates') ? 'w-full left-0' : 'w-0 left-1/2 group-hover:w-full group-hover:left-0'}`}></span>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
