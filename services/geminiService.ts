
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
  
  let textToSpeak = input;
  let currentInputType = inputType;

  // --- Step 1: Transcription (If Audio Input) ---
  // Since direct Audio-to-Audio is currently limited on the REST API, we transcribe first
  // to ensure robust operation using the specialized TTS model for output.
  if (inputType === 'audio') {
    try {
        const transResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{
                parts: [
                    { inlineData: { mimeType: 'audio/mp3', data: input } },
                    { text: "Transcribe the spoken words or lyrics in this audio file verbatim. Output ONLY the text, no descriptions, no timestamps." }
                ]
            }]
        });
        
        if (transResponse.text) {
            textToSpeak = transResponse.text;
            currentInputType = 'text'; // Proceed as text
        } else {
            throw new Error("Could not transcribe audio content.");
        }
    } catch (error) {
        console.error("Transcription failed:", error);
        throw new Error("Failed to process input audio. Please ensure the file contains clear speech.");
    }
  }

  const modifiers: string[] = [];

  // --- Modifier Logic ---
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

    // Map RVC params to style modifiers for audio-converted inputs
    if (inputType === 'audio') {
        if (protectVolume > 0.35) modifiers.push("enunciating consonants very clearly");
        if (indexRate > 0.8) modifiers.push("with strong character");
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
    
    prompt = `Sing the following lyrics ${styleDescription}${pitchDescription}. Emphasize a clear melodic and rhythmic delivery.\n\n${stylePrompt ? `Style Direction: ${stylePrompt}\n\n` : ''}Lyrics: "${textToSpeak}"`;
  } else {
    const modifierString = modifiers.length > 0 ? ` ${modifiers.join(', ')}` : '';
    
    const instruction = (accent && accent !== 'Standard')
      ? `Speak the following text in ${language} with an ${accent} accent${modifierString}.`
      : `Speak the following text in ${language}${modifierString}.`;
      
    const styleInstruction = stylePrompt ? `\n\nImportant Style Direction: ${stylePrompt}` : '';
    
    prompt = `${instruction}${styleInstruction}\n\nText: "${textToSpeak}"`;
  }

  try {
    // Use specialized TTS model for high quality output
    const response = await ai.models.generateContent({
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

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (base64Audio) {
      return base64Audio;
    } else {
      throw new Error("Generation successful, but no audio was produced.");
    }
  } catch (error) {
    console.error("Error generating speech:", error);
    
    if (error instanceof Error) {
        if (error.message.startsWith("Generation successful")) throw error;

        const errorMessage = error.message.toLowerCase();

        if (errorMessage.includes('api key')) throw new Error("Authentication failed. Please check your API key.");
        if (errorMessage.includes('not found')) throw new Error("The selected model is not available. Please try again later.");
        if (errorMessage.includes('invalid_argument')) throw new Error("Invalid configuration. Please try adjusting your settings.");
        if (errorMessage.includes('resource_exhausted')) throw new Error("Rate limit exceeded. Please wait a moment.");
        if (errorMessage.includes('blocked')) throw new Error("Request blocked due to safety settings.");
        if (errorMessage.includes('modality')) throw new Error("The feature is currently unavailable in your region.");
        
        throw new Error(error.message || "An unexpected error occurred.");
    }
    
    throw new Error("An unknown error occurred.");
  }
}
