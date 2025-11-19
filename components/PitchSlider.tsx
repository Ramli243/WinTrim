import React from 'react';

interface PitchSliderProps {
  pitch: number;
  onChange: (pitch: number) => void;
  disabled: boolean;
}

const PitchSlider: React.FC<PitchSliderProps> = ({ pitch, onChange, disabled }) => {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const formattedPitch = pitch > 0 ? `+${pitch}` : pitch;

  return (
    <div className={`transition-opacity duration-200 ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex justify-between items-center mb-2">
        <label htmlFor="pitch-slider" className="text-sm font-medium text-slate-300">
          Pitch Adjustment
        </label>
        <span className="text-sm font-mono bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
          {formattedPitch}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <input
          id="pitch-slider"
          type="range"
          min="-12"
          max="12"
          step="1"
          value={pitch}
          onChange={handleSliderChange}
          disabled={disabled}
          title="Adjust the vocal pitch. Higher values make the voice higher, lower values make it deeper."
          className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500
                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:active:scale-125
                     [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
        />
        <button 
          onClick={() => onChange(0)} 
          disabled={disabled || pitch === 0}
          className="text-xs bg-slate-700 hover:bg-slate-600 disabled:hover:bg-slate-700 text-slate-300 font-medium py-1 px-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Reset pitch"
          title="Reset pitch to default (0)"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default PitchSlider;