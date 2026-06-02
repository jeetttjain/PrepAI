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
        {/* Shield boundary - Premium Indigo brand color */}
        <path 
          d="M50 12 C68 12, 76 12, 81 20 C81 42, 78 59, 50 82 C22 59, 19 42, 19 20 C24 12, 32 12, 50 12 Z" 
          stroke="#6366f1" 
          strokeWidth="7" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        
        {/* Letter P shape - Modern Sky Blue accent color */}
        <path 
          d="M45 28v32 M45 30h10c5 0 9 4 9 9s-4 9-9 9h-10" 
          stroke="#38bdf8" 
          strokeWidth="7" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        
        {/* Up-Right pointing Arrow cutting through P - Sky Blue accent */}
        <path 
          d="M32 58 L54 36" 
          stroke="#38bdf8" 
          strokeWidth="7" 
          strokeLinecap="round" 
        />
        <path 
          d="M44 35 H55 V46" 
          stroke="#38bdf8" 
          strokeWidth="7" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </svg>
      {showText && (
        <span className={`text-white font-bold text-base tracking-tight ${textClassName}`}>
          PrepAI
        </span>
      )}
    </div>
  );
}
