import React from 'react';

function TestimonialCard({ name, role, text, avatarSrc }) {
  return (
    <div className="testimonial-card bg-white rounded-3xl p-5 shadow-sm mx-3 flex flex-col max-w-[900px] min-w-[400px] min-h-[160px]" style={{ border: '2px solid #f0520e' }}>
      <div className="flex items-center mb-2">
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
          <img 
            src={avatarSrc || `https://ui-avatars.com/api/?name=${name}&background=random`} 
            alt={`${name}'s avatar`} 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="font-bold text-black text-base">— {name}</p>
          <p className="text-sm text-gray-700">{role}</p>
        </div>
      </div>
      <div className="flex mb-2">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
      </div>
      <p className="text-black text-sm font-medium flex-grow overflow-hidden line-clamp-3">{text}</p>
    </div>
  );
}

export default TestimonialCard; 