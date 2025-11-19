import React from 'react';

interface ErrorMessageProps {
  title?: string;
  message: string;
}

const ErrorIcon: React.FC<{className?: string}> = ({ className = 'h-5 w-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.982 6.018a.75.75 0 0 0-1.464.266l.268 4.5a.75.75 0 0 0 1.464-.266l-.268-4.5ZM9 13.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
    </svg>
);

const ErrorMessage: React.FC<ErrorMessageProps> = ({ title = 'An Error Occurred', message }) => {
  return (
    <div 
      role="alert" 
      className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm rounded-lg p-4 flex gap-3 animate-fade-in"
    >
      <div className="flex-shrink-0 text-red-400 pt-0.5">
        <ErrorIcon />
      </div>
      <div>
        <h3 className="font-semibold text-red-200">{title}</h3>
        <p className="mt-1">{message}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;
