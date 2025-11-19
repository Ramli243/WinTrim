import React from 'react';
import { SelectOption } from '../types';

interface AccentSelectorProps {
  accents: SelectOption[];
  selectedAccent: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled: boolean;
}

const AccentSelector: React.FC<AccentSelectorProps> = ({ accents, selectedAccent, onChange, disabled }) => {
  if (accents.length <= 1) {
    return (
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Accent
        </label>
        <div 
          className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg py-2 px-3 text-slate-400"
          title="No other accents available for this language."
        >
          Default
        </div>
      </div>
    );
  }

  return (
    <div>
      <label htmlFor="accent-selector" className="block text-sm font-medium text-slate-300 mb-2">
        Accent
      </label>
      <div className="relative">
        <select
          id="accent-selector"
          value={selectedAccent}
          onChange={onChange}
          disabled={disabled}
          title="Choose a regional accent for the selected language."
          className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {accents.map((accent) => (
            <option key={accent.value} value={accent.value}>
              {accent.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AccentSelector;