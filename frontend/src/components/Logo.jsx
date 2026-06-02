import React from 'react';

export default function Logo({ size = 28, className = '', showText = false, textClassName = '' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-110"
      >
        {/* Main letter 'P' shape with smooth rounded joints - Solid Indigo */}
        <path d="M30 18v64" stroke="#6366f1" strokeWidth="8.5" strokeLinecap="round" />
        <path d="M30 20h28c11.5 0 21 9.5 21 21s-9.5 21-21 21H30" stroke="#6366f1" strokeWidth="8.5" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Sleek four-point sparkle overlay on the loop's outer edge - Solid Violet/Purple */}
        <circle cx="70" cy="45" r="4.5" fill="#8b5cf6" />
        <path d="M70 33v24 M58 45h24" stroke="#8b5cf6" strokeWidth="3.5" strokeLinecap="round" />
        
        {/* Dynamic checkmark beneath the loop, completing the success theme - Solid Indigo */}
        <path d="M54 60l12 12 16-16" stroke="#6366f1" strokeWidth="8.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {showText && (
        <span className={`text-white font-bold text-base tracking-tight ${textClassName}`}>
          PrepAI
        </span>
      )}
    </div>
  );
}
