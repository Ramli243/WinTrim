import React from 'react';

interface SingingModeToggleProps {
  isSinging: boolean;
  onChange: (isSinging: boolean) => void;
  disabled: boolean;
}

const SingingModeToggle: React.FC<SingingModeToggleProps> = ({ isSinging, onChange, disabled }) => {
  const toggleId = 'singing-mode-toggle';
  return (
    <div className={`transition-opacity duration-200 ${disabled ? 'opacity-50' : ''}`}>
      <div 
        className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3"
        title="Enable to make the AI sing the text instead of speaking."
      >
        <div>
          <label htmlFor={toggleId} className="font-medium text-white cursor-pointer select-none">
            Singing Mode
          </label>
          <p className="text-xs text-slate-400 select-none">Experimental: Turn text into a simple song.</p>
        </div>
        <button
          id={toggleId}
          type="button"
          role="switch"
          aria-checked={isSinging}
          onClick={() => !disabled && onChange(!isSinging)}
          disabled={disabled}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 ${
            isSinging ? 'bg-blue-500' : 'bg-slate-600'
          }`}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isSinging ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default SingingModeToggle;