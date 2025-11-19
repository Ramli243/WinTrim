import React from 'react';
import { Preset } from '../types';

interface PresetManagerProps {
  presets: Preset[];
  activePresetId: string;
  onSelect: (presetId: string) => void;
  onSave: () => void;
  onDelete: () => void;
  disabled: boolean;
}

const TrashIcon: React.FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 1 0 .53 1.405A18.06 18.06 0 0 1 10 6.002c1.606 0 3.16.204 4.685.603a.75.75 0 1 0 .53-1.405 19.592 19.592 0 0 0-2.365-.468v-.443A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 7.5c-1.933 0-3.5 1.567-3.5 3.5s1.567 3.5 3.5 3.5 3.5-1.567 3.5-3.5-1.567-3.5-3.5-3.5Z" clipRule="evenodd" />
        <path d="M3 10a7 7 0 1 1 14 0 7 7 0 0 1-14 0Zm1.042-.35a5.5 5.5 0 0 0 9.916 0H4.042Z" />
    </svg>
);

const PresetManager: React.FC<PresetManagerProps> = ({ presets, activePresetId, onSelect, onSave, onDelete, disabled }) => {
  const isPresetSelected = activePresetId !== 'custom';
  
  return (
    <div className="bg-slate-700/50 rounded-lg p-3">
      <label htmlFor="preset-selector" className="block text-sm font-medium text-slate-300 mb-2">
        Presets
      </label>
      <div className="flex items-center gap-2">
        <div className="relative flex-grow">
          <select
            id="preset-selector"
            value={activePresetId}
            onChange={(e) => onSelect(e.target.value)}
            disabled={disabled}
            title="Load a saved preset or select 'Custom Settings' to make changes."
            className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="custom">Custom Settings</option>
            {presets.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
        {isPresetSelected && (
            <button
                onClick={onDelete}
                disabled={disabled}
                className="flex-shrink-0 p-2 text-slate-400 bg-slate-700 hover:bg-red-500/20 hover:text-red-400 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Delete selected preset"
                title="Delete preset"
            >
                <TrashIcon />
            </button>
        )}
        <button
          onClick={onSave}
          disabled={disabled}
          title="Save the current settings as a new preset."
          className="flex-shrink-0 bg-slate-600 hover:bg-slate-500 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          Save Current...
        </button>
      </div>
    </div>
  );
};

export default PresetManager;