import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function FormInput({ label, error, ...props }: FormInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-secondary mb-2">
        {label}
      </label>
      <div className="mt-1">
        <input
          {...props}
          className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-text-secondary bg-background text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${
            error ? 'border-red-900' : 'border-gray-800'
          }`}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-error">{error}</p>
      )}
    </div>
  );
}