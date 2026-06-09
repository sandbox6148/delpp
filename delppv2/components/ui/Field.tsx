import React from 'react';

interface FieldProps {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Field: React.FC<FieldProps> = ({ label, hint, required, children, className = '' }) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <label className="block text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
      {hint && (
        <span title={hint} className="cursor-help text-blue-400 ml-1 font-normal">ⓘ</span>
      )}
    </label>
    {children}
  </div>
);

// Classe canonique pour tous les inputs texte
export const inputClass = 'w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors';
// Classe pour les montants €
export const amountClass = `${inputClass} text-right pr-8 font-mono text-lg`;
// Classe pour les selects
export const selectClass = `block ${inputClass} bg-white`;

interface AmountFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (v: number) => void;
  required?: boolean;
  className?: string;
}

export const AmountField: React.FC<AmountFieldProps> = ({ label, hint, value, onChange, required, className }) => (
  <Field label={label} hint={hint} required={required} className={className}>
    <div className="relative">
      <input
        type="number"
        min={0}
        step={0.01}
        value={value || ''}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        className={amountClass}
        placeholder="0,00"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
    </div>
  </Field>
);

interface CheckboxFieldProps {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  className?: string;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({ label, hint, checked, onChange, className = '' }) => (
  <label className={`flex items-start gap-3 p-4 rounded border border-gray-200 hover:bg-gray-50 cursor-pointer ${className}`}>
    <input
      type="checkbox"
      checked={checked}
      onChange={e => onChange(e.target.checked)}
      className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
    />
    <div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {hint && <p className="text-xs text-gray-500 mt-0.5">{hint}</p>}
    </div>
  </label>
);
