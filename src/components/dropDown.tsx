import { ChevronDown } from 'lucide-react';

interface DropDownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface DropDownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropDownOption[];
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  required?: boolean;
}

export default function DropDown({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  label,
  disabled = false,
  error,
  className = '',
  required = false
}: DropDownProps) {
  const selectId = `dropdown-${Math.random().toString(36).substr(2, 9)}`;

  const selectClassName = `
    w-full px-4 py-3 pr-10 rounded-lg
    bg-slate-700 border border-slate-600
    text-white
    appearance-none
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    disabled:opacity-50 disabled:cursor-not-allowed
    transition
    ${error ? 'border-red-500 focus:ring-red-500' : ''}
  `;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-slate-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required={required}
          className={selectClassName}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </div>
      </div>
      
      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}
    </div>
  );
}

export type { DropDownOption, DropDownProps };
