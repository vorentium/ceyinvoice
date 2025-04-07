import React from 'react';
import TestimonialCard from '../atoms/TestimonialCard';
import avatar1 from "../../assets/images/avatars/avatar1.png";
import avatar2 from "../../assets/images/avatars/avatar2.png";
import avatar3 from "../../assets/images/avatars/avatar3.png";
import avatar4 from "../../assets/images/avatars/avatar4.png";
import avatar5 from "../../assets/images/avatars/avatar5.png";  

// Updated profile pictures from local assets
const profilePics = {
  sarahM: avatar1,
  sarahJ: avatar2,
  thomasH: avatar3,
  rajP: avatar4,
  oliviaK: avatar5,
};

const bottomRowData = [
  {
    id: 1,
    name: 'Sarah M.',
    role: 'Freelance Designer',
    text: '"Invoicing has never been this easy! This AI-powered tool saves me hours every week. My invoices look professional, and I get paid faster!"',
    avatar: profilePics.sarahM
  },
  {
    id: 2,
    name: 'Sarah J.',
    role: 'Freelance Designer',
    text: '"Invoicing has never been this easy! This AI-powered tool saves me hours every week. My invoices look professional, and I get paid faster!"',
    avatar: profilePics.sarahJ
  },
  {
    id: 3,
    name: 'Thomas H.',
    role: 'Photographer',
    text: '"As a photographer, I need to send invoices on the go. This mobile-friendly platform lets me create professional invoices from anywhere."',
    avatar: profilePics.thomasH
  },
  {
    id: 4,
    name: 'Raj P.',
    role: 'IT Consultant',
    text: '"The recurring invoice feature is a lifesaver for my retainer clients. Set it once and forget it - payments come in automatically!"',
    avatar: profilePics.rajP
  },
  {
    id: 5,
    name: 'Olivia K.',
    role: 'Bookkeeper',
    text: '"As a bookkeeper, I appreciate the detailed reporting and tax calculation features. Makes tax season so much easier for my clients."',
    avatar: profilePics.oliviaK
  }
];

function BottomRowTestimonials() {
  // Duplicate items to create seamless infinite scroll effect
  const duplicatedItems = [...bottomRowData, ...bottomRowData];
  
  return (
    <div className="overflow-hidden w-full py-3 relative">
      <div className="flex animate-marquee-left gap-2" style={{ animationDuration: '80s' }}>
        {duplicatedItems.map((testimonial, index) => (
          <TestimonialCard 
            key={`bottom-${testimonial.id}-${index}`}
            name={testimonial.name}
            role={testimonial.role}
            text={testimonial.text}
            avatarSrc={testimonial.avatar}
          />
        ))}
      </div>
    </div>
  );
}

export default BottomRowTestimonials; 