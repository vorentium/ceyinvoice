import React from 'react';
import TestimonialCard from '../atoms/TestimonialCard';
import avatar6 from "../../assets/images/avatars/avatar6.jpeg";
import avatar7 from "../../assets/images/avatars/avatar7.jpeg";
import avatar8 from "../../assets/images/avatars/avatar8.jpeg";
import avatar9 from "../../assets/images/avatars/avatar9.jpeg";
import avatar10 from "../../assets/images/avatars/avatar10.jpeg";
// Updated profile pictures from local assets
const profilePics = {
  jamesT: avatar6,
  michaelR: avatar7,
  priyaK: avatar8,
  davidL: avatar9,
  emilyW: avatar10,
};

const topRowData = [
  {
    id: 1,
    name: 'James T.',
    role: 'Consultant',
    text: '"AI-powered invoicing is the future! This platform integrates perfectly with my accounting tools, making financial management stress-free."',
    avatar: profilePics.jamesT
  },
  {
    id: 2,
    name: 'Michael R.',
    role: 'Small Business Owner',
    text: '"Seamless and efficient! The automation features are a game changer. I no longer worry about manual errors or late payments."',
    avatar: profilePics.michaelR
  },
  {
    id: 3,
    name: 'Priya K.',
    role: 'E-commerce Entrepreneur',
    text: '"Best invoicing software I\'ve used. I love the customizable templates and instant payment tracking. Highly recommend!"',
    avatar: profilePics.priyaK
  },
  {
    id: 4,
    name: 'David L.',
    role: 'Freelance Developer',
    text: '"This software has completely transformed how I handle invoices. The automated reminders have improved my cash flow tremendously."',
    avatar: profilePics.davidL
  },
  {
    id: 5,
    name: 'Emily W.',
    role: 'Marketing Agency Owner',
    text: '"The customization options are impressive. I can match invoices to my brand and the client portal is a huge time-saver."',
    avatar: profilePics.emilyW
  }
];

function TopRowTestimonials() {
  // Duplicate items to create seamless infinite scroll effect
  const duplicatedItems = [...topRowData, ...topRowData];
  
  return (
    <div className="overflow-hidden w-full py-3 relative">
      <div className="flex animate-marquee-right gap-2" style={{ animationDuration: '80s' }}>
        {duplicatedItems.map((testimonial, index) => (
          <TestimonialCard 
            key={`top-${testimonial.id}-${index}`}
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

export default TopRowTestimonials; 