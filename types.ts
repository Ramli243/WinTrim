
export interface SelectOption {
  name: string;
  value: string;
}

export interface VoiceOption {
  name: string;
  value: string;
  description: string;
  gender: 'male' | 'female';
}

export interface LanguageOption {
  name: string;
  value: string;
  accents: SelectOption[];
}

export enum Status {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface Preset {
  id: string;
  name: string;
  settings: {
    selectedVoice: string;
    selectedLanguage: string;
    selectedAccent: string;
    pitch: number;
    isSinging: boolean;
    selectedSingingStyle: string;
    timbre: number;
    speakingRate: number;
    emotion: string;
    stylePrompt?: string;
  };
}

export interface VoiceModule {
  id: string;
  name: string;
  description: string;
  color: string;
  settings: {
    voice: string;
    pitch: number;
    timbre: number;
    speakingRate: number;
    emotion: string;
    stylePrompt: string;
    // RVC Specific Settings
    indexRate?: number; // 0.0 - 1.0: Influence of index file
    f0Method?: string; // pm, harvest, crepe, rmvpe
    protectVolume?: number; // 0.0 - 0.5: Protect voiceless consonants
  };
  source?: {
    type: 'url' | 'file';
    model: string; // URL or Filename for .pth
    index?: string; // URL or Filename for .index
  };
}
