import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, Square, Loader2, Activity } from 'lucide-react';
import { getAIInstance } from '../services/ai';

class AudioStreamer {
  audioCtx: AudioContext | null = null;
  nextTime: number = 0;

  init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
  }

  addPCM16(base64: string) {
    if (!this.audioCtx) return;
    try {
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const pcm16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(pcm16.length);
      for (let i = 0; i < pcm16.length; i++) {
        float32[i] = pcm16[i] / 32768;
      }

      const audioBuffer = this.audioCtx.createBuffer(1, float32.length, 24000);
      audioBuffer.getChannelData(0).set(float32);

      const source = this.audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioCtx.destination);

      const currentTime = this.audioCtx.currentTime;
      if (this.nextTime < currentTime) {
        this.nextTime = currentTime;
      }
      source.start(this.nextTime);
      this.nextTime += audioBuffer.duration;
    } catch (e) {
      console.error("Error adding audio chunk", e);
    }
  }

  interrupt() {
    if (this.audioCtx) {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      this.nextTime = 0;
    }
  }

  stop() {
    if (this.audioCtx) {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
  }
}

export const LiveVoice: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const sessionRef = useRef<any>(null);
  const audioStreamerRef = useRef<AudioStreamer>(new AudioStreamer());
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  const stopRecording = useCallback(() => {
    if (processorRef.current && audioCtxRef.current) {
      processorRef.current.disconnect();
      audioCtxRef.current.close().catch(() => {});
      processorRef.current = null;
      audioCtxRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  }, []);

  const disconnect = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.then((session: any) => {
         if(session.close) session.close();
      }).catch(() => {});
      sessionRef.current = null;
    }
    stopRecording();
    audioStreamerRef.current.stop();
    setStatus('idle');
  }, [stopRecording]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  const connect = async () => {
    try {
      setStatus('connecting');
      audioStreamerRef.current.init();

      const ai = getAIInstance();
      if (!ai) throw new Error("AI not initialized");

      const sessionPromise = ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } }
          },
          systemInstruction: "You are Nova, an AI assistant for NovaFin. You must ONLY answer questions related to NovaFin, credit card recommendations, and navigating this website. If a user asks about anything else, politely decline and steer the conversation back to NovaFin. Keep your answers concise and helpful.",
        },
        callbacks: {
          onopen: async () => {
            setStatus('connected');
            try {
              streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
              audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
              const source = audioCtxRef.current.createMediaStreamSource(streamRef.current);
              processorRef.current = audioCtxRef.current.createScriptProcessor(4096, 1, 1);

              processorRef.current.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                const pcm16 = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) {
                  pcm16[i] = Math.max(-1, Math.min(1, inputData[i])) * 32767;
                }
                let binary = '';
                const bytes = new Uint8Array(pcm16.buffer);
                for (let i = 0; i < bytes.byteLength; i++) {
                  binary += String.fromCharCode(bytes[i]);
                }
                const base64 = btoa(binary);

                sessionPromise.then((session: any) => {
                  session.sendRealtimeInput({
                    audio: { data: base64, mimeType: 'audio/pcm;rate=16000' }
                  });
                });
              };

              source.connect(processorRef.current);
              processorRef.current.connect(audioCtxRef.current.destination);
            } catch (mediaErr) {
              console.error("Microphone access error:", mediaErr);
              setStatus('error');
              disconnect();
            }
          },
          onmessage: (message: any) => {
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              audioStreamerRef.current.addPCM16(base64Audio);
            }
            if (message.serverContent?.interrupted) {
              audioStreamerRef.current.interrupt();
            }
          },
          onclose: () => {
            disconnect();
          },
          onerror: (e: any) => {
            console.error("Live API Error:", e);
            setStatus('error');
            disconnect();
          }
        }
      });

      sessionRef.current = sessionPromise;
    } catch (err) {
      console.error("Connection failed:", err);
      setStatus('error');
      disconnect();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 space-y-8">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-white">Live Voice Assistant</h3>
        <p className="text-sm text-gray-400">
          {status === 'idle' && "Tap to start a real-time conversation with Nova."}
          {status === 'connecting' && "Connecting to Nova..."}
          {status === 'connected' && "Nova is listening. Speak now!"}
          {status === 'error' && "Connection failed. Please try again."}
        </p>
      </div>

      <div className="relative flex items-center justify-center w-32 h-32">
        {status === 'connected' && (
          <>
            <div className="absolute inset-0 bg-nova-accent/20 rounded-full animate-ping"></div>
            <div className="absolute inset-2 bg-nova-accent/40 rounded-full animate-pulse"></div>
          </>
        )}
        <button
          onClick={status === 'connected' ? disconnect : connect}
          disabled={status === 'connecting'}
          className={`relative z-10 flex items-center justify-center w-20 h-20 rounded-full shadow-2xl transition-all duration-300 ${
            status === 'connected' 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-nova-accent hover:bg-indigo-500'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {status === 'connecting' ? (
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          ) : status === 'connected' ? (
            <Square className="w-8 h-8 text-white fill-current" />
          ) : (
            <Mic className="w-8 h-8 text-white" />
          )}
        </button>
      </div>
      
      {status === 'connected' && (
        <div className="flex items-center gap-2 text-nova-accent">
          <Activity className="w-5 h-5 animate-pulse" />
          <span className="text-sm font-medium animate-pulse">Live</span>
        </div>
      )}
    </div>
  );
};
