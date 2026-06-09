import React from 'react';
import { Plus } from 'lucide-react';

interface AddButtonProps {
  label: string;
  onClick: () => void;
  color?: 'blue' | 'purple' | 'orange' | 'green' | 'pink';
}

const colorMap = {
  blue:   'border-blue-300   text-blue-700   hover:bg-blue-50',
  purple: 'border-purple-300 text-purple-700 hover:bg-purple-50',
  orange: 'border-orange-300 text-orange-700 hover:bg-orange-50',
  green:  'border-green-300  text-green-700  hover:bg-green-50',
  pink:   'border-pink-300   text-pink-700   hover:bg-pink-50',
};

export const AddButton: React.FC<AddButtonProps> = ({ label, onClick, color = 'blue' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full py-4 bg-white border-2 border-dashed rounded-lg transition-colors flex items-center justify-center gap-2 font-medium text-sm ${colorMap[color]}`}
  >
    <Plus size={18} />
    {label}
  </button>
);

interface EmptyStateProps {
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message }) => (
  <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-sm italic">
    {message}
  </div>
);
