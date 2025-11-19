import React, { useState, useEffect, useRef } from 'react';

interface SavePresetModalProps {
  onSave: (name: string) => void;
  onClose: () => void;
}

const SavePresetModal: React.FC<SavePresetModalProps> = ({ onSave, onClose }) => {
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'Enter' && name.trim()) {
        handleSave();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [name, onClose]);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-2xl w-full max-w-sm"
      >
        <h2 id="modal-title" className="text-lg font-semibold text-white mb-4">
          Save Preset
        </h2>
        <div>
          <label htmlFor="preset-name" className="block text-sm font-medium text-slate-300 mb-2">
            Preset Name
          </label>
          <input
            id="preset-name"
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Friendly Narrator"
            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm font-medium bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavePresetModal;