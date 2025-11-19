
import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateSpeech(
  input: string, // Can be text or audio base64
  inputType: 'text' | 'audio',
  voice: string, 
  language: string, 
  accent: string, 
  isSinging: boolean,
  pitch: number,
  singingStyle: string,
  timbre: number,
  speakingRate: number,
  emotion: string,
  stylePrompt?: string,
  // RVC Specific Params
  indexRate: number = 0.7,
  f0Method: string = 'rmvpe',
  protectVolume: number = 0.33
): Promise<string> {
  
  const modifiers: string[] = [];

  // --- Modifier Logic (Shared) ---
  if (!isSinging) {
    if (emotion && emotion !== 'neutral') {
      if (emotion === 'whispering') {
        modifiers.push('in a whispering tone');
      } else {
        modifiers.push(`in a ${emotion} tone`);
      }
    }
    
    if (pitch !== 0) {
        if (pitch > 8) modifiers.push('at a very high pitch');
        else if (pitch > 4) modifiers.push('at a high pitch');
        else if (pitch > 0) modifiers.push('at a slightly high pitch');
        else if (pitch < -8) modifiers.push('at a very low pitch');
        else if (pitch < -4) modifiers.push('at a low pitch');
        else if (pitch < 0) modifiers.push('at a slightly low pitch');
    }

    if (timbre !== 0) {
        if (timbre > 3) modifiers.push('with a very bright timbre');
        else if (timbre > 0) modifiers.push('with a bright timbre');
        else if (timbre < -3) modifiers.push('with a very deep timbre');
        else if (timbre < 0) modifiers.push('with a deep timbre');
    }

    if (speakingRate !== 100) {
        if (speakingRate > 125) modifiers.push('at a very fast pace');
        else if (speakingRate > 100) modifiers.push('at a fast pace');
        else if (speakingRate < 75) modifiers.push('at a very slow pace');
        else if (speakingRate < 100) modifiers.push('at a slow pace');
    }
  }

  // --- Construct Prompt/System Instruction ---
  let prompt = "";
  if (isSinging) {
    let styleDescription: string;
    switch (singingStyle) {
      case 'cheerful_pop':
        styleDescription = "as an upbeat, cheerful pop song with a catchy melody";
        break;
      case 'gentle_lullaby':
        styleDescription = "as a soft, gentle lullaby with a soothing and calm melody";
        break;
      case 'folk_ballad':
        styleDescription = "as a heartfelt folk ballad with an acoustic feel and emotional delivery";
        break;
      case 'dramatic_opera':
        styleDescription = "in a dramatic, operatic style with powerful and sustained notes";
        break;
      case 'simple_rap':
        styleDescription = "as a simple rap with a steady rhythm and clear enunciation. Focus on the beat and flow.";
        break;
      default:
        styleDescription = "as a simple, cheerful song";
        break;
    }
    let pitchDescription = '';
    if (pitch !== 0) {
        if (pitch > 4) pitchDescription = ' in a high register';
        else if (pitch > 0) pitchDescription = ' in a slightly high register';
        else if (pitch < -4) pitchDescription = ' in a low register';
        else if (pitch < 0) pitchDescription = ' in a slightly low register';
    }
    prompt = `Sing the following ${inputType === 'audio' ? 'audio content' : 'lyrics'} ${styleDescription}${pitchDescription}. Emphasize a clear melodic and rhythmic delivery.\n\n${stylePrompt ? `Style Direction: ${stylePrompt}\n\n` : ''}${inputType === 'text' ? `Lyrics: "${input}"` : ''}`;
  } else {
    const modifierString = modifiers.length > 0 ? ` ${modifiers.join(', ')}` : '';
    
    const instruction = (accent && accent !== 'Standard')
      ? `Speak the following ${inputType === 'audio' ? 'audio content' : 'text'} in ${language} with an ${accent} accent${modifierString}.`
      : `Speak the following ${inputType === 'audio' ? 'audio content' : 'text'} in ${language}${modifierString}.`;
      
    const styleInstruction = stylePrompt ? `\n\nImportant Style Direction: ${stylePrompt}` : '';
    
    prompt = `${instruction}${styleInstruction}\n\n${inputType === 'text' ? `Text: "${input}"` : ''}`;
  }

  try {
    let response;

    if (inputType === 'audio') {
        // Audio-to-Audio (RVC Style)
        // Use standard flash model for multimodal input
        
        let f0Description = '';
        switch (f0Method) {
            case 'rmvpe': f0Description = 'Ensure high-fidelity pitch tracking (RMVPE style).'; break;
            case 'crepe': f0Description = 'Ensure smooth and natural pitch transitions (CREPE style).'; break;
            case 'harvest': f0Description = 'Ensure robust, thick vocal quality (Harvest style).'; break;
            case 'pm': f0Description = 'Prioritize fast, direct pitch conversion.'; break;
            default: f0Description = 'Maintain accurate pitch.';
        }

        const protectInstruction = protectVolume > 0.2 ? 'Protect voiceless consonants from pitch artifacts.' : '';
        const indexInstruction = `Apply the target voice style with ${Math.round(indexRate * 100)}% intensity relative to the input content.`;

        // System instruction to guide the transformation
        const systemInstruction = `You are a professional voice conversion AI (RVC). 
        Your task is to listen to the input audio and repeat EXACTLY what is said (or sung), 
        but performing it with the specific voice, style, and emotion requested.
        
        Technical directives:
        1. ${f0Description}
        2. ${indexInstruction}
        3. ${protectInstruction}
        
        Do not add any conversational filler. Output ONLY the transformed speech/song audio.`;

        const parts = [
            { inlineData: { mimeType: 'audio/mp3', data: input } }, // Input is base64
            { text: prompt }
        ];

        response = await ai.models.generateContent({
            model: "gemini-2.5-flash", // Using Flash for multimodal capabilities
            contents: [{ parts }],
            config: {
                systemInstruction,
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: voice },
                    },
                },
            },
        });

    } else {
        // Text-to-Speech
        // Use specialized TTS model
        response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: voice },
                    },
                },
            },
        });
    }

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (base64Audio) {
      return base64Audio;
    } else {
      throw new Error("Generation successful, but no audio was produced. The model may not support the requested input.");
    }
  } catch (error) {
    console.error("Error generating speech:", error);
    
    if (error instanceof Error) {
        if (error.message.startsWith("Generation successful")) {
            throw error;
        }

        const errorMessage = error.message.toLowerCase();

        if (errorMessage.includes('api key')) throw new Error("Authentication failed. Please check your API key.");
        if (errorMessage.includes('invalid_argument')) throw new Error("Invalid request configuration.");
        if (errorMessage.includes('resource_exhausted')) throw new Error("Rate limit exceeded. Please wait.");
        if (errorMessage.includes('blocked')) throw new Error("Request blocked due to safety settings.");
        if (errorMessage.includes('internal')) throw new Error("Service temporarily unavailable.");
        
        throw new Error("An unexpected error occurred while communicating with the API.");
    }
    
    throw new Error("An unknown error occurred.");
  }
}
