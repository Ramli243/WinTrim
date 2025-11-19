
import React, { useState, useEffect, useRef } from 'react';
import { VoiceOption } from '../types';
import Loader from './Loader';

interface ImportModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any) => void;
  voices: VoiceOption[];
}

const HuggingFaceIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.9 29.6C23.9 29.6 18.9 29.6 18.9 35.6C18.9 41.6 23.9 41.6 23.9 41.6V29.6Z" />
        <path d="M40.6 29.6C40.6 29.6 35.6 29.6 35.6 35.6C35.6 41.6 40.6 41.6 40.6 41.6V29.6Z" />
        <path d="M57.3 29.6C57.3 29.6 52.3 29.6 52.3 35.6C52.3 41.6 57.3 41.6 57.3 41.6V29.6Z" />
        <path d="M73.9 29.6C73.9 29.6 68.9 29.6 68.9 35.6C68.9 41.6 73.9 41.6 73.9 41.6V29.6Z" />
        <path d="M13.3 53.3C13.3 46 19.3 40 26.7 40C34.1 40 40 46 40 53.3V66.7H13.3V53.3Z" />
        <path d="M46.7 53.3C46.7 46 52.7 40 60 40C67.3 40 73.3 46 73.3 53.3V66.7H46.7V53.3Z" />
        <path d="M13.3 73.3H73.3V80C73.3 83.7 70.3 86.7 66.7 86.7H20C16.3 86.7 13.3 83.7 13.3 80V73.3Z" />
    </svg>
);

const FileIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M3 3.5A1.5 1.5 0 0 1 4.5 2h6.879a1.5 1.5 0 0 1 1.06.44l4.122 4.12A1.5 1.5 0 0 1 17 7.622V16.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 16.5v-13Z" />
  </svg>
);

const LinkIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z" />
    <path d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z" />
  </svg>
);

const ArchiveBoxIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
  </svg>
);

const ImportModuleModal: React.FC<ImportModuleModalProps> = ({ isOpen, onClose, onImport, voices }) => {
  const [step, setStep] = useState(1);
  const [importMethod, setImportMethod] = useState<'url' | 'file'>('url');
  
  // URL State
  const [pthUrl, setPthUrl] = useState('');
  const [indexUrl, setIndexUrl] = useState('');
  
  // File State
  const [pthFile, setPthFile] = useState<File | null>(null);
  const [indexFile, setIndexFile] = useState<File | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);
  
  const [analyzing, setAnalyzing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const pthFileInputRef = useRef<HTMLInputElement>(null);
  const indexFileInputRef = useRef<HTMLInputElement>(null);
  const zipFileInputRef = useRef<HTMLInputElement>(null);

  // Form Data
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [baseVoice, setBaseVoice] = useState(voices[0].value);
  const [stylePrompt, setStylePrompt] = useState('');

  useEffect(() => {
    if (isOpen) {
        setStep(1);
        setImportMethod('url');
        setPthUrl('');
        setIndexUrl('');
        setPthFile(null);
        setIndexFile(null);
        setZipFile(null);
        setAnalyzing(false);
        setName('');
        setDescription('');
        setStylePrompt('');
    }
  }, [isOpen]);

  // Close on escape or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const handleClickOutside = (e: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    }
    if (isOpen) {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'pth' | 'index' | 'zip') => {
    const file = e.target.files?.[0];
    if (file) {
        if (type === 'zip') {
            setZipFile(file);
            setPthFile(null);
            setIndexFile(null);
        } else if (type === 'pth') {
            setPthFile(file);
            setZipFile(null);
        } else if (type === 'index') {
            setIndexFile(file);
            setZipFile(null);
        }
    }
  };

  const handleAnalyze = () => {
    const mainSource = importMethod === 'url' ? pthUrl : (zipFile ? zipFile.name : pthFile?.name);
    if (!mainSource) return;
    
    setAnalyzing(true);

    // Simulate network request/parsing
    setTimeout(() => {
        let derivedName = "Imported Model";
        try {
            if (importMethod === 'url') {
                 // Try to extract model name from URL
                const urlObj = new URL(mainSource);
                const pathParts = urlObj.pathname.split('/').filter(Boolean);
                const filename = pathParts[pathParts.length - 1];
                derivedName = filename;
            } else {
                derivedName = mainSource;
            }
        } catch (e) {
            derivedName = mainSource.slice(0, 20);
        }

        // Clean up name
        derivedName = derivedName.replace(/[-_]/g, ' ').replace(/\.pth$/i, '').replace(/\.zip$/i, '').replace(/\.7z$/i, '').replace(/\.rar$/i, '');
        // Capitalize
        derivedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);

        setName(derivedName);
        
        let desc = "";
        if (importMethod === 'url') {
            desc = `Imported from ${new URL(pthUrl).hostname}`;
            if (indexUrl) desc += " + Index";
        } else {
            // File Method
            if (zipFile) {
                 desc = `Imported ZIP Archive (${(zipFile.size / 1024 / 1024).toFixed(1)}MB)`;
            } else {
                 desc = `Local import (${pthFile?.size ? (pthFile.size / 1024 / 1024).toFixed(1) + 'MB' : 'Unknown size'})`;
                 if (indexFile) desc += " + Index";
            }
        }

        setDescription(desc);
        setAnalyzing(false);
        setStep(2);
        
        // Suggest style prompt based on name
        const lowerName = derivedName.toLowerCase();
        if (lowerName.includes('robot')) setStylePrompt('Robotic, metallic, futuristic AI voice.');
        else if (lowerName.includes('demon')) setStylePrompt('Deep, distorted, demonic growl.');
        else if (lowerName.includes('anime')) setStylePrompt('High-pitched, energetic, anime character style.');
        else if (lowerName.includes('singer')) setStylePrompt('Melodic, clear, professional singer quality.');
        else setStylePrompt(`Characteristic style of ${derivedName}.`);

    }, 1500);
  };

  const handleImport = () => {
    onImport({
        name,
        description,
        settings: {
            voice: baseVoice,
            stylePrompt,
            pitch: 0,
            timbre: 0,
            speakingRate: 100,
            emotion: 'neutral',
            indexRate: 0.7, // Default
            f0Method: 'rmvpe', // Default
            protectVolume: 0.33 // Default
        },
        source: {
            type: importMethod,
            model: importMethod === 'url' ? pthUrl : (zipFile ? zipFile.name : pthFile?.name),
            index: importMethod === 'url' ? indexUrl : (zipFile ? 'Included in ZIP' : indexFile?.name)
        }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div 
        ref={modalRef}
        className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-slate-900/50 p-4 border-b border-slate-700 flex items-center gap-3 shrink-0">
            <div className="bg-yellow-500/10 p-2 rounded-lg text-yellow-500">
                <HuggingFaceIcon />
            </div>
            <div>
                <h3 className="text-lg font-bold text-white">Import RVC Model</h3>
                <p className="text-xs text-slate-400">Support for .pth and .index files (Zip or Direct)</p>
            </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
            {step === 1 ? (
                <div className="space-y-5">
                    
                    {/* Method Selector */}
                    <div className="flex bg-slate-900 p-1 rounded-lg">
                        <button 
                            onClick={() => setImportMethod('url')}
                            className={`flex-1 py-2 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-all ${importMethod === 'url' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            <LinkIcon /> From URL
                        </button>
                        <button 
                            onClick={() => setImportMethod('file')}
                            className={`flex-1 py-2 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-all ${importMethod === 'file' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            <FileIcon /> Upload Files
                        </button>
                    </div>

                    {importMethod === 'url' ? (
                        <div className="space-y-4 animate-fade-in">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Model .pth URL <span className="text-red-400">*</span>
                                </label>
                                <input 
                                    type="text"
                                    value={pthUrl}
                                    onChange={(e) => setPthUrl(e.target.value)}
                                    placeholder="https://huggingface.co/.../model.pth"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Index File URL <span className="text-slate-500 text-xs font-normal">(Optional)</span>
                                </label>
                                <input 
                                    type="text"
                                    value={indexUrl}
                                    onChange={(e) => setIndexUrl(e.target.value)}
                                    placeholder="https://huggingface.co/.../added.index"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-fade-in">
                             {/* ZIP File Input - Preferred/First option */}
                             <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Upload ZIP Package <span className="text-purple-400 text-xs font-normal">(Contains .pth + .index)</span>
                                </label>
                                <input 
                                    type="file"
                                    ref={zipFileInputRef}
                                    onChange={(e) => handleFileChange(e, 'zip')}
                                    accept=".zip,.7z,.rar" 
                                    className="hidden"
                                />
                                <div 
                                    onClick={() => zipFileInputRef.current?.click()}
                                    className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${zipFile ? 'border-purple-500/50 bg-purple-500/10' : 'border-slate-700 hover:border-purple-500/50 hover:bg-slate-700/50'}`}
                                >
                                     {zipFile ? (
                                        <div className="text-purple-400 font-medium text-sm truncate flex items-center justify-center gap-2">
                                            <ArchiveBoxIcon /> {zipFile.name}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-1">
                                            <ArchiveBoxIcon className="w-8 h-8 text-slate-500 mb-1" />
                                            <div className="text-slate-400 text-sm">Click to select ZIP archive</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="relative flex py-1 items-center">
                                <div className="flex-grow border-t border-slate-700"></div>
                                <span className="flex-shrink-0 mx-3 text-slate-500 text-xs font-medium uppercase">Or upload individually</span>
                                <div className="flex-grow border-t border-slate-700"></div>
                            </div>

                             {/* PTH File Input */}
                             <div className={`space-y-4 transition-opacity duration-200 ${zipFile ? 'opacity-40 pointer-events-none grayscale' : ''}`}>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Model .pth File <span className="text-red-400">*</span>
                                    </label>
                                    <input 
                                        type="file"
                                        ref={pthFileInputRef}
                                        onChange={(e) => handleFileChange(e, 'pth')}
                                        accept=".pth"
                                        className="hidden"
                                    />
                                    <div 
                                        onClick={() => pthFileInputRef.current?.click()}
                                        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${pthFile ? 'border-green-500/50 bg-green-500/10' : 'border-slate-700 hover:border-yellow-500/50 hover:bg-slate-700/50'}`}
                                    >
                                        {pthFile ? (
                                            <div className="text-green-400 font-medium text-sm truncate">{pthFile.name}</div>
                                        ) : (
                                            <div className="text-slate-400 text-sm">Click to select .pth file</div>
                                        )}
                                    </div>
                                </div>

                                {/* Index File Input */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Index File <span className="text-yellow-500/80 text-xs font-normal">(Recommended)</span>
                                    </label>
                                    <input 
                                        type="file"
                                        ref={indexFileInputRef}
                                        onChange={(e) => handleFileChange(e, 'index')}
                                        accept=".index"
                                        className="hidden"
                                    />
                                    <div 
                                        onClick={() => indexFileInputRef.current?.click()}
                                        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${indexFile ? 'border-green-500/50 bg-green-500/10' : 'border-slate-700 hover:border-yellow-500/50 hover:bg-slate-700/50'}`}
                                    >
                                        {indexFile ? (
                                            <div className="text-green-400 font-medium text-sm truncate">{indexFile.name}</div>
                                        ) : (
                                            <div className="text-slate-400 text-sm">Click to select .index file</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleAnalyze}
                        disabled={analyzing || (importMethod === 'url' ? !pthUrl : (!pthFile && !zipFile))}
                        className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center mt-4"
                    >
                        {analyzing ? <Loader className="w-5 h-5 text-slate-900" /> : 'Process Model'}
                    </button>
                </div>
            ) : (
                <div className="space-y-4 animate-fade-in">
                    <div>
                        <label className="block text-xs text-slate-400 mb-1">Module Name</label>
                        <input 
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:border-yellow-500 outline-none"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs text-slate-400 mb-1">Mapped Base Voice</label>
                        <select
                            value={baseVoice}
                            onChange={(e) => setBaseVoice(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:border-yellow-500 outline-none"
                        >
                            {voices.map(v => (
                                <option key={v.value} value={v.value}>{v.name} ({v.gender})</option>
                            ))}
                        </select>
                        <p className="text-[10px] text-slate-500 mt-1">Select the Gemini voice that best matches the model's gender.</p>
                    </div>

                    <div>
                        <label className="block text-xs text-slate-400 mb-1">Style Instruction (System Prompt)</label>
                        <textarea 
                            value={stylePrompt}
                            onChange={(e) => setStylePrompt(e.target.value)}
                            placeholder="e.g. Raspy, robotic, high-pitched, anime protagonist style..."
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white h-20 resize-none focus:border-yellow-500 outline-none"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">Since we simulate RVC via prompting, describe the voice characteristics from your imported model.</p>
                    </div>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="bg-slate-900/50 p-4 border-t border-slate-700 flex justify-end gap-3 shrink-0">
            <button 
                onClick={onClose}
                className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
                Cancel
            </button>
            {step === 2 && (
                <button 
                    onClick={handleImport}
                    disabled={!name}
                    className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-2 px-4 rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                    Import Module
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default ImportModuleModal;
