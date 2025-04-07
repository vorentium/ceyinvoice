import React from 'react';
import { Link } from 'react-router-dom';
import SocialButton from '../atoms/SocialButton';
import StartFreeButton from '../atoms/StartFreeButton';


function Footer() {
  const socialLinks = [
    { platform: 'github', link: 'https://github.com/JuvIxor' },
    { platform: 'facebook', link: 'https://facebook.com/sanju.dev.5' },
    { platform: 'instagram', link: 'https://instagram.com/sanjuna_dev05' },
    { platform: 'twitter', link: 'https://x.com/sanju_dev' }
  ];

  const quickLinks = [
    { name: 'Home', path: '/#home' },
    { name: 'Features', path: '/#features' },
    { name: 'Create Invoice', path: '/creator-studio' },
    { name: 'How it Works', path: '/#how-it-works' },
    { name: 'Benefits', path: '/#benefits' },
    { name: 'FAQS', path: '/#faqs' },
    { name: 'License', path: '/license' }
  ];

  // Gradient style for the CEY logo
  const ceyLogoStyle = {
    opacity: 0.4,
    background: `linear-gradient(to bottom, var(--color-primary) 20%, black 50%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    MozBackgroundClip: 'text',
    MozTextFillColor: 'transparent',
  };

  return (
    <footer className="bg-var-primary text-white py-12 px-6 md:px-12 relative overflow-hidden">
      <div className="container mx-auto relative z-10">
        {/* Top Section with Heading and CTA Button */}
        <div className="mb-16">
          <div className="flex flex-wrap items-center">
            <span className="text-2xl md:text-3xl lg:text-7xl font-normal mr-4">GET STARTED WITH FREE AI</span>
            <span className="text-2xl md:text-3xl lg:text-7xl font-normal mr-4">INVOICING TODAY</span>
            <StartFreeButton />
          </div>
        </div>
        
        {/* Middle Section with Quick Links, Social Links and Logo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Mobile view for Quick Links and Connect With Us - shown only on small screens */}
          <div className="block md:hidden col-span-1">
            {/* Quick Links Header */}
            <h3 className="text-xl font-bold mb-4 text-center">Quick Links</h3>
            
            {/* Links List */}
            <ul className="space-y-2 mb-8">
              {quickLinks.map((link, index) => (
                <li key={index} className="text-center">
                  <Link to={link.path} className="text-white hover:underline">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Connect With Us Header */}
            <h3 className="text-xl font-bold mb-4 text-center">Connect With Us</h3>
            
            {/* Social Buttons */}
            <div className="flex flex-col items-center gap-2">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.link}
                  className="bg-white text-black rounded-full py-2 px-4 w-full max-w-[200px] text-center font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.platform === 'github' ? 'GitHub' : 
                   social.platform === 'facebook' ? 'Facebook' : 
                   social.platform === 'instagram' ? 'Instagram' : 
                   social.platform === 'twitter' ? 'X - sanju_dev' : social.platform}
                </a>
              ))}
            </div>
            
            {/* Mobile CEY Logo */}
            <div className="flex justify-center mt-8">
              <div className="text-[100px] font-bold leading-none font-jersey" style={ceyLogoStyle}>
                CEY
              </div>
            </div>
          </div>
          
          {/* Desktop view - hidden on small screens */}
          <div className="hidden md:block">
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className="text-white hover:underline">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="hidden md:block">
            <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
            <div className="space-y-3 max-w-[200px]">
              {socialLinks.map((social, index) => (
                <SocialButton
                  key={index}
                  platform={social.platform}
                  link={social.link}
                />
              ))}
            </div>
          </div>
          
          {/* CEY Logo Column */}
          <div className="hidden md:flex items-center justify-center">
            <div className="text-[320px] font-bold leading-none font-jersey cursor-pointer" style={ceyLogoStyle}>
              CEY
            </div>
          </div>
        </div>
        
        {/* Copyright Section */}
        <div className="text-center mt-16">
          <p>© {new Date().getFullYear()} CEYINVOICE. All Rights Reserved.</p>
          <p className='mt-2'>Design and Developed by <a href="https://www.instagram.com/sanju_dev05" className="text-white hover:underline border-2 pt-1 pb-1 pl-2 pr-2 rounded-full border-white">Sanju Dev</a></p>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 