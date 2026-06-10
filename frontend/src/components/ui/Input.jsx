import React from 'react';

export const Input = React.forwardRef(({ label, error, type = 'text', className = '', ...props }, ref) => {
  return (
    <div className="w-full mb-4">
      {label && (
        <label className="block text-sm font-semibold text-navy mb-1.5 text-left">
          {label}
        </label>
      )}
      <input
        type={type}
        ref={ref}
        className={`w-full px-4 py-2.5 bg-white border rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange transition-all duration-200 text-sm ${
          error ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-[#E0E0E0]'
        } ${className}`}
        {...props}
      />
      {error && (
        <span className="block mt-1 text-xs text-red-600 text-left font-medium">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
