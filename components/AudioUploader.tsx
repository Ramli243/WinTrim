
import React, { useRef, useState } from 'react';

interface AudioUploaderProps {
  onAudioSelected: (base64Data: string, fileName: string) => void;
  disabled: boolean;
}

const CloudArrowUpIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
  </svg>
);

const MusicalNoteIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-2.53-2.093 1.803 1.803 0 0 1 2.53 2.093m0-4.133V6.115c0-1.515 1.07-2.838 2.56-3.16l1.32-.293M9 9v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-2.53-2.093 1.803 1.803 0 0 1 2.53 2.093m0-4.133V6.115a2.25 2.25 0 0 1 1.557-2.132l6.084-1.827" />
  </svg>
);

const XMarkIcon: React.FC<{ className?: string }> = ({ className = "h-4 w-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
  </svg>
);

const AudioUploader: React.FC<AudioUploaderProps> = ({ onAudioSelected, disabled }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const processFile = (file: File | undefined) => {
    if (!file) return;

    // Simple validation
    if (!file.type.startsWith('audio/')) {
      alert('Please upload an audio file.');
      return;
    }

    // Limit size (e.g., 10MB for base64 safety)
    if (file.size > 10 * 1024 * 1024) {
        alert('File size too large. Please keep it under 10MB.');
        return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      // Extract just the base64 data, removing the prefix (e.g., "data:audio/mp3;base64,")
      const base64Data = result.split(',')[1];
      onAudioSelected(base64Data, file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFileName(null);
    onAudioSelected('', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full animate-fade-in">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="audio/*"
        className="hidden"
        disabled={disabled}
      />
      
      <div
        onClick={() => !disabled && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed transition-all cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${isDragging 
            ? 'border-purple-500 bg-purple-500/10' 
            : fileName 
              ? 'border-green-500/50 bg-green-500/5' 
              : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/50'
          }
        `}
      >
        {fileName ? (
          <div className="flex flex-col items-center p-4">
            <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-2">
              <MusicalNoteIcon />
            </div>
            <p className="text-sm font-medium text-green-400 text-center break-all max-w-xs">
              {fileName}
            </p>
            <button
              onClick={clearFile}
              className="mt-2 flex items-center gap-1 text-xs text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-2 py-1 rounded-full transition-colors"
            >
              <XMarkIcon /> Remove
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-slate-400 p-4">
            <CloudArrowUpIcon className="mb-2 text-slate-500" />
            <p className="text-sm font-medium">Click to upload or drag audio here</p>
            <p className="text-xs text-slate-500 mt-1">MP3, WAV, AAC (Max 10MB)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioUploader;
