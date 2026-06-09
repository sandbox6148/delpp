import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-100 ${className}`}>
    {children}
  </div>
);

interface SectionTitleProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
  separator?: boolean;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ icon, children, separator = false }) => (
  <h2 className={`text-xl font-bold text-gray-800 flex items-center gap-2 ${separator ? 'mb-6 border-b pb-2 font-semibold' : 'mb-4'}`}>
    {icon && <span className="text-blue-600">{icon}</span>}
    {children}
  </h2>
);
