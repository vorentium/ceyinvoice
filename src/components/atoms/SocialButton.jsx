import React from 'react';

function SocialButton({ platform, link, icon, username }) {
  const getDisplayText = () => {
    switch (platform) {
      case 'github':
        return 'GitHub';
      case 'facebook':
        return 'Facebook';
      case 'instagram':
        return 'Instagram';
      case 'twitter':
        return 'X - sanju_dev';
      default:
        return platform;
    }
  };
  
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center bg-white text-black py-2 px-6 font-medium rounded-full text-sm hover:bg-gray-100 transition-all duration-300 w-full"
    >
      {getDisplayText()}
    </a>
  );
}

export default SocialButton; 