import React from 'react';
import { VoiceOption } from '../types';

interface VoiceSelectorProps {
  voices: VoiceOption[];
  selectedVoice: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

const MaleIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm-4.25 5.5a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M3.165 4.055a.75.75 0 0 1 .488-.732A7.5 7.5 0 0 1 10 3a7.5 7.5 0 0 1 6.347.323.75.75 0 0 1 .488.732l.006.02a6.75 6.75 0 0 1-13.682 0l.006-.02ZM10 18a6 6 0 0 0 6-6H4a6 6 0 0 0 6 6Z" clipRule="evenodd" />
  </svg>
);

const FemaleIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm-4.25 5.5a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z" clipRule="evenodd" />
    <path d="M3.003 10.333A5.996 5.996 0 0 1 7.25 6.5h5.5a5.996 5.996 0 0 1 4.247 3.833.75.75 0 0 1-1.299.752A4.496 4.496 0 0 0 12.75 8h-5.5a4.496 4.496 0 0 0-3.947 2.337.75.75 0 0 1-1.3-.754Z" />
  </svg>
);


const VoiceSelector: React.FC<VoiceSelectorProps> = ({ voices, selectedVoice, onChange, disabled }) => {
  return (
    <div>
      <label id="voice-label" className="block text-sm font-medium text-slate-300 mb-2">
        Choose a Voice
      </label>
      <div 
        role="radiogroup" 
        aria-labelledby="voice-label"
        className={`grid grid-cols-2 sm:grid-cols-3 gap-3 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {voices.map((voice) => {
          const isSelected = selectedVoice === voice.value;
          return (
            <button
              key={voice.value}
              role="radio"
              aria-checked={isSelected}
              onClick={() => !disabled && onChange(voice.value)}
              disabled={disabled}
              title={`${voice.name}: ${voice.description}`}
              className={`text-left p-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500
                ${isSelected ? 'bg-slate-700 border-blue-500' : 'bg-slate-800 border-slate-700 hover:bg-slate-700/50 hover:border-slate-600'}`}
            >
              <div className="flex items-center gap-2 mb-1 text-slate-400">
                {voice.gender === 'male' ? <MaleIcon /> : <FemaleIcon />}
                <span className="text-sm">{voice.description}</span>
              </div>
              <p className="font-semibold text-white">{voice.name}</p>
            </button>
          )
        })}
      </div>
    </div>
  );
};

export default VoiceSelector;