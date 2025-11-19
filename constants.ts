
import { LanguageOption, VoiceOption, SelectOption, VoiceModule } from './types';

export const AVAILABLE_VOICES: VoiceOption[] = [
  { name: 'Zephyr', value: 'Zephyr', description: 'Friendly & Warm', gender: 'male' },
  { name: 'Kore', value: 'Kore', description: 'Calm & Soothing', gender: 'female' },
  { name: 'Puck', value: 'Puck', description: 'Energetic & Crisp', gender: 'male' },
  { name: 'Charon', value: 'Charon', description: 'Deep & Authoritative', gender: 'male' },
  { name: 'Fenrir', value: 'Fenrir', description: 'Assertive & Clear', gender: 'male' },
];

export const AVAILABLE_LANGUAGES: LanguageOption[] = [
    { 
      name: 'English', 
      value: 'English',
      accents: [
        { name: 'American', value: 'American' },
        { name: 'British', value: 'British' },
        { name: 'Australian', value: 'Australian' },
        { name: 'Indian', value: 'Indian' },
      ],
    },
    { 
      name: 'Spanish', 
      value: 'Spanish',
      accents: [
        { name: 'Castilian (Spain)', value: 'Castilian' },
        { name: 'Mexican', value: 'Mexican' },
      ],
    },
    { 
      name: 'French', 
      value: 'French',
      accents: [
        { name: 'Standard (France)', value: 'Standard' },
        { name: 'Canadian', value: 'Canadian' },
      ],
    },
    { name: 'German', value: 'German', accents: [{ name: 'Standard', value: 'Standard' }] },
    { name: 'Italian', value: 'Italian', accents: [{ name: 'Standard', value: 'Standard' }] },
    { name: 'Japanese', value: 'Japanese', accents: [{ name: 'Standard', value: 'Standard' }] },
    { name: 'Korean', value: 'Korean', accents: [{ name: 'Standard', value: 'Standard' }] },
    { name: 'Malay', value: 'Malay', accents: [{ name: 'Malaysian', value: 'Malaysian' }] },
    { 
      name: 'Portuguese', 
      value: 'Portuguese',
      accents: [
        { name: 'Brazilian', value: 'Brazilian' },
        { name: 'European', value: 'European' },
      ],
    },
    { name: 'Russian', value: 'Russian', accents: [{ name: 'Standard', value: 'Standard' }] },
    { 
      name: 'Chinese (Mandarin)', 
      value: 'Chinese (Mandarin)',
      accents: [{ name: 'Standard', value: 'Standard' }],
    },
    { name: 'Hindi', value: 'Hindi', accents: [{ name: 'Standard', value: 'Standard' }] },
    { name: 'Arabic', value: 'Arabic', accents: [{ name: 'Standard', value: 'Standard' }] },
];


export const AVAILABLE_SINGING_STYLES: SelectOption[] = [
  { name: 'Cheerful Pop', value: 'cheerful_pop' },
  { name: 'Gentle Lullaby', value: 'gentle_lullaby' },
  { name: 'Folk Ballad', value: 'folk_ballad' },
  { name: 'Dramatic Opera', value: 'dramatic_opera' },
  { name: 'Simple Rap', value: 'simple_rap' },
];

export const AVAILABLE_EMOTIONS: SelectOption[] = [
  { name: 'Neutral', value: 'neutral' },
  { name: 'Happy / Cheerful', value: 'happy' },
  { name: 'Sad / Somber', value: 'sad' },
  { name: 'Angry / Annoyed', value: 'angry' },
  { name: 'Whispering', value: 'whispering' },
  { name: 'Excited', value: 'excited' },
];

export const DEFAULT_VOICE_MODULES: VoiceModule[] = [
  {
    id: 'vm_cyber_narrator',
    name: 'Cyber Narrator',
    description: 'A futuristic, slightly synthetic voice for tech demos.',
    color: 'from-cyan-500 to-blue-600',
    settings: {
      voice: 'Fenrir',
      pitch: -2,
      timbre: 2,
      speakingRate: 110,
      emotion: 'neutral',
      stylePrompt: 'Speak with a precise, metallic, and futuristic cadence. Enunciate clearly like a high-tech AI interface.'
    }
  },
  {
    id: 'vm_old_storyteller',
    name: 'Elder Storyteller',
    description: 'A wise, raspy voice perfect for fantasy narration.',
    color: 'from-amber-600 to-orange-700',
    settings: {
      voice: 'Charon',
      pitch: -4,
      timbre: -3,
      speakingRate: 85,
      emotion: 'neutral',
      stylePrompt: 'Speak with a raspy, breathy, and aged quality. Add pauses for dramatic effect, like an old wizard telling a tale by a fire.'
    }
  },
  {
    id: 'vm_news_anchor',
    name: 'Prime News',
    description: 'Professional broadcast quality standard.',
    color: 'from-red-600 to-rose-700',
    settings: {
      voice: 'Puck',
      pitch: 0,
      timbre: 1,
      speakingRate: 105,
      emotion: 'excited',
      stylePrompt: 'Speak with the professional, projecting tone of a prime-time news anchor. Use clear, punchy intonation.'
    }
  },
  {
    id: 'vm_ethereal',
    name: 'Ethereal Spirit',
    description: 'Haunting, echoey, and soft.',
    color: 'from-violet-500 to-purple-800',
    settings: {
      voice: 'Kore',
      pitch: 3,
      timbre: 0,
      speakingRate: 90,
      emotion: 'whispering',
      stylePrompt: 'Speak in a dreamy, floating, and ethereal manner. Elongate vowels slightly and maintain a soft, haunting atmosphere.'
    }
  }
];
