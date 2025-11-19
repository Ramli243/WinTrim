import React from 'react';
import { SelectOption } from '../types';

interface SingingStyleSelectorProps {
  styles: SelectOption[];
  selectedStyle: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled: boolean;
}

const SingingStyleSelector: React.FC<SingingStyleSelectorProps> = ({ styles, selectedStyle, onChange, disabled }) => {
  return (
    <div className={`transition-all duration-300 ${disabled ? 'opacity-50' : ''}`}>
      <label htmlFor="singing-style-selector" className="block text-sm font-medium text-slate-300 mb-2">
        Singing Style
      </label>
      <div className="relative">
        <select
          id="singing-style-selector"
          value={selectedStyle}
          onChange={onChange}
          disabled={disabled}
          title="Choose a musical style for the singing voice."
          className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {styles.map((style) => (
            <option key={style.value} value={style.value}>
              {style.name}
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

export default SingingStyleSelector;