
import React, { useState } from 'react';
import { SelectOption } from '../types';

interface AdvancedSettingsProps {
  timbre: number;
  onTimbreChange: (value: number) => void;
  speakingRate: number;
  onSpeakingRateChange: (value: number) => void;
  emotion: string;
  onEmotionChange: (value: string) => void;
  emotions: SelectOption[];
  stylePrompt: string;
  onStylePromptChange: (value: string) => void;
  disabled: boolean;
}

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
    </svg>
);

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  timbre,
  onTimbreChange,
  speakingRate,
  onSpeakingRateChange,
  emotion,
  onEmotionChange,
  emotions,
  stylePrompt,
  onStylePromptChange,
  disabled,
}) => {
  const [openSetting, setOpenSetting] = useState<string | null>(null);

  const handleToggleSetting = (setting: string) => {
    setOpenSetting(prev => (prev === setting ? null : setting));
  };

  const formattedTimbre = timbre > 0 ? `+${timbre}` : timbre;

  return (
    <div 
        id="advanced-settings-panel" 
        className={`bg-slate-700/50 rounded-lg transition-opacity duration-300 ${disabled ? 'opacity-50' : ''}`}
        aria-label="Advanced Settings"
    >
      <div className="divide-y divide-slate-600/50">
          {/* Timbre Accordion Item */}
          <div>
            <button
              onClick={() => handleToggleSetting('timbre')}
              disabled={disabled}
              className="w-full flex justify-between items-center p-3 text-left focus:outline-none focus-visible:bg-slate-700/30 hover:bg-slate-700/20 disabled:hover:bg-transparent"
              aria-expanded={openSetting === 'timbre'}
              aria-controls="timbre-controls"
            >
              <span className="text-sm font-medium text-slate-300">Vocal Timbre</span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono bg-slate-700 text-slate-300 px-2 py-0.5 rounded">{formattedTimbre}</span>
                <ChevronDownIcon className={`transition-transform duration-200 text-slate-400 ${openSetting === 'timbre' ? 'rotate-180' : ''}`} />
              </div>
            </button>
            {openSetting === 'timbre' && (
              <div id="timbre-controls" className="px-4 pb-4 animate-fade-in">
                <div className="flex items-center gap-4">
                   <span className="text-xs text-slate-400">Deeper</span>
                    <input
                      id="timbre-slider"
                      type="range" min="-5" max="5" step="1"
                      value={timbre}
                      onChange={(e) => onTimbreChange(Number(e.target.value))}
                      disabled={disabled}
                      title="Adjust the vocal timbre. Deeper values create a more resonant sound, brighter values make it clearer."
                      className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed
                                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500
                                 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:active:scale-125
                                 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
                    />
                    <span className="text-xs text-slate-400">Brighter</span>
                </div>
              </div>
            )}
          </div>

          {/* Speaking Rate Accordion Item */}
          <div>
            <button
              onClick={() => handleToggleSetting('rate')}
              disabled={disabled}
              className="w-full flex justify-between items-center p-3 text-left focus:outline-none focus-visible:bg-slate-700/30 hover:bg-slate-700/20 disabled:hover:bg-transparent"
              aria-expanded={openSetting === 'rate'}
              aria-controls="rate-controls"
            >
              <span className="text-sm font-medium text-slate-300">Speaking Rate</span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono bg-slate-700 text-slate-300 px-2 py-0.5 rounded">{speakingRate}%</span>
                <ChevronDownIcon className={`transition-transform duration-200 text-slate-400 ${openSetting === 'rate' ? 'rotate-180' : ''}`} />
              </div>
            </button>
            {openSetting === 'rate' && (
              <div id="rate-controls" className="px-4 pb-4 animate-fade-in">
                 <div className="flex items-center gap-4">
                   <span className="text-xs text-slate-400">Slower</span>
                    <input
                      id="rate-slider"
                      type="range" min="50" max="150" step="5"
                      value={speakingRate}
                      onChange={(e) => onSpeakingRateChange(Number(e.target.value))}
                      disabled={disabled}
                      title="Control the speed of the speech. Values below 100% are slower, values above are faster."
                      className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed
                                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500
                                 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:active:scale-125
                                 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
                    />
                    <span className="text-xs text-slate-400">Faster</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Emotion Accordion Item */}
          <div>
            <button
              onClick={() => handleToggleSetting('emotion')}
              disabled={disabled}
              className="w-full flex justify-between items-center p-3 text-left focus:outline-none focus-visible:bg-slate-700/30 hover:bg-slate-700/20 disabled:hover:bg-transparent"
              aria-expanded={openSetting === 'emotion'}
              aria-controls="emotion-controls"
            >
              <span className="text-sm font-medium text-slate-300">Emotion</span>
              <div className="flex items-center gap-3">
                <span className="text-sm bg-slate-700 text-slate-300 px-2 py-0.5 rounded truncate max-w-[120px]">{emotions.find(e => e.value === emotion)?.name || emotion}</span>
                <ChevronDownIcon className={`transition-transform duration-200 text-slate-400 ${openSetting === 'emotion' ? 'rotate-180' : ''}`} />
              </div>
            </button>
            {openSetting === 'emotion' && (
                <div id="emotion-controls" className="px-4 pb-4 animate-fade-in">
                    <div className="relative">
                        <select
                          id="emotion-selector"
                          value={emotion}
                          onChange={(e) => onEmotionChange(e.target.value)}
                          disabled={disabled}
                          title="Choose an emotional tone for the voice."
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {emotions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.name}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                        </div>
                    </div>
                </div>
            )}
          </div>

          {/* Style Prompt (RVC) Accordion Item */}
          <div>
            <button
              onClick={() => handleToggleSetting('style')}
              disabled={disabled}
              className="w-full flex justify-between items-center p-3 text-left focus:outline-none focus-visible:bg-slate-700/30 hover:bg-slate-700/20 disabled:hover:bg-transparent"
              aria-expanded={openSetting === 'style'}
              aria-controls="style-controls"
            >
              <span className="text-sm font-medium text-slate-300">Custom Style Prompt (RVC)</span>
              <div className="flex items-center gap-3">
                 <span className={`text-xs px-2 py-0.5 rounded ${stylePrompt ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-700 text-slate-500'}`}>
                    {stylePrompt ? 'Active' : 'None'}
                 </span>
                <ChevronDownIcon className={`transition-transform duration-200 text-slate-400 ${openSetting === 'style' ? 'rotate-180' : ''}`} />
              </div>
            </button>
            {openSetting === 'style' && (
              <div id="style-controls" className="px-4 pb-4 animate-fade-in">
                <p className="text-xs text-slate-400 mb-2">
                  Describe the specific voice characteristics you want to mimic (e.g., "raspy, robotic, 1920s radio").
                </p>
                <textarea
                  value={stylePrompt}
                  onChange={(e) => onStylePromptChange(e.target.value)}
                  disabled={disabled}
                  placeholder="Enter voice style description..."
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-lg p-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[80px]"
                />
              </div>
            )}
          </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;
