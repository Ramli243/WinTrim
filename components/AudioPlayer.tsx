
import React, { useState, useEffect, useRef } from 'react';

// From Gemini docs
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Updated function signature to match Gemini API documentation for audio decoding.
// This makes the function more reusable and aligns with best practices.
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


interface AudioPlayerProps {
  audioData: string;
}

const PlayIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.72-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
  </svg>
);

const PauseIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Zm9 0a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
  </svg>
);


const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioData }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  // FIX: Initialize useRef with null. Some versions of React types require an initial value for useRef, which resolves the "Expected 1 arguments, but got 0" error.
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawWaveform = (buffer: AudioBuffer | null) => {
    const canvas = canvasRef.current;
    if (!canvas || !buffer) return;
    const data = buffer.getChannelData(0);
    const context = canvas.getContext('2d');
    if (!context) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    context.scale(dpr, dpr);

    const { width, height } = rect;

    context.clearRect(0, 0, width, height);
    context.lineWidth = 2;
    context.strokeStyle = '#60a5fa'; // tailwind blue-400
    context.beginPath();

    const middle = height / 2;
    const step = Math.ceil(data.length / width);

    for (let i = 0; i < width; i++) {
        let min = 1.0;
        let max = -1.0;
        for (let j = 0; j < step; j++) {
            const datum = data[(i * step) + j];
            if (datum < min) min = datum;
            if (datum > max) max = datum;
        }
        context.moveTo(i, middle + min * middle);
        context.lineTo(i, middle + max * middle);
    }
    context.stroke();
  };

  const playFromBuffer = (buffer: AudioBuffer | null) => {
    if (!buffer || !audioContextRef.current) return;
    
    if (audioSourceRef.current) {
        // FIX: The `stop` method for AudioBufferSourceNode was called without arguments. Passing 0 stops playback immediately.
        audioSourceRef.current.stop(0);
    }

    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    source.start(0);

    source.onended = () => {
        setIsPlaying(false);
        audioSourceRef.current = null;
    };
    
    audioSourceRef.current = source;
    setIsPlaying(true);
  }

  const handlePlayPause = () => {
    if (isPlaying && audioSourceRef.current) {
        // FIX: The `stop` method for AudioBufferSourceNode was called without arguments. Passing 0 stops playback immediately.
        audioSourceRef.current.stop(0); 
    } else if (!isPlaying && audioBuffer) {
        playFromBuffer(audioBuffer);
    }
  };

  useEffect(() => {
    if (!audioData) return;
    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const audioContext = audioContextRef.current;

    const setupAudio = async () => {
        try {
            if (audioSourceRef.current) {
                // FIX: The `stop` method for AudioBufferSourceNode was called without arguments. Passing 0 stops playback immediately.
                audioSourceRef.current.stop(0);
            }
            const decodedData = decode(audioData);
            // Gemini TTS sample rate is 24000, and it's single channel (mono).
            const buffer = await decodeAudioData(decodedData, audioContext, 24000, 1);
            setAudioBuffer(buffer);
            playFromBuffer(buffer);
        } catch (error) {
            console.error("Failed to set up audio:", error);
        }
    };
    setupAudio();
    return () => {
      // FIX: The `stop` method for AudioBufferSourceNode was called without arguments. Passing 0 stops playback immediately.
      if (audioSourceRef.current) audioSourceRef.current.stop(0);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioData]);

  useEffect(() => {
    drawWaveform(audioBuffer);
    const handleResize = () => drawWaveform(audioBuffer);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [audioBuffer]);


  return (
    <div className="bg-slate-700/50 rounded-lg p-4 flex items-center gap-4">
      <button
        onClick={handlePlayPause}
        className="flex-shrink-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>
      <div className="flex-grow flex flex-col justify-center min-w-0">
         <div className="text-sm font-medium">
            <p className="text-white truncate">Generated Speech</p>
            <p className="text-slate-400">{isPlaying ? 'Playing...' : 'Ready to play'}</p>
         </div>
         <canvas ref={canvasRef} className="w-full h-10 mt-1"></canvas>
      </div>
    </div>
  );
};

export default AudioPlayer;