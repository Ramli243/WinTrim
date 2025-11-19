
import React from 'react';
import { VoiceModule } from '../types';

interface VoiceModuleLibraryProps {
  modules: VoiceModule[];
  selectedModuleId: string | null;
  onSelect: (module: VoiceModule) => void;
  onImport: () => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  disabled: boolean;
}

const PlusIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
  </svg>
);

const ChipIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z" />
  </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 1 0 .53 1.405A18.06 18.06 0 0 1 10 6.002c1.606 0 3.16.204 4.685.603a.75.75 0 1 0 .53-1.405 19.592 19.592 0 0 0-2.365-.468v-.443A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 7.5c-1.933 0-3.5 1.567-3.5 3.5s1.567 3.5 3.5 3.5 3.5-1.567 3.5-3.5-1.567-3.5-3.5-3.5Z" clipRule="evenodd" />
        <path d="M3 10a7 7 0 1 1 14 0 7 7 0 0 1-14 0Zm1.042-.35a5.5 5.5 0 0 0 9.916 0H4.042Z" />
    </svg>
);

const DownloadCloudIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
        <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
    </svg>
);


const VoiceModuleLibrary: React.FC<VoiceModuleLibraryProps> = ({
  modules,
  selectedModuleId,
  onSelect,
  onImport,
  onCreate,
  onDelete,
  disabled
}) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <ChipIcon className="text-purple-400" />
          Neural Voice Modules
        </h3>
        <div className="flex gap-2">
          <button
            onClick={onImport}
            disabled={disabled}
            className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 py-1.5 px-3 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5"
            title="Import weights from Hugging Face"
          >
            <DownloadCloudIcon className="h-3.5 w-3.5" />
            Import HF
          </button>
          <button
            onClick={onCreate}
            disabled={disabled}
            className="text-xs bg-purple-600 hover:bg-purple-700 text-white py-1.5 px-3 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1"
          >
            <PlusIcon className="h-3 w-3" />
            Create Module
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
        {modules.map((module) => {
          const isSelected = selectedModuleId === module.id;
          return (
            <div
              key={module.id}
              onClick={() => !disabled && onSelect(module)}
              className={`relative group p-4 rounded-xl border transition-all duration-200 cursor-pointer
                ${isSelected 
                  ? 'bg-slate-800 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:bg-slate-700/50'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-5 rounded-xl pointer-events-none`} />
              
              <div className="flex justify-between items-start mb-2 relative z-10">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${module.color}`} />
                  <h4 className={`font-semibold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                    {module.name}
                  </h4>
                </div>
                {!module.id.startsWith('vm_') && ( // Prevent deleting default modules
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(module.id);
                    }}
                    className="text-slate-500 hover:text-red-400 transition-colors p-1 opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Delete module"
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>
              
              <p className="text-xs text-slate-400 line-clamp-2 mb-3 relative z-10 h-8">
                {module.description}
              </p>

              <div className="flex flex-wrap gap-1 relative z-10">
                 <span className="text-[10px] uppercase tracking-wider font-mono bg-slate-900/50 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700/50">
                    {module.settings.voice}
                 </span>
                 <span className="text-[10px] uppercase tracking-wider font-mono bg-slate-900/50 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700/50">
                    {module.settings.emotion === 'neutral' ? 'Std' : module.settings.emotion}
                 </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VoiceModuleLibrary;
