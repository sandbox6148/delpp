import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

interface TooltipProps {
  content: string;
  title?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, title }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block ml-2 align-middle">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-blue-500 hover:text-blue-700 transition-colors focus:outline-none"
        aria-label="Information"
      >
        <Info size={18} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-64 p-4 mt-2 -ml-32 text-sm text-left bg-white border border-blue-100 rounded-lg shadow-xl md:left-full md:top-auto md:ml-2 md:-mt-4">
          <div className="flex justify-between items-start mb-2">
            {title && <h4 className="font-semibold text-blue-900">{title}</h4>}
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          </div>
          <p className="text-gray-600 leading-relaxed">
            {content}
          </p>
          <div className="absolute w-3 h-3 bg-white border-l border-t border-blue-100 transform -rotate-45 -top-1.5 left-1/2 md:left-0 md:top-4 md:-ml-1.5 md:rotate-45"></div>
        </div>
      )}
    </div>
  );
};