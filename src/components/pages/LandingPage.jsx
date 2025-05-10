import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import dashboard from '../../assets/dashboard.png';
import Mordern_Template from '../../assets/Mordern_Template- Design.jpg';
import Creative_Template from '../../assets/Creative_Template.jpg';
import Minimalist_Template from '../../assets/Minimalist_Template.jpg';
import logo from '../../assets/VorentiumLogo.png';
import developer from '../../assets/developer.png';
import creator_studio from '../../assets/creator-studio.png';

const LandingPage = () => {
  const tubeLightRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Templates data for carousel
  const templates = [
    { id: 1, name: "Modern Template", image: Mordern_Template, description: "Clean and professional design for businesses of all types" },
    { id: 2, name: "Creative Template", image: Creative_Template, description: "Stand out with colorful accents and unique layout" },
    { id: 3, name: "Minimalist Template", image: Minimalist_Template, description: "Simple and elegant design focusing on clarity" }
  ];

  // Handle carousel navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === templates.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? templates.length - 1 : prev - 1));
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent body scrolling when menu is open
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle scroll for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Tube Light Effect for Hero Section
  useEffect(() => {
    if (!tubeLightRef.current) return;

    const canvas = tubeLightRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const drawTubeLight = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create angular gradient
      const time = Date.now() * 0.001;
      const x1 = canvas.width * 0.5 + Math.cos(time) * canvas.width * 0.3;
      const y1 = canvas.height * 0.2 + Math.sin(time * 0.7) * canvas.height * 0.1;
      const x2 = canvas.width * 0.5 + Math.cos(time * 0.8 + 2) * canvas.width * 0.3;
      const y2 = canvas.height * 0.8 + Math.sin(time * 0.5 + 1) * canvas.height * 0.1;
      
      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, 'rgba(255, 0, 128, 0.7)');
      gradient.addColorStop(0.5, 'rgba(128, 0, 255, 0.5)');
      gradient.addColorStop(1, 'rgba(0, 255, 255, 0.7)');
      
      // Draw tube light effect
      ctx.fillStyle = gradient;
      ctx.filter = 'blur(80px)';
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineWidth = 30;
      ctx.strokeStyle = gradient;
      ctx.stroke();
      
      requestAnimationFrame(drawTubeLight);
    };
    
    drawTubeLight();
    
    // Handle resize
    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [tubeLightRef]);

  // Clean up overflow style when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen font-sans text-white" style={{
      background: 'radial-gradient(ellipse at center, rgb(22, 22, 22) 0%, rgba(0, 0, 0, 1) 100%)',
      backgroundAttachment: 'fixed'
    }}>
      
      {/* Tube Light Effect */}
      <canvas ref={tubeLightRef} className="absolute inset-0 z-10 opacity-40" style={{ width: '100%', height: '100%' }}></canvas>
      
      {/* Content container */}
      <div className="relative z-20">
        {/* Navigation */}
        <nav className={`px-6 py-4 fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
          scrolled ? 'bg-black-transparent-10 backdrop-filter backdrop-blur-lg shadow-lg' : ''
        }`}>
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-white">CEYINVOICE</span>
            </div>
            
            {/* Centered Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-300 hover:text-gray-100 transition">Home</a>
              <a href="#features" className="text-gray-300 hover:text-gray-100 transition">Features</a>
              <a href="#templates" className="text-gray-300 hover:text-gray-100 transition">Templates</a>
              <a href="#pricing" className="text-gray-300 hover:text-gray-100 transition">Pricing</a>
              <a href="/changelog" className="text-gray-300 hover:text-gray-100 transition">Changelog</a>
              <a href="/documentation" className="text-gray-300 hover:text-gray-100 transition">Documentation</a>
            </div>
            
            {/* SignupNow Button */}
            <div className="hidden md:block">
              <a href="/auth" className="border border-neutral-700 px-4 py-2 rounded-lg bg-gradient-to-r from-neutral-500 to-neutral-800 hover:bg-gradient-to-r hover:from-neutral-600 hover:to-neutral-900 hover:shadow-lg hover:shadow-neutral-900 transition-all duration-300 opacity-70 text-white text-sm">
                SignupNow
              </a>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={toggleMenu}
                className="text-white focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                </svg>
              </button>
            </div>
          </div>
        </nav>
          
        {/* Off-canvas Mobile menu */}
        <div className={`fixed inset-y-0 right-0 max-w-xs w-full bg-neutral-900 shadow-lg transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50 md:hidden`}>
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <span className="text-xl font-bold text-white">Menu</span>
              <button 
                onClick={toggleMenu}
                className="text-white focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-white py-2 border-b border-gray-800">Features</a>
              <a href="#templates" className="text-white py-2 border-b border-gray-800">Templates</a>
              <a href="#pricing" className="text-white py-2 border-b border-gray-800">Pricing</a>
              <a href="/changelog" className="text-white py-2 border-b border-gray-800">ChangeLog</a>
              <a href="/documentation" className="text-white py-2 border-b border-gray-800">Documentation</a>
            </div>
            
            <div className="mt-auto">
              <a href="/auth" className="block w-full text-center bg-gradient-to-r from-neutral-500 to-neutral-800 hover:from-neutral-600 hover:to-neutral-900 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-lg">
                SignupNow
              </a>
            </div>
            </div>
          </div>
          
        {/* Overlay for mobile menu */}
          {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={toggleMenu}
          ></div>
        )}
        
        {/* Hero Section - Modified to match the image layout */}
        <section className="px-12 pt-12 pb-8">
          <div className="container mx-auto">
            <div className="flex flex-col md:mx-[100px] md:mt-30 mt-32">
              <div className="text-xs cursor-default mb-4 bg-gradient-to-r from-neutral-500 to-neutral-800 text-white border border-neutral-700 w-fit h-fit px-5 py-1 rounded-full shine-effect">VORENTIUM PROJECT</div>
              
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
                className="text-4xl md:text-6xl font-sans font-semibold text-white leading-tight"
            >
                Design and create professional
                <br />invoice in minutes
            </motion.h1>
              
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-6 text-lg text-gray-300 max-w-xl"
            >
                Welcome to Ceyinvoice, the easiest way to create professional invoices.
                No credit card required.Totally free.Start Creating Invoices Now by signing up.
            </motion.p>
              
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-10 flex items-center space-x-4"
              >
                <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden">
                  <img src={logo} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <span className="text-white">Vorentium Designers | Forgin Designs</span>
            </motion.div>
            </div>
          </div>
        </section>
        
        {/* Dahboard Showcase Section */}
        <section className="px-6 py-16">
          <div className="container mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="max-w-[960px] md:h-[540px] mx-auto bg-gradient-to-r from-neutral-500 to-neutral-800 backdrop-blur-lg rounded-2xl shadow-2xl shadow-neutral-900 border border-neutral-500"
            >
              <img 
                src={dashboard} 
                alt="Invoice Builder Dashboard" 
                className="rounded-2xl w-full"
              />
            </motion.div>
            
            <div className="mt-8 md:px-[155px] flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">Ceyinvoice Invoice Builder, a<br />Customizable Invoice Builder</h2>
                <p className="mt-2 text-gray-400">Ceyinvoice is a customizable invoice builder that allows <br /> you to create professional invoices in minutes.<br></br>Also use it as a template to create your own invoice.</p>
                <a href="#" className="text-white inline-flex items-center mt-4">
                  Read about Ceyinvoice →
                </a>
                </div>
              
              <div className="mt-4 md:mt-0 flex items-center space-x-2">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full border-2 border-black bg-gray-800 overflow-hidden">
                    <img src={logo} alt="Collaborator" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-black bg-gray-800 overflow-hidden">
                    <img src={developer} alt="Collaborator" className="w-full h-full object-cover" />
                </div>
                </div>
                </div>
            </div>
          </div>
        </section>
        
        {/* Templates Carousel Section */}
        <section id="templates" className="px-6 py-16">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Invoice Templates</h2>
              <p className="mt-4 text-lg text-gray-300">Choose from professionally designed templates or create your own</p>
            </div>
            
            {/* Carousel Container */}
            <div className="relative max-w-6xl mx-auto">
              {/* Carousel Display */}
              <div className="overflow-hidden">
                <div className="flex transition-transform duration-500 ease-in-out" 
                     style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                  
                  {templates.map((template, index) => (
                    <div key={template.id} className="min-w-full px-4">
                      <div className="bg-gradient-to-r from-neutral-500/30 to-neutral-800/30 backdrop-blur-lg rounded-2xl p-6 border border-neutral-600 shadow-xl">
                        <div className="flex flex-col md:flex-row gap-8">
                          <div className="md:w-1/2">
                            <div className="rounded-xl overflow-hidden shadow-lg border border-neutral-600">
                              <img 
                                src={template.image} 
                                alt={template.name} 
                                className="w-full h-auto"
                              />
                </div>
                </div>
                          <div className="md:w-1/2 flex flex-col justify-center">
                            <h3 className="text-2xl font-bold text-white mb-4">{template.name}</h3>
                            <p className="text-gray-300 mb-6">{template.description}</p>
                            <div className="flex flex-col sm:flex-row gap-3">
                              <button className="bg-gradient-to-r from-neutral-500 to-neutral-800 hover:from-neutral-600 hover:to-neutral-900 text-white px-6 py-2 rounded-lg transition-all duration-300 shadow-lg cursor-pointer">
                                Download Template
                              </button>
                              <button className="border border-neutral-600 text-white px-6 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 cursor-pointer">
                                Apply to Your Invoice
                              </button>
                </div>
            </div>
            </div>
          </div>
            </div>
                  ))}
                  
                </div>
                </div>
              
              {/* Add Line Indicators */}
              <div className="flex justify-center mt-6 space-x-1">
                {templates.map((_, index) => (
                  <div 
                    key={index}
                    className={`h-[3px] ${currentSlide === index 
                      ? 'w-16 bg-white' 
                      : 'w-8 bg-gray-700'} 
                      transition-all duration-300`}
                  />
                ))}
                </div>
            </div>
          </div>
        </section>
          
        {/* Features Section */}
        <section id="features" className="px-6 py-24 bg-black-transparent-0">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Powerful Features, Effortlessly Simple</h2>
              <p className="mt-4 text-lg text-gray-400">Everything you need to streamline your invoicing process.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[ // Array of features
                {
                  icon: <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>,
                  title: "Custom Templates",
                  description: "Design beautiful, professional invoices with our intuitive template creator."
                },
                {
                  icon: <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>,
                  title: "Client Management",
                  description: "Keep track of your clients, their details, and transaction history seamlessly."
                },
                {
                  icon: <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>,
                  title: "Insightful Dashboard",
                  description: "Get a clear overview of your finances with analytics on revenue and payments."
                },
                {
                  icon: <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
                  title: "Time Saving",
                  description: "Automate recurring invoices and payment reminders to save valuable time."
                }
              ].map((feature, index) => (
              <motion.div 
                  key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 backdrop-blur-sm rounded-xl p-6 border border-neutral-700 shadow-lg hover:shadow-neutral-700/20 transition-shadow duration-300 flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-neutral-500 to-neutral-700 flex items-center justify-center mb-6 shadow-md">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Creator studio Showcase Section */}
        <section className="px-6 py-16">
          <div className="container mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="max-w-[960px] md:h-[540px] mx-auto bg-gradient-to-r from-neutral-500 to-neutral-800 backdrop-blur-lg rounded-2xl shadow-2xl shadow-neutral-900 border border-neutral-500"
            >
              <img 
                src={creator_studio} 
                alt="Invoice Builder Dashboard" 
                className="rounded-2xl w-full"
              />
            </motion.div>
            
            <div className="mt-8 md:px-[155px] flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">Creator Studio, A<br />Customizable Template Creator</h2>
                <p className="mt-2 text-gray-400">Creator Studio allowd to create stunning templates designs for your invoices.<br />To Know more about how to create templates and how to use it <a href="/help" className="text-white">click here</a>.</p>
                <a href="/creator-studio" className="text-white inline-flex items-center mt-4">
                  Try Creator Studio →
                    </a>
                  </div>
              
              <div className="mt-4 md:mt-0 flex items-center space-x-2">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full border-2 border-black bg-gray-800 overflow-hidden">
                    <img src={logo} alt="Collaborator" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-black bg-gray-800 overflow-hidden">
                    <img src={developer} alt="Collaborator" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Pricing Section - Modern Single Plan */}
        <section id="pricing" className="px-6 py-24">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Simple, Transparent Pricing</h2>
              <p className="mt-4 text-lg text-gray-400">Start for free, forever. No credit card needed.</p>
            </div>
            
              <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-neutral-800/60 to-neutral-900/70 backdrop-blur-lg rounded-2xl p-8 md:p-12 border border-neutral-700 shadow-2xl shadow-neutral-900/30 relative overflow-hidden"
            >
              {/* Subtle decorative element */}
              <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-neutral-600/10 to-transparent rounded-full blur-3xl -translate-x-1/4 -translate-y-1/4 opacity-50"></div>

              <div className="flex flex-col md:flex-row justify-between items-center relative z-10">
                {/* Plan Details */}
                <div className="md:w-2/3 mb-8 md:mb-0">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Free Forever Plan</h3>
                  <p className="text-gray-300 mb-6">All the essential features to manage your invoices like a pro.</p>
                  
                  <ul className="space-y-3">
                    {[ // List of features
                      "Unlimited Invoices",
                      "Unlimited Clients",
                      "Customizable Templates",
                      "PDF Export & Sharing",
                      "Secure Data Storage"
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-300">
                        <svg className="w-5 h-5 text-emerald-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Price & CTA */}
                <div className="text-center md:text-right">
                  <p className="text-6xl font-bold text-white mb-1">$0</p>
                  <p className="text-gray-400 mb-6">Per Month</p>
                  
                  <a 
                    href="/auth" 
                    className="inline-block bg-gradient-to-r from-neutral-500 to-neutral-800 hover:from-neutral-600 hover:to-neutral-900 text-white px-10 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-neutral-700/30 text-lg font-semibold"
                  >
                    Get Started Free
                  </a>
                </div>
              </div>
              </motion.div>
          </div>
        </section>
        
        {/* Newsletter Section - Updated for Ceyinvoice */}
        <section className="px-6 py-24">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white">Stay Updated with Ceyinvoice</h2>
              <p className="mt-4 text-gray-400">
                Get the latest news, feature updates, and invoicing tips delivered <br /> straight to your inbox. No spam, ever.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-2 justify-center">
                <input
                  type="email"
                  placeholder="Email"
                  className="px-4 py-2 bg-neutral-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-500"
                />
                <button className="bg-gradient-to-r from-neutral-500 to-neutral-800 hover:from-neutral-600 hover:to-neutral-900 text-white px-6 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </section>
      
        {/* Updated Footer for Ceyinvoice */}
        <footer className="px-6 py-12 bg-neutral-950 border-t border-neutral-800">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              {/* Branding */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">CEYINVOICE</h3>
                <p className="text-gray-400 text-sm">
                  Effortless invoicing for modern businesses. Create professional invoices in minutes, completely free.
                </p>
                {/* Add social icons if needed here */}
              </div>
              
              {/* Product Links */}
              <div>
                <h4 className="text-white font-semibold mb-4">Product</h4>
                <ul className="space-y-2">
                  <li><a href="#features" className="text-gray-400 hover:text-white transition text-sm">Features</a></li>
                  <li><a href="#templates" className="text-gray-400 hover:text-white transition text-sm">Templates</a></li>
                  <li><a href="#pricing" className="text-gray-400 hover:text-white transition text-sm">Pricing</a></li>
                  <li><a href="/documentation" className="text-gray-400 hover:text-white transition text-sm">Documentation</a></li>
                </ul>
              </div>
              
              {/* Company Links */}
              <div>
                <h4 className="text-white font-semibold mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><a href="/changelog" className="text-gray-400 hover:text-white transition text-sm">Changelog</a></li>
                  <li><a href="/help" className="text-gray-400 hover:text-white transition text-sm">Contact Us</a></li>
                </ul>
              </div>
              
              {/* Legal Links */}
              <div>
                <h4 className="text-white font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="/privacy" className="text-gray-400 hover:text-white transition text-sm">Privacy Policy</a></li>
                  <li><a href="/terms" className="text-gray-400 hover:text-white transition text-sm">Terms of Service</a></li>
                </ul>
              </div>
            </div>
            
            {/* Copyright */}
            <div className="mt-8 pt-8 border-t border-neutral-800 text-center">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} CEYINVOICE by Vorentium. All rights reserved.
    </p>
  </div>
</div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;