
import React, { useState, useEffect, useRef } from 'react';

interface CreateModuleModalProps {
  onCreate: (data: { name: string; description: string; color: string }) => void;
  onClose: () => void;
}

const COLOR_OPTIONS = [
  { name: 'Neutral', value: 'from-slate-600 to-slate-700', bg: 'bg-slate-600' },
  { name: 'Red', value: 'from-red-600 to-rose-700', bg: 'bg-red-600' },
  { name: 'Orange', value: 'from-amber-600 to-orange-700', bg: 'bg-orange-600' },
  { name: 'Green', value: 'from-green-600 to-emerald-700', bg: 'bg-green-600' },
  { name: 'Blue', value: 'from-cyan-500 to-blue-600', bg: 'bg-blue-600' },
  { name: 'Purple', value: 'from-violet-500 to-purple-800', bg: 'bg-purple-600' },
  { name: 'Pink', value: 'from-pink-500 to-rose-500', bg: 'bg-pink-500' },
];

const CreateModuleModal: React.FC<CreateModuleModalProps> = ({ onCreate, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0].value);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
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
  }, [onClose]);

  const handleSubmit = () => {
    if (name.trim()) {
      onCreate({
        name: name.trim(),
        description: description.trim() || "Custom User Module",
        color: selectedColor
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div 
        ref={modalRef}
        className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-md shadow-2xl overflow-hidden"
      >
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-bold text-white">Create Voice Module</h2>
          <p className="text-sm text-slate-400">
            Snapshot your current settings into a reusable voice module.
          </p>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Module Name <span className="text-red-400">*</span>
            </label>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Cyberpunk Protagonist"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of this voice configuration..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none h-20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Color Theme
            </label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-8 h-8 rounded-full transition-all border-2 ${color.bg} ${selectedColor === color.value ? 'border-white scale-110 ring-2 ring-blue-500/50' : 'border-transparent hover:scale-105'}`}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 p-4 border-t border-slate-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Module
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateModuleModal;
