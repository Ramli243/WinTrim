
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import VoiceSelector from './components/VoiceSelector';
import LanguageSelector from './components/LanguageSelector';
import AccentSelector from './components/AccentSelector';
import PitchSlider from './components/PitchSlider';
import SingingModeToggle from './components/SingingModeToggle';
import SingingStyleSelector from './components/SingingStyleSelector';
import Loader from './components/Loader';
import AudioPlayer from './components/AudioPlayer';
import PresetManager from './components/PresetManager';
import SavePresetModal from './components/SavePresetModal';
import ErrorMessage from './components/ErrorMessage';
import AdvancedSettings from './components/AdvancedSettings';
import VoiceModuleLibrary from './components/VoiceModuleLibrary';
import ImportModuleModal from './components/ImportModuleModal';
import CreateModuleModal from './components/CreateModuleModal';
import AudioUploader from './components/AudioUploader';
import { generateSpeech } from './services/geminiService';
import { useLocalStorage } from './hooks/useLocalStorage';
import { AVAILABLE_VOICES, AVAILABLE_LANGUAGES, AVAILABLE_SINGING_STYLES, AVAILABLE_EMOTIONS, DEFAULT_VOICE_MODULES, AVAILABLE_F0_METHODS } from './constants';
import { Status, SelectOption, Preset, VoiceModule } from './types';

const App: React.FC = () => {
  // Mode State
  const [mode, setMode] = useState<'studio' | 'modules'>('studio');
  
  // Input State
  const [inputType, setInputType] = useState<'text' | 'audio'>('text');
  const [inputAudio, setInputAudio] = useState<string | null>(null);

  // Core State
  const [text, setText] = useState<string>('Hello, world! Welcome to the future of voice generation.');
  const [selectedVoice, setSelectedVoice] = useState<string>(AVAILABLE_VOICES[0].value);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(AVAILABLE_LANGUAGES[0].value);
  const [availableAccents, setAvailableAccents] = useState<SelectOption[]>(AVAILABLE_LANGUAGES[0].accents);
  const [selectedAccent, setSelectedAccent] = useState<string>(AVAILABLE_LANGUAGES[0].accents[0].value);
  const [pitch, setPitch] = useState<number>(0);
  const [isSinging, setIsSinging] = useState<boolean>(false);
  const [selectedSingingStyle, setSelectedSingingStyle] = useState<string>(AVAILABLE_SINGING_STYLES[0].value);
  
  const [timbre, setTimbre] = useState<number>(0);
  const [speakingRate, setSpeakingRate] = useState<number>(100);
  const [emotion, setEmotion] = useState<string>(AVAILABLE_EMOTIONS[0].value);
  const [stylePrompt, setStylePrompt] = useState<string>('');

  // RVC Specific State (w-okada style features)
  const [indexRate, setIndexRate] = useState<number>(0.7);
  const [f0Method, setF0Method] = useState<string>('rmvpe');
  const [protectVolume, setProtectVolume] = useState<number>(0.33);

  // App Status State
  const [status, setStatus] = useState<Status>(Status.IDLE);
  const [audioData, setAudioData] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Data State
  const [presets, setPresets] = useLocalStorage<Preset[]>('ai-vocal-creator-presets', []);
  const [customModules, setCustomModules] = useLocalStorage<VoiceModule[]>('ai-vocal-rvc-modules', []);
  const [activePresetId, setActivePresetId] = useState<string>('custom');
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  
  // Modal States
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  const MAX_TEXT_LENGTH = 500;
  
  // Helpers
  const allModules = [...DEFAULT_VOICE_MODULES, ...customModules];

  const resetActivePreset = () => {
     if (activePresetId !== 'custom') setActivePresetId('custom');
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleAudioSelected = (base64: string, name: string) => {
      setInputAudio(base64 || null);
  };
  
  const handleLanguageChange = (newLangValue: string) => {
    setSelectedLanguage(newLangValue);
    const languageData = AVAILABLE_LANGUAGES.find(lang => lang.value === newLangValue);
    const newAccents = languageData?.accents || [];
    setAvailableAccents(newAccents);
    setSelectedAccent(newAccents.length > 0 ? newAccents[0].value : '');
    resetActivePreset();
  };

  const handleAccentChange = (newAccentValue: string) => {
    setSelectedAccent(newAccentValue);
    resetActivePreset();
  };
  
  const handleVoiceChange = (newVoiceValue: string) => {
    setSelectedVoice(newVoiceValue);
    resetActivePreset();
  };
  
  const handlePitchChange = (newPitchValue: number) => {
    setPitch(newPitchValue);
    resetActivePreset();
  };
  
  const handleSingingChange = (newIsSinging: boolean) => {
    setIsSinging(newIsSinging);
    resetActivePreset();
  };
  
  const handleSingingStyleChange = (newStyle: string) => {
    setSelectedSingingStyle(newStyle);
    resetActivePreset();
  };

  const handleTimbreChange = (newTimbre: number) => {
    setTimbre(newTimbre);
    resetActivePreset();
  };

  const handleSpeakingRateChange = (newRate: number) => {
    setSpeakingRate(newRate);
    resetActivePreset();
  };

  const handleEmotionChange = (newEmotion: string) => {
    setEmotion(newEmotion);
    resetActivePreset();
  };

  const handleStylePromptChange = (newVal: string) => {
      setStylePrompt(newVal);
      resetActivePreset();
  };
  
  // Preset Management
  const handleSavePreset = (presetName: string) => {
    const newPreset: Preset = {
      id: Date.now().toString(),
      name: presetName,
      settings: {
        selectedVoice,
        selectedLanguage,
        selectedAccent,
        pitch,
        isSinging,
        selectedSingingStyle,
        timbre,
        speakingRate,
        emotion,
        stylePrompt
      }
    };
    const updatedPresets = [...presets, newPreset];
    setPresets(updatedPresets);
    setActivePresetId(newPreset.id);
    setIsSaveModalOpen(false);
  };

  const handleLoadPreset = (presetId: string) => {
    if (presetId === 'custom') {
        setActivePresetId('custom');
        return;
    }
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      const { settings } = preset;
      setSelectedVoice(settings.selectedVoice);
      setSelectedLanguage(settings.selectedLanguage);
      const languageData = AVAILABLE_LANGUAGES.find(lang => lang.value === settings.selectedLanguage);
      const newAccents = languageData?.accents || [];
      setAvailableAccents(newAccents);
      setSelectedAccent(settings.selectedAccent);
      setPitch(settings.pitch);
      setIsSinging(settings.isSinging);
      setSelectedSingingStyle(settings.selectedSingingStyle);
      setTimbre(settings.timbre ?? 0);
      setSpeakingRate(settings.speakingRate ?? 100);
      setEmotion(settings.emotion ?? AVAILABLE_EMOTIONS[0].value);
      setStylePrompt(settings.stylePrompt ?? '');
      setActivePresetId(preset.id);
    }
  };

  const handleDeletePreset = () => {
    if (activePresetId && activePresetId !== 'custom') {
      const updatedPresets = presets.filter(p => p.id !== activePresetId);
      setPresets(updatedPresets);
      setActivePresetId('custom');
    }
  };

  // Module Management
  const handleSelectModule = (module: VoiceModule) => {
    setActiveModuleId(module.id);
    setSelectedVoice(module.settings.voice);
    setPitch(module.settings.pitch);
    setTimbre(module.settings.timbre);
    setSpeakingRate(module.settings.speakingRate);
    setEmotion(module.settings.emotion);
    setStylePrompt(module.settings.stylePrompt);
    
    // Load RVC specifics
    setIndexRate(module.settings.indexRate ?? 0.7);
    setF0Method(module.settings.f0Method ?? 'rmvpe');
    setProtectVolume(module.settings.protectVolume ?? 0.33);

    // Modules disable singing by default as they are speech-focused
    setIsSinging(false); 
  };

  const handleCreateModule = () => {
      setIsCreateModalOpen(true);
  };

  const handleConfirmCreateModule = (data: { name: string; description: string; color: string }) => {
      const newModule: VoiceModule = {
          id: Date.now().toString(),
          name: data.name,
          description: data.description,
          color: data.color,
          settings: {
              voice: selectedVoice,
              pitch,
              timbre,
              speakingRate,
              emotion,
              stylePrompt,
              indexRate,
              f0Method,
              protectVolume
          }
      };
      setCustomModules([...customModules, newModule]);
      setActiveModuleId(newModule.id);
      setIsCreateModalOpen(false);
  };

  const handleDeleteModule = (id: string) => {
      if (confirm("Are you sure you want to delete this voice module?")) {
          setCustomModules(customModules.filter(m => m.id !== id));
          if (activeModuleId === id) setActiveModuleId(null);
      }
  };

  const handleImportClick = () => {
      setIsImportModalOpen(true);
  };

  const handleImportConfirm = (data: any) => {
      const newModule: VoiceModule = {
          id: `imported_${Date.now()}`,
          name: data.name,
          description: data.description,
          color: 'from-yellow-600 to-yellow-800', // HF style color
          settings: data.settings,
          source: data.source // Store source info if available
      };
      setCustomModules([...customModules, newModule]);
      handleSelectModule(newModule); // Auto-select
      setIsImportModalOpen(false);
  };


  const handleGenerateSpeech = async () => {
    if (inputType === 'text' && !text.trim()) {
      setErrorMessage("Please enter some text to generate speech.");
      setStatus(Status.ERROR);
      return;
    }
    if (inputType === 'audio' && !inputAudio) {
        setErrorMessage("Please upload an audio file to convert.");
        setStatus(Status.ERROR);
        return;
    }
    
    setStatus(Status.LOADING);
    setErrorMessage(null);
    setAudioData(null);

    try {
      const input = inputType === 'text' ? text : inputAudio!;

      const data = await generateSpeech(
          input,
          inputType,
          selectedVoice, 
          selectedLanguage, 
          selectedAccent, 
          isSinging, 
          pitch, 
          selectedSingingStyle, 
          timbre, 
          speakingRate, 
          emotion,
          stylePrompt, // Pass the style prompt
          indexRate,
          f0Method,
          protectVolume
      );
      setAudioData(data);
      setStatus(Status.SUCCESS);
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unknown error occurred.";
      setErrorMessage(message);
      setStatus(Status.ERROR);
    }
  };

  const isLoading = status === Status.LOADING;

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-900 selection:bg-blue-500/30">
        <div className="w-full max-w-2xl mx-auto animate-fade-in">
          <Header />

          <main className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 md:p-8 shadow-2xl shadow-slate-950/50">
            <div className="space-y-6">
              
              {/* Mode Toggle Tabs */}
              <div className="flex p-1 bg-slate-900/50 rounded-lg mb-4">
                 <button 
                    onClick={() => { setMode('studio'); setInputType('text'); }}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'studio' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                 >
                    Studio Mode
                 </button>
                 <button 
                    onClick={() => setMode('modules')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'modules' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                 >
                    Voice Modules (RVC)
                 </button>
              </div>

              {/* Input Source Toggle (Only relevant for Modules or Advanced Studio) */}
              <div className="flex items-center gap-4 mb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="inputType" 
                        checked={inputType === 'text'} 
                        onChange={() => setInputType('text')}
                        className="text-blue-600 focus:ring-blue-500 bg-slate-700 border-slate-600"
                      />
                      <span className={`text-sm font-medium ${inputType === 'text' ? 'text-white' : 'text-slate-400'}`}>Text to Speech</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="inputType" 
                        checked={inputType === 'audio'} 
                        onChange={() => setInputType('audio')}
                        className="text-blue-600 focus:ring-blue-500 bg-slate-700 border-slate-600"
                      />
                      <span className={`text-sm font-medium ${inputType === 'audio' ? 'text-white' : 'text-slate-400'}`}>Audio Conversion (RVC)</span>
                  </label>
              </div>

              <div className="relative">
                {inputType === 'text' ? (
                    <>
                        <textarea
                        value={text}
                        onChange={handleTextChange}
                        placeholder="Type anything you want to hear..."
                        rows={6}
                        maxLength={MAX_TEXT_LENGTH}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 pr-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 resize-none"
                        disabled={isLoading}
                        />
                        <div className="absolute bottom-2 right-3 text-xs text-slate-400">
                        {text.length} / {MAX_TEXT_LENGTH}
                        </div>
                    </>
                ) : (
                    <AudioUploader 
                        onAudioSelected={handleAudioSelected} 
                        disabled={isLoading} 
                    />
                )}
              </div>
              
              {mode === 'studio' ? (
                <div className="animate-fade-in space-y-6">
                    <PresetManager
                        presets={presets}
                        activePresetId={activePresetId}
                        onSelect={handleLoadPreset}
                        onSave={() => setIsSaveModalOpen(true)}
                        onDelete={handleDeletePreset}
                        disabled={isLoading}
                    />
                    
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <LanguageSelector
                            languages={AVAILABLE_LANGUAGES}
                            selectedLanguage={selectedLanguage}
                            onChange={(e) => handleLanguageChange(e.target.value)}
                            disabled={isLoading || isSinging}
                        />
                        <AccentSelector
                            accents={availableAccents}
                            selectedAccent={selectedAccent}
                            onChange={(e) => handleAccentChange(e.target.value)}
                            disabled={isLoading || availableAccents.length <= 1 || isSinging}
                        />
                        </div>
                        <VoiceSelector 
                        voices={AVAILABLE_VOICES}
                        selectedVoice={selectedVoice}
                        onChange={handleVoiceChange}
                        disabled={isLoading || isSinging}
                        />
                        <PitchSlider
                        pitch={pitch}
                        onChange={handlePitchChange}
                        disabled={isLoading}
                        />
                        <AdvancedSettings 
                            timbre={timbre}
                            onTimbreChange={handleTimbreChange}
                            speakingRate={speakingRate}
                            onSpeakingRateChange={handleSpeakingRateChange}
                            emotion={emotion}
                            onEmotionChange={handleEmotionChange}
                            emotions={AVAILABLE_EMOTIONS}
                            stylePrompt={stylePrompt}
                            onStylePromptChange={handleStylePromptChange}
                            disabled={isLoading || isSinging}
                        />
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-700/50">
                        <SingingModeToggle
                        isSinging={isSinging}
                        onChange={handleSingingChange}
                        disabled={isLoading}
                        />
                        {isSinging && (
                        <div className="animate-fade-in">
                            <SingingStyleSelector
                            styles={AVAILABLE_SINGING_STYLES}
                            selectedStyle={selectedSingingStyle}
                            onChange={(e) => handleSingingStyleChange(e.target.value)}
                            disabled={isLoading}
                            />
                        </div>
                        )}
                    </div>
                </div>
              ) : (
                <div className="animate-fade-in space-y-6">
                    <VoiceModuleLibrary 
                        modules={allModules}
                        selectedModuleId={activeModuleId}
                        onSelect={handleSelectModule}
                        onCreate={handleCreateModule}
                        onImport={handleImportClick}
                        onDelete={handleDeleteModule}
                        disabled={isLoading}
                    />
                    <div className="bg-slate-900/30 p-5 rounded-xl border border-purple-500/20 shadow-inner">
                        <h4 className="text-sm font-bold text-purple-300 mb-4 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                              <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.683a1 1 0 0 1 .633.633l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684ZM13.97 13.97a1 1 0 0 0-1.94 0l-.055.272a1 1 0 0 1-.797.797l-.272.055a1 1 0 0 0 0 1.94l.272.055a1 1 0 0 1 .797.797l.055.272a1 1 0 0 0 1.94 0l.055-.272a1 1 0 0 1 .797-.797l.272-.055a1 1 0 0 0 0-1.94l-.272-.055a1 1 0 0 1-.797-.797l-.055-.272Z" />
                            </svg>
                            Active Module Tuning
                        </h4>
                        
                        <div className="space-y-5">
                            <PitchSlider
                                pitch={pitch}
                                onChange={handlePitchChange}
                                disabled={isLoading}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                {/* Index Rate Slider */}
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-xs text-slate-400 font-medium">Index Rate</label>
                                        <span className="text-xs font-mono bg-slate-800 text-slate-300 px-1.5 rounded">
                                            {indexRate.toFixed(1)}
                                        </span>
                                    </div>
                                    <input 
                                        type="range" min="0" max="1" step="0.1"
                                        value={indexRate}
                                        onChange={(e) => setIndexRate(Number(e.target.value))}
                                        disabled={isLoading}
                                        title="Controls how strong the accent/timbre from the index file is applied."
                                        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-purple-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:rounded-full"
                                    />
                                </div>

                                {/* Protect Volume Slider */}
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-xs text-slate-400 font-medium">Protect</label>
                                        <span className="text-xs font-mono bg-slate-800 text-slate-300 px-1.5 rounded">
                                            {protectVolume.toFixed(2)}
                                        </span>
                                    </div>
                                    <input 
                                        type="range" min="0" max="0.5" step="0.01"
                                        value={protectVolume}
                                        onChange={(e) => setProtectVolume(Number(e.target.value))}
                                        disabled={isLoading}
                                        title="Protect voiceless consonants and breath sounds from pitch shifting artifacts."
                                        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-purple-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:rounded-full"
                                    />
                                </div>
                            </div>

                            {/* F0 Method Selector */}
                            <div>
                                <label className="block text-xs text-slate-400 font-medium mb-1">
                                    F0 Method (Pitch Detection)
                                </label>
                                <select
                                    value={f0Method}
                                    onChange={(e) => setF0Method(e.target.value)}
                                    disabled={isLoading}
                                    className="w-full bg-slate-800 border border-slate-700 rounded text-xs text-white p-2 focus:border-purple-500 outline-none"
                                >
                                    {AVAILABLE_F0_METHODS.map(m => (
                                        <option key={m.value} value={m.value}>{m.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Style Prompt */}
                            <div className="pt-2 border-t border-slate-700/50">
                                 <label className="text-xs text-slate-400 font-medium block mb-1">RVC Style Instruction</label>
                                 <textarea 
                                    value={stylePrompt}
                                    onChange={(e) => handleStylePromptChange(e.target.value)}
                                    placeholder="Additional voice characteristics..."
                                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs text-slate-300 h-16 resize-none focus:border-purple-500 focus:outline-none"
                                 />
                            </div>
                        </div>
                    </div>
                </div>
              )}

              <button
                onClick={handleGenerateSpeech}
                disabled={isLoading || (inputType === 'text' && !text.trim()) || (inputType === 'audio' && !inputAudio)}
                className={`w-full flex items-center justify-center font-bold py-3 px-4 rounded-lg transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 ${
                    mode === 'modules' 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 focus:ring-purple-500' 
                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white'
                }`}
              >
                {isLoading ? <><Loader className="w-5 h-5 mr-2" /> Processing...</> : (inputType === 'audio' ? 'Convert Audio' : 'Generate Audio')}
              </button>
              
              {status === Status.ERROR && errorMessage && (
                <ErrorMessage message={errorMessage} />
              )}

              {status === Status.SUCCESS && audioData && (
                <AudioPlayer audioData={audioData} />
              )}
            </div>
          </main>
          
          <footer className="text-center mt-8">
              <p className="text-slate-500 text-sm">Powered by Gemini API</p>
          </footer>
        </div>
      </div>
      {isSaveModalOpen && (
        <SavePresetModal
          onSave={handleSavePreset}
          onClose={() => setIsSaveModalOpen(false)}
        />
      )}
      <ImportModuleModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportConfirm}
        voices={AVAILABLE_VOICES}
      />
      {isCreateModalOpen && (
        <CreateModuleModal 
           onCreate={handleConfirmCreateModule}
           onClose={() => setIsCreateModalOpen(false)}
        />
      )}
    </>
  );
};

export default App;
