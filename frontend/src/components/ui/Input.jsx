import React from 'react';

const Input = ({ 
  label, 
  error, 
  icon: Icon, 
  className = '', 
  id,
  type = 'text',
  ...props 
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-text-secondary">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          id={id}
          type={type}
          className={`w-full bg-white border ${
            error ? 'border-red-500' : 'border-gray-200'
          } rounded-lg ${
            Icon ? 'pl-10' : 'pl-4'
          } pr-4 py-2.5 text-text-primary placeholder-gray-400 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10`}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default Input;
