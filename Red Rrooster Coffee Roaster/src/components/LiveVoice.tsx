import { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { Mic, MicOff, X, Loader2, Volume2, Radio } from 'lucide-react';

const getSystemInstruction = () => {
  const now = new Date();
  const currentTime = now.toLocaleString('en-US', { timeZone: 'America/New_York', weekday: 'long', hour: 'numeric', minute: 'numeric', hour12: true });

  return `You are RoosterBot, the voice assistant for Red Rooster Coffee Roaster. 
CURRENT TIME IN FLOYD, VA: ${currentTime}

Keep your responses relatively short and conversational, suitable for a voice call.
You are helpful, friendly, and knowledgeable about coffee, our hours, and our location in Floyd, VA.

ADDRESS THESE PAIN POINTS:
1. NO-SHOWS: If discussing tours, politely emphasize that we are a small team and require 24h notice for cancellations.
2. INFO: Hours are M-F 7-5, Sat 8-3, Sun Closed. Location: 823 E Main St.
3. AFTER-HOURS: If it is currently CLOSED (check the CURRENT TIME above) and the user has an URGENT wholesale issue, tell them to call 540-745-7338 ext 2.
`;
};

const ai = new GoogleGenAI({ apiKey: "" });

// Audio Context & Processor Configuration
const INPUT_SAMPLE_RATE = 16000;
const OUTPUT_SAMPLE_RATE = 24000;

export default function LiveVoice({ onClose }: { onClose: () => void }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState<number>(0); // For visualizer
  
  const [error, setError] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sessionRef = useRef<any>(null);
  const nextPlayTimeRef = useRef<number>(0);

  useEffect(() => {
    let cleanupFn = () => {};

    const startSession = async () => {
      try {
        // 1. Initialize Audio Context
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
          sampleRate: INPUT_SAMPLE_RATE, // Try to request 16kHz context if possible
        });

        // 2. Connect to Gemini Live
        const sessionPromise = ai.live.connect({
          model: "gemini-2.5-flash-native-audio-preview-09-2025",
          config: {
            systemInstruction: getSystemInstruction(),
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
            },
          },
          callbacks: {
            onopen: async () => {
              console.log("Gemini Live Connected");
              setIsConnected(true);
              setError(null);
              
              // Start Audio Capture after connection
              await startAudioCapture(await sessionPromise);
            },
            onmessage: (msg: LiveServerMessage) => {
              handleServerMessage(msg);
            },
            onclose: () => {
              console.log("Gemini Live Disconnected");
              setIsConnected(false);
            },
            onerror: (err) => {
              console.error("Gemini Live Error:", err);
              setIsConnected(false);
              setError("Connection error. Please try again.");
            }
          }
        });

        sessionRef.current = await sessionPromise;

      } catch (err) {
        console.error("Failed to start session:", err);
        setError("Failed to start voice session.");
      }
    };

    startSession();

    return () => {
      stopAudioCapture();
      sessionRef.current?.close();
      audioContextRef.current?.close();
    };
  }, []);

  const startAudioCapture = async (session: any) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: INPUT_SAMPLE_RATE,
        } 
      });
      mediaStreamRef.current = stream;

      if (!audioContextRef.current) return;

      const source = audioContextRef.current.createMediaStreamSource(stream);
      const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (isMuted) return;

        const inputData = e.inputBuffer.getChannelData(0);
        
        // Calculate volume for visualizer
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += inputData[i] * inputData[i];
        }
        setVolume(Math.sqrt(sum / inputData.length));

        // Convert Float32 to Int16 PCM
        const pcmData = floatTo16BitPCM(inputData);
        const base64Data = arrayBufferToBase64(pcmData.buffer);

        session.sendRealtimeInput({
          media: {
            mimeType: "audio/pcm;rate=16000",
            data: base64Data
          }
        });
      };

      source.connect(processor);
      processor.connect(audioContextRef.current.destination); // ScriptProcessor needs connection to destination to run

    } catch (err: any) {
      console.error("Audio Capture Error:", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError("Microphone permission denied. Please allow microphone access.");
      } else {
        setError("Failed to access microphone.");
      }
    }
  };

  const stopAudioCapture = () => {
    processorRef.current?.disconnect();
    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
  };

  const handleServerMessage = (msg: LiveServerMessage) => {
    const { serverContent } = msg;
    if (serverContent?.modelTurn?.parts?.[0]?.inlineData) {
      const base64Audio = serverContent.modelTurn.parts[0].inlineData.data;
      playAudioChunk(base64Audio);
    }
  };

  const playAudioChunk = (base64Audio: string) => {
    if (!audioContextRef.current) return;

    const binaryString = window.atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Convert Int16 PCM to Float32
    const int16Data = new Int16Array(bytes.buffer);
    const float32Data = new Float32Array(int16Data.length);
    for (let i = 0; i < int16Data.length; i++) {
      float32Data[i] = int16Data[i] / 32768.0;
    }

    const buffer = audioContextRef.current.createBuffer(1, float32Data.length, OUTPUT_SAMPLE_RATE);
    buffer.getChannelData(0).set(float32Data);

    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);

    // Schedule playback
    const currentTime = audioContextRef.current.currentTime;
    const playTime = Math.max(currentTime, nextPlayTimeRef.current);
    source.start(playTime);
    nextPlayTimeRef.current = playTime + buffer.duration;
  };

  // Helpers
  const floatTo16BitPCM = (input: Float32Array) => {
    const output = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return output;
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[var(--color-rooster-dark)] w-full max-w-md rounded-3xl p-8 text-center shadow-2xl border border-white/10 relative overflow-hidden">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Status */}
        <div className="mb-12">
          <div className="w-24 h-24 mx-auto bg-[var(--color-rooster-green)] rounded-full flex items-center justify-center mb-6 relative">
            {isConnected && !error && (
              <div 
                className="absolute inset-0 rounded-full bg-[var(--color-rooster-green)] opacity-50 animate-ping"
                style={{ animationDuration: volume > 0.01 ? '1s' : '3s' }}
              />
            )}
            <Radio className={`w-10 h-10 text-white ${isConnected && !error ? 'animate-pulse' : ''}`} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-white mb-2">
            {error ? "Connection Error" : (isConnected ? "RoosterBot Live" : "Connecting...")}
          </h2>
          <p className={`${error ? "text-red-400 font-bold" : "text-stone-400"} text-sm`}>
            {error || (isConnected ? "Listening... Go ahead and speak." : "Establishing secure line...")}
          </p>
        </div>

        {/* Visualizer (Simple) */}
        <div className="h-16 flex items-center justify-center gap-1 mb-12">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i}
              className="w-2 bg-[var(--color-rooster-gold)] rounded-full transition-all duration-75"
              style={{ 
                height: isConnected ? Math.max(8, Math.min(64, volume * 500 * (Math.random() + 0.5))) : 4,
                opacity: isConnected ? 1 : 0.3
              }}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-6">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-full transition-all ${
              isMuted 
                ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
          
          <button 
            onClick={onClose}
            className="px-8 py-4 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-colors"
          >
            End Call
          </button>
        </div>

      </div>
    </div>
  );
}
