import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquareText,
  Send,
  Sparkles,
  AlertTriangle,
  User,
  Bot,
  RefreshCw,
  Mic,
  MicOff,
  Radio,
  X,
  Activity,
  ChevronDown,
  MessageSquare,
} from 'lucide-react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { UserProfile, ChatMessage, DayPlan } from '../types';

interface AIChatbotViewProps {
  userProfile: UserProfile;
  currentPlan?: DayPlan;
}

// ---------------------------------------------------------
// Helper: Clean formatting
// ---------------------------------------------------------
function cleanTextFormatting(text: string): string {
  if (!text) return '';
  return text
    .replace(/^#+\s*/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_{1,2}(.*?)_{1,2}/g, '$1')
    .replace(/^>\s*/gm, '')
    .replace(/`{1,3}(.*?)`{1,3}/g, '$1')
    .trim();
}

// ---------------------------------------------------------
// Helper: Gemini Client Initialization
// ---------------------------------------------------------
export const getGeminiApiKey = (): string => {
  let key = '';

  // 1. Check process.env (Vite define)
  try {
    if (typeof process !== 'undefined' && process.env) {
      key =
        (process.env as any).GEMINI_API_KEY ||
        (process.env as any).VITE_GEMINI_API_KEY ||
        '';
    }
  } catch (e) {
    // ignore
  }

  // 2. Check import.meta.env
  if (!key) {
    try {
      key =
        (import.meta as any).env?.GEMINI_API_KEY ||
        (import.meta as any).env?.VITE_GEMINI_API_KEY ||
        '';
    } catch (e) {
      // ignore
    }
  }

  // 3. Check window / global fallback
  if (!key && typeof window !== 'undefined') {
    try {
      key =
        (window as any)?.__GEMINI_API_KEY__ ||
        (window as any)?.GEMINI_API_KEY ||
        '';
    } catch (e) {
      // ignore
    }
  }

  return (key || '').trim();
};

const getGeminiClient = () => {
  const apiKey = getGeminiApiKey();
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// ---------------------------------------------------------
// Audio Streaming Helpers for Live Voice
// ---------------------------------------------------------
function floatTo16BitPCM(input: Float32Array): ArrayBuffer {
  const output = new DataView(new ArrayBuffer(input.length * 2));
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return output.buffer;
}

function pcmToBase64(float32Array: Float32Array): string {
  const arrayBuffer = floatTo16BitPCM(float32Array);
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToPcmFloat32(base64: string): Float32Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const dataView = new DataView(bytes.buffer);
  const float32 = new Float32Array(bytes.length / 2);
  for (let i = 0; i < float32.length; i++) {
    const int16 = dataView.getInt16(i * 2, true);
    float32[i] = int16 < 0 ? int16 / 0x8000 : int16 / 0x7fff;
  }
  return float32;
}

class LiveAudioPlayer {
  private audioCtx: AudioContext | null = null;
  private nextStartTime: number = 0;
  private activeSources: AudioBufferSourceNode[] = [];
  private analyser: AnalyserNode | null = null;

  public init() {
    if (!this.audioCtx || this.audioCtx.state === 'closed') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContextClass({ sampleRate: 24000 });
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 128;
      this.analyser.connect(this.audioCtx.destination);
      this.nextStartTime = this.audioCtx.currentTime;
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public playChunk(base64Audio: string) {
    if (!this.audioCtx) this.init();
    if (!this.audioCtx) return;

    try {
      const float32Data = base64ToPcmFloat32(base64Audio);
      if (float32Data.length === 0) return;

      const audioBuffer = this.audioCtx.createBuffer(1, float32Data.length, 24000);
      audioBuffer.getChannelData(0).set(float32Data);

      const source = this.audioCtx.createBufferSource();
      source.buffer = audioBuffer;

      if (this.analyser) {
        source.connect(this.analyser);
      } else {
        source.connect(this.audioCtx.destination);
      }

      const now = this.audioCtx.currentTime;
      const startTime = Math.max(now, this.nextStartTime);
      source.start(startTime);
      this.nextStartTime = startTime + audioBuffer.duration;

      this.activeSources.push(source);
      source.onended = () => {
        const idx = this.activeSources.indexOf(source);
        if (idx !== -1) {
          this.activeSources.splice(idx, 1);
        }
      };
    } catch (e) {
      console.error('Error playing audio chunk:', e);
    }
  }

  public stopAll() {
    for (const src of this.activeSources) {
      try {
        src.stop();
      } catch (e) {
        // ignore
      }
    }
    this.activeSources = [];
    if (this.audioCtx) {
      this.nextStartTime = this.audioCtx.currentTime;
    }
  }

  public close() {
    this.stopAll();
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
  }
}

// ---------------------------------------------------------
// Live Voice Assistant Modal Component (Inside this single file)
// ---------------------------------------------------------
type LiveSessionStatus = 'idle' | 'connecting' | 'connected' | 'listening' | 'speaking' | 'error';

interface LiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: UserProfile;
  currentPlan?: DayPlan;
}

const LiveVoiceModal: React.FC<LiveVoiceModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  currentPlan,
}) => {
  const [status, setStatus] = useState<LiveSessionStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('Zephyr');
  const [showVoicePicker, setShowVoicePicker] = useState(false);
  const [showTranscript, setShowTranscript] = useState(true);
  const [transcript, setTranscript] = useState<
    Array<{ sender: 'user' | 'model'; text: string; id: string }>
  >([]);
  const [audioLevel, setAudioLevel] = useState(0);

  const sessionRef = useRef<any>(null);
  const audioPlayerRef = useRef<LiveAudioPlayer | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const isMutedRef = useRef(false);

  isMutedRef.current = isMuted;

  const cleanup = useCallback(() => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close().catch(() => {});
      inputAudioCtxRef.current = null;
    }

    if (audioPlayerRef.current) {
      audioPlayerRef.current.close();
      audioPlayerRef.current = null;
    }

    if (sessionRef.current) {
      try {
        sessionRef.current.close();
      } catch (e) {
        // ignore
      }
      sessionRef.current = null;
    }

    setStatus('idle');
    setAudioLevel(0);
  }, []);

  const startLiveSession = async () => {
    cleanup();
    setStatus('connecting');
    setErrorMessage(null);

    try {
      const ai = getGeminiClient();
      if (!ai) {
        throw new Error('Gemini API key is not configured. Please add GEMINI_API_KEY in Secrets.');
      }

      // 1. Initialize Player
      const player = new LiveAudioPlayer();
      player.init();
      audioPlayerRef.current = player;

      // 2. Request Mic access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;

      const systemInstruction = `You are "NutriSwasth AI", a conversational, friendly Indian Nutritionist & Wellness Assistant.
You speak naturally in real-time voice with Indian users about their daily food, regional recipes, healthy swaps, hydration, and nutrition.
Keep spoken responses concise, warm, natural, and easy to understand over voice (1-3 sentences per turn unless detailed breakdown is requested).
User Info: Age ${userProfile?.age || 28} (${userProfile?.ageGroup || 'Adult'}), Region: ${userProfile?.region || 'Pan-India'}, Diet: ${userProfile?.dietType || 'Vegetarian'}, Goal: ${userProfile?.healthGoal || 'General Health'}.
Feel free to sprinkle culturally familiar greetings like 'Namaste' or reference regional Indian staples like Dal-Chawal, Idli-Sambar, Khichdi, Sprouts, or seasonal fruits.`;

      // 3. Connect to Gemini Live API
      const session = await ai.live.connect({
        model: 'gemini-3.1-flash-live-preview',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: selectedVoice,
              },
            },
          },
          systemInstruction,
          outputAudioTranscription: {},
          inputAudioTranscription: {},
        },
        callbacks: {
          onmessage: (message: LiveServerMessage) => {
            const modelTurn = message.serverContent?.modelTurn;
            if (modelTurn?.parts) {
              for (const part of modelTurn.parts) {
                if (part.inlineData?.data) {
                  setStatus('speaking');
                  audioPlayerRef.current?.playChunk(part.inlineData.data);
                }
                if (part.text) {
                  setTranscript((prev) => {
                    const last = prev[prev.length - 1];
                    if (last && last.sender === 'model') {
                      return [...prev.slice(0, -1), { ...last, text: last.text + part.text }];
                    }
                    return [
                      ...prev,
                      { id: `${Date.now()}_${Math.random()}`, sender: 'model', text: part.text || '' },
                    ];
                  });
                }
              }
            }

            if ((message as any).outputAudioTranscription?.text) {
              setTranscript((prev) => {
                const text = (message as any).outputAudioTranscription.text;
                const last = prev[prev.length - 1];
                if (last && last.sender === 'model') {
                  return [...prev.slice(0, -1), { ...last, text: last.text + ' ' + text }];
                }
                return [...prev, { id: `${Date.now()}_${Math.random()}`, sender: 'model', text }];
              });
            }

            if ((message as any).inputAudioTranscription?.text) {
              setTranscript((prev) => {
                const text = (message as any).inputAudioTranscription.text;
                const last = prev[prev.length - 1];
                if (last && last.sender === 'user') {
                  return [...prev.slice(0, -1), { ...last, text: last.text + ' ' + text }];
                }
                return [...prev, { id: `${Date.now()}_${Math.random()}`, sender: 'user', text }];
              });
            }

            if (message.serverContent?.interrupted) {
              audioPlayerRef.current?.stopAll();
              setStatus('listening');
            }

            if (message.serverContent?.turnComplete) {
              setStatus('listening');
            }
          },
          onerror: (err: any) => {
            console.error('[LiveVoice] Session error:', err);
            setErrorMessage(err?.message || 'Live session encountered an error.');
            setStatus('error');
          },
          onclose: () => {
            console.log('[LiveVoice] Session closed');
            setStatus((s) => (s === 'error' ? 'error' : 'idle'));
          },
        },
      });

      sessionRef.current = session;
      setStatus('listening');

      // 4. Capture Mic Audio and stream PCM 16kHz
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new AudioCtx({ sampleRate: 16000 });
      inputAudioCtxRef.current = inputCtx;

      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (isMutedRef.current) return;
        const inputData = e.inputBuffer.getChannelData(0);

        // Volume level for visualizer
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += inputData[i] * inputData[i];
        }
        const rms = Math.sqrt(sum / inputData.length);
        setAudioLevel((prev) => prev * 0.7 + Math.min(rms * 10, 1) * 0.3);

        // Stream audio chunk to Gemini Live API
        if (sessionRef.current) {
          const pcmBase64 = pcmToBase64(inputData);
          sessionRef.current.sendRealtimeInput({
            audio: {
              data: pcmBase64,
              mimeType: 'audio/pcm;rate=16000',
            },
          });
        }
      };

      source.connect(processor);
      processor.connect(inputCtx.destination);
    } catch (err: any) {
      console.error('[LiveVoice] Init error:', err);
      setErrorMessage(err?.message || 'Microphone access denied or connection failed.');
      setStatus('error');
    }
  };

  useEffect(() => {
    if (isOpen) {
      startLiveSession();
    } else {
      cleanup();
    }
    return () => {
      cleanup();
    };
  }, [isOpen, selectedVoice]);

  const voices = [
    { id: 'Zephyr', name: 'Zephyr (Warm & Empathetic)' },
    { id: 'Kore', name: 'Kore (Calm & Clear)' },
    { id: 'Puck', name: 'Puck (Enthusiastic & Energetic)' },
    { id: 'Charon', name: 'Charon (Deep & Professional)' },
    { id: 'Fenrir', name: 'Fenrir (Balanced & Direct)' },
  ];

  if (!isOpen) return null;

  const isActive = status === 'listening' || status === 'speaking' || status === 'connecting';

  return (
    <AnimatePresence>
      <div
        id="live-voice-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      >
        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-md rounded-2xl sm:rounded-3xl bg-[#0e1626] border border-[#1e2e4a] text-white shadow-2xl overflow-hidden flex flex-col items-center justify-between p-4 sm:p-8 min-h-[460px] sm:min-h-[520px] max-h-[92dvh] my-auto"
        >
          {/* Top Controls Bar */}
          <div className="w-full flex items-center justify-between z-10 gap-2">
            {/* Voice Selector Pill */}
            <div className="relative">
              <button
                id="voice-selector-button"
                onClick={() => setShowVoicePicker(!showVoicePicker)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#15233e] hover:bg-[#1a2d52] border border-[#233a66] text-[11px] font-medium text-slate-300 transition-colors cursor-pointer min-h-[38px] touch-manipulation"
              >
                <Radio className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate max-w-[90px] sm:max-w-none">{selectedVoice}</span>
                <ChevronDown className="w-3 h-3 opacity-60 shrink-0" />
              </button>

              {showVoicePicker && (
                <div className="absolute top-full left-0 mt-1.5 w-52 sm:w-56 rounded-xl bg-[#15233e] border border-[#233a66] shadow-xl p-1.5 z-30">
                  <p className="text-[10px] text-slate-400 font-semibold px-2.5 py-1 uppercase tracking-wider">
                    Select Voice
                  </p>
                  {voices.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVoice(v.id);
                        setShowVoicePicker(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors flex items-center justify-between min-h-[36px] ${
                        selectedVoice === v.id
                          ? 'bg-indigo-600/30 text-indigo-300 font-semibold'
                          : 'text-slate-300 hover:bg-[#1f335b]'
                      }`}
                    >
                      <span className="truncate">{v.name}</span>
                      {selectedVoice === v.id && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 ml-1" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Top Right Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                id="toggle-transcript-button"
                onClick={() => setShowTranscript(!showTranscript)}
                title="Toggle Transcripts"
                className={`p-2 sm:p-2.5 rounded-full transition-colors cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center touch-manipulation ${
                  showTranscript ? 'bg-indigo-500/20 text-indigo-300' : 'bg-[#15233e] text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
              </button>

              <button
                id="close-live-modal-button"
                onClick={() => {
                  cleanup();
                  onClose();
                }}
                className="p-2 sm:p-2.5 rounded-full bg-[#15233e] hover:bg-[#1f335b] text-slate-400 hover:text-white transition-colors cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center touch-manipulation"
                title="Close Live Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Assistant Title & Status Heading */}
          <div className="text-center my-3 sm:my-4 z-10 px-2">
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white font-sans">
              Live Voice Assistant
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium leading-snug">
              {status === 'connecting' && 'Connecting to Live AI...'}
              {status === 'listening' && 'Nova is listening. Speak now!'}
              {status === 'speaking' && 'NutriSwasth is speaking...'}
              {status === 'idle' && 'Tap the red button to speak'}
              {status === 'error' && (errorMessage || 'Connection issue. Tap to retry.')}
            </p>
          </div>

          {/* Central Concentric Pulse Visualizer + Big Button (Matching Image Exact Structure) */}
          <div className="relative my-3 sm:my-4 flex items-center justify-center min-h-[160px] sm:min-h-[220px]">
            {/* Outermost animated pulse ring */}
            <motion.div
              animate={{
                scale: isActive ? [1, 1.12 + audioLevel * 0.4, 1] : 1,
                opacity: isActive ? [0.25, 0.45, 0.25] : 0.15,
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute w-52 h-52 sm:w-72 sm:h-72 rounded-full bg-[#1b2b4d]/40 border border-indigo-500/20 pointer-events-none"
            />

            {/* Middle Navy Ring */}
            <motion.div
              animate={{
                scale: isActive ? [1, 1.06 + audioLevel * 0.3, 1] : 1,
                opacity: isActive ? [0.6, 0.9, 0.6] : 0.4,
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute w-40 h-40 sm:w-56 sm:h-56 rounded-full bg-[#15233e] border border-[#233a66] pointer-events-none shadow-inner"
            />

            {/* Inner Ring */}
            <div className="absolute w-30 h-30 sm:w-40 sm:h-40 rounded-full bg-[#1b2e50] border border-[#2d477a] pointer-events-none flex items-center justify-center" />

            {/* Glowing Accent Aura when Active */}
            {isActive && (
              <motion.div
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                  scale: [0.95, 1.15, 0.95],
                }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-red-500/25 blur-lg pointer-events-none"
              />
            )}

            {/* Main Coral / Red Action Button (Matching Uploaded Image) */}
            <button
              id="live-voice-main-action-button"
              onClick={() => {
                if (isActive) {
                  cleanup();
                } else {
                  startLiveSession();
                }
              }}
              className={`relative z-10 w-18 h-18 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg active:scale-95 touch-manipulation ${
                isActive
                  ? 'bg-[#f04438] hover:bg-[#e0382d] text-white shadow-red-500/40 ring-4 ring-red-500/20'
                  : 'bg-[#f04438] hover:bg-[#e0382d] text-white shadow-red-500/30'
              }`}
              title={isActive ? 'Stop Voice Conversation' : 'Start Voice Conversation'}
            >
              {isActive ? (
                // Solid white rounded square (Stop icon) matching screenshot
                <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-[4px] bg-white" />
              ) : (
                // Microphone icon to start
                <Mic className="w-7 h-7 sm:w-9 sm:h-9 text-white" />
              )}
            </button>
          </div>

          {/* Bottom Live Waveform Badge (Matching Image) */}
          <div className="flex flex-col items-center gap-2.5 sm:gap-3 w-full z-10 mt-1 sm:mt-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#15233e]/80 border border-[#233a66] text-xs font-semibold text-indigo-300">
              <Activity className={`w-3.5 h-3.5 text-indigo-400 ${isActive ? 'animate-pulse' : 'opacity-40'}`} />
              <span className="tracking-wide">Live</span>
              {isActive && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block ml-0.5" />
              )}
            </div>

            {/* Mute Mic and Reset Quick Bar */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                id="toggle-mic-mute-button"
                disabled={!isActive}
                onClick={() => setIsMuted(!isMuted)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer min-h-[38px] touch-manipulation disabled:opacity-40 ${
                  isMuted
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-[#15233e] text-slate-300 hover:text-white border border-[#233a66]'
                }`}
              >
                {isMuted ? <MicOff className="w-3.5 h-3.5 shrink-0" /> : <Mic className="w-3.5 h-3.5 shrink-0" />}
                <span>{isMuted ? 'Muted' : 'Mic Active'}</span>
              </button>

              <button
                id="reconnect-button"
                onClick={() => startLiveSession()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#15233e] hover:bg-[#1f335b] text-slate-300 hover:text-white border border-[#233a66] text-xs font-medium transition-colors cursor-pointer min-h-[38px] touch-manipulation"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Real-time Live Transcript Drawer */}
          {showTranscript && transcript.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full mt-3 p-3 rounded-2xl bg-[#090f1a]/90 border border-[#1e2e4a] text-xs max-h-28 sm:max-h-32 overflow-y-auto space-y-2 no-scrollbar"
            >
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center justify-between">
                <span>Live Conversation Transcript</span>
                <span className="text-[9px] text-indigo-400">{selectedVoice}</span>
              </div>
              {transcript.slice(-3).map((item) => (
                <div
                  key={item.id}
                  className={`p-2 rounded-xl text-xs leading-relaxed ${
                    item.sender === 'user'
                      ? 'bg-[#15233e] text-indigo-100 ml-3 sm:ml-4'
                      : 'bg-[#1a2942] text-slate-200 mr-3 sm:mr-4 border border-indigo-500/20'
                  }`}
                >
                  <span className="font-bold text-[10px] uppercase block opacity-70 mb-0.5">
                    {item.sender === 'user' ? 'You' : 'NutriSwasth'}
                  </span>
                  <p>{item.text}</p>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// ---------------------------------------------------------
// Main AIChatbotView Component
// ---------------------------------------------------------
export const AIChatbotView: React.FC<AIChatbotViewProps> = ({ userProfile, currentPlan }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Namaste ${userProfile.name || 'there'}! I am your NutriSwasth AI Assistant. I can answer questions about your personalized meal plan, explain why specific Indian foods were recommended, or suggest budget-friendly regional alternatives. How can I help you today? You can also tap "Live Voice Assistant" for real-time spoken conversations!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (queryText?: string) => {
    const query = queryText || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const ai = getGeminiClient();
      if (!ai) {
        throw new Error('Gemini API key is missing. Please add GEMINI_API_KEY in Secrets.');
      }

      const systemInstruction = `You are "NutriSwasth AI", a friendly, expert Indian Nutritionist & Health Assistant.
Your mission is to provide evidence-based, culturally relevant, affordable, and easy-to-follow nutrition advice for the Indian population across all age groups and regions (North, South, East, West).

USER CONTEXT:
- Age / Life Stage: ${userProfile?.ageGroup || 'Working Adult'} (${userProfile?.age || 28} years)
- Gender: ${userProfile?.gender || 'Not specified'}
- Diet Preference: ${userProfile?.dietType || 'Vegetarian'}
- Region: ${userProfile?.region || 'Pan-India'}
- Health Goal: ${userProfile?.healthGoal || 'General Health'}
- Daily Context / Routine: ${currentPlan?.routineContext || 'Normal Day'}
- Lifestyle Indicators: ${userProfile?.isSmoker ? 'Smoker (suggest antioxidant/Vitamin C rich foods)' : 'Non-smoker'}, ${userProfile?.alcoholUsage !== 'none' ? `Alcohol usage: ${userProfile?.alcoholUsage} (suggest liver supportive foods & hydration)` : 'No alcohol'}
- Budget Level: ${userProfile?.budget || 'Balanced'}

GUIDELINES & FORMATTING RULES:
1. Speak warmly, respectfully, and clearly. Use simple language that anyone in India can understand.
2. Recommend real, authentic Indian dishes (e.g., Dal, Roti, Sabzi, Idli, Dosa, Poha, Khichdi, Sattu, Sprouts, Curd, Chana, Amaranth, Amla, Green Tea, etc.).
3. If the user asks about lifestyle risks (smoking/alcohol), provide supportive dietary countermeasures while maintaining a gentle, non-judgmental tone.
4. Keep responses concise, structured with bullet points using simple dash (-) or numbers (1., 2.), and actionable. Include estimated cost in Indian Rupees (₹) when suggesting substitutes.
5. STRICT FORMATTING RULE: NEVER use markdown headers (#), asterisks (* or **), bold (**text**), or hashtags (#). Write purely in clean plain text with standard dashes (-) for bullets and normal line breaks.
6. DISCLAIMER: Always maintain that you are an educational AI tool and not a substitute for clinical medical diagnosis or registered dietitians for severe medical conditions.`;

      let formattedHistory = messages.slice(-6).map((msg) => ({
        role: msg.sender === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.text || '' }],
      }));

      while (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
        formattedHistory.shift();
      }

      const contents = [
        ...formattedHistory,
        { role: 'user', parts: [{ text: query }] },
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const rawText = response.text || 'I am sorry, I could not process your query.';
      const aiReplyText = cleanTextFormatting(rawText);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `I encountered an issue generating a response: ${err.message || 'Please check your GEMINI_API_KEY connection.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    'How do I increase my protein on a vegetarian diet?',
    'What are healthy Indian evening snacks under ₹30?',
    'Why is dietary fiber important for blood sugar?',
    'Suggest foods to protect my liver and lungs from lifestyle stress',
  ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100dvh-5.5rem)] sm:h-[calc(100dvh-6rem)] flex flex-col space-y-2 sm:space-y-2.5">
      {/* Top Header Bar & Separate Live Voice Button */}
      <div className="card-tactile px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3 shrink-0">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#e2ebe0] text-[#1b4317] flex items-center justify-center font-bold shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#2d5a27]" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xs sm:text-base font-bold text-[#1c221a] font-serif-heading leading-tight truncate">
              Dr. NutriSwasth AI Expert
            </h1>
            <p className="text-[10px] text-slate-500 hidden md:block truncate">
              Multilingual Indian nutrition & voice-assisted health guide
            </p>
          </div>
        </div>

        {/* Action Buttons (Prominent Live Voice Assistant Button) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            id="open-live-voice-header-button"
            onClick={() => setIsVoiceModalOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-xl bg-[#0e1626] hover:bg-[#15233e] text-white border border-[#223558] text-xs font-semibold shadow-sm hover:shadow-indigo-500/20 transition-all cursor-pointer min-h-[40px] touch-manipulation group"
          >
            <div className="relative flex items-center justify-center shrink-0">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute inline-flex" />
              <span className="w-2 h-2 rounded-full bg-red-500 relative inline-flex" />
            </div>
            <Mic className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform shrink-0" />
            <span className="font-medium text-[11px] sm:text-xs text-slate-100 whitespace-nowrap">
              <span className="hidden xs:inline">Live </span>Voice Assistant
            </span>
          </button>

          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#fff4d9] border border-[#e8d29b] text-[#5c4200] text-[10px] font-semibold">
            <AlertTriangle className="w-3 h-3 text-[#8a6300] shrink-0" />
            <span>Educational AI</span>
          </div>
        </div>
      </div>

      {/* Main Chat Conversation Container */}
      <div className="flex-1 card-tactile flex flex-col overflow-hidden min-h-0">
        {/* Messages List Area */}
        <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 sm:space-y-3.5 bg-[#fbfaf7]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2 sm:gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#2d5a27] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              )}
              <div
                className={`max-w-[88%] sm:max-w-[78%] rounded-2xl p-3 sm:p-3.5 text-xs sm:text-sm shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#2d5a27] text-white rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-[#e8e5dc] rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed font-sans">{msg.text}</div>
                <div
                  className={`text-[9px] sm:text-[10px] mt-1.5 font-mono ${
                    msg.sender === 'user' ? 'text-white/70 text-right' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
              {msg.sender === 'user' && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-2 sm:gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#2d5a27] text-white flex items-center justify-center shrink-0 shadow-xs animate-pulse">
                <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="bg-white border border-[#e8e5dc] rounded-2xl rounded-tl-xs p-3 sm:p-3.5 text-xs sm:text-sm text-slate-600 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#2d5a27]" />
                <span className="text-xs font-medium">NutriSwasth AI is analyzing nutrition facts...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-[#f4f2ea] border-t border-[#e8e5dc] overflow-x-auto flex items-center gap-1.5 sm:gap-2 shrink-0 no-scrollbar">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#2d5a27]" /> Quick Queries:
          </span>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              id={`quick-query-btn-${idx}`}
              onClick={() => handleSendMessage(prompt)}
              className="text-xs py-1 px-2.5 rounded-full bg-white hover:bg-[#e8efe6] hover:text-[#1b4317] border border-[#ddd9ce] text-slate-700 whitespace-nowrap transition-colors cursor-pointer shrink-0 shadow-2xs font-medium touch-manipulation min-h-[30px]"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Input Bar with Dedicated Voice & Text Input */}
        <div className="p-2.5 sm:p-3 bg-white border-t border-[#e8e5dc] shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Separate Voice Conversation Button next to Input */}
            <button
              type="button"
              id="open-live-voice-input-button"
              onClick={() => setIsVoiceModalOpen(true)}
              className="p-2.5 sm:p-3 rounded-xl bg-[#0e1626] hover:bg-[#15233e] text-red-400 hover:text-white border border-[#223558] transition-all cursor-pointer shrink-0 shadow-xs flex items-center justify-center min-w-[42px] min-h-[42px] touch-manipulation group"
              title="Open Live Voice Assistant (gemini-3.1-flash-live-preview)"
            >
              <Mic className="w-4 h-4 sm:w-4.5 sm:h-4.5 group-hover:scale-110 transition-transform" />
            </button>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about Indian recipes, macros, vitamins, or dietary swaps..."
              className="flex-1 px-3 sm:px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#d6d1c4] focus:outline-none focus:ring-2 focus:ring-[#2d5a27] focus:border-transparent bg-[#fcfbfa] min-h-[42px]"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="p-2.5 sm:p-3 rounded-xl bg-[#2d5a27] text-white hover:bg-[#23471f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0 shadow-xs min-w-[42px] min-h-[42px] flex items-center justify-center touch-manipulation"
            >
              <Send className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Live Voice Assistant Modal */}
      <LiveVoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        userProfile={userProfile}
        currentPlan={currentPlan}
      />
    </div>
  );
};
