import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
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
import { INDIAN_FOOD_DATABASE } from '../data/indianFoods';

interface AIChatbotViewProps {
  userProfile: UserProfile;
  currentPlan?: DayPlan;
}

const CHAT_MODELS = [
  'gemini-2.5-flash',
  'gemini-3-flash-preview',
  'gemini-2.5-flash-lite',
];

const LIVE_MODELS = [
  'gemini-2.5-flash-native-audio-preview-09-2025',
  'gemini-3.1-flash-live-preview',
  'gemini-2.0-flash-live-001',
];

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
        (process.env as any).GOOGLE_API_KEY ||
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
        (import.meta as any).env?.VITE_GOOGLE_API_KEY ||
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
  return new GoogleGenAI({ apiKey });
};

// ---------------------------------------------------------
// Helper: ICMR Indian Nutrition Knowledge Fallback Engine
// Ensures 100% reliability even during API rate limits or offline demos
// ---------------------------------------------------------
function generateICMRNutritionResponse(
  query: string,
  userProfile: UserProfile,
  currentPlan?: DayPlan,
  isVoiceShort = false
): string {
  const q = query.toLowerCase();
  const diet = userProfile?.dietType || 'vegetarian';
  const region = userProfile?.region || 'pan_india';
  const goal = userProfile?.healthGoal || 'general_wellness';

  // Filter matching foods from INDIAN_FOOD_DATABASE
  const matchingFoods = INDIAN_FOOD_DATABASE.filter((item) => {
    if (diet === 'vegetarian' && !item.dietaryType.includes('vegetarian')) return false;
    if (diet === 'vegan' && !item.dietaryType.includes('vegan')) return false;
    if (diet === 'jain' && !item.dietaryType.includes('jain')) return false;
    return true;
  });

  if (isVoiceShort) {
    if (q.includes('protein')) {
      return `Namaste ${userProfile?.name || ''}! To boost protein on a ${diet} Indian diet, include Moong Dal Chilla, Roasted Sattu drink, Paneer Bhurji, Sprouted Moong Salad, and Soy Chunks. Aim for 1 gram of protein per kilogram of body weight daily.`;
    }
    if (q.includes('snack') || q.includes('30') || q.includes('evening') || q.includes('budget')) {
      return `Great budget-friendly Indian evening snacks under 30 rupees include Roasted Makhana at 20 rupees, Sprouted Moong Chaat at 15 rupees, Roasted Chana with lemon at 15 rupees, and Masala Buttermilk at 12 rupees.`;
    }
    if (q.includes('sugar') || q.includes('diabet') || q.includes('fiber') || q.includes('glycemic')) {
      return `Dietary fiber slows down glucose absorption into your bloodstream, preventing sharp insulin spikes. Choose low glycemic Indian foods like Ragi Roti, Oats Upma, Methi Dal, and whole sprouts.`;
    }
    if (q.includes('liver') || q.includes('lung') || q.includes('smok') || q.includes('alcohol') || q.includes('stress')) {
      return `To protect your liver and lungs from oxidative stress, take Amla juice or guava daily for high Vitamin C, drink Turmeric ginger infusion, and include Beetroot-Carrot salad and Walnuts.`;
    }
    const topPicks = matchingFoods.slice(0, 3).map((f) => f.name).join(', ');
    return `Based on ICMR guidelines for your ${goal.replace('_', ' ')} goal, I recommend balanced Indian meals like ${topPicks}, along with 8 to 10 glasses of water daily. How else can I help you?`;
  }

  if (q.includes('protein')) {
    const highProtein = [...matchingFoods]
      .sort((a, b) => b.proteinG - a.proteinG)
      .slice(0, 5);
    return `Namaste ${userProfile?.name || 'there'}! Here is your ICMR-aligned guide to increasing protein on a ${diet} Indian diet:

- Daily Target: Aim for ${Math.round((userProfile?.weightKg || 65) * 1.0)}g to ${Math.round((userProfile?.weightKg || 65) * 1.2)}g of protein daily based on your weight (${userProfile?.weightKg || 65} kg).
${highProtein.map((f) => `- ${f.name}: ${f.proteinG}g protein | ${f.calories} kcal | Cost: ₹${f.estimatedCostINR} (${f.servingUnit})`).join('\n')}

Practical Tips:
1. Combine cereal and pulse in a 3:1 ratio (such as Dal-Chawal or Missi Roti) for a complete amino acid profile.
2. Add 1 glass of Roasted Chana Sattu (₹15) or 1 bowl of thick curd/greek yogurt with meals.
3. Snack on a handful of roasted chana and peanuts instead of fried namkeen.

Note: This is an educational nutritional guide based on ICMR-NIN standards.`;
  }

  if (q.includes('snack') || q.includes('30') || q.includes('evening') || q.includes('cheap') || q.includes('budget')) {
    const cheapSnacks = matchingFoods
      .filter((f) => f.category === 'snack' && f.estimatedCostINR <= 35)
      .slice(0, 5);
    return `Here are nutritious, ICMR-recommended Indian evening snacks under ₹30 that keep energy steady without refined sugar or trans fats:

${cheapSnacks.map((f) => `- ${f.name}: ₹${f.estimatedCostINR} | ${f.calories} kcal | ${f.proteinG}g Protein | ${f.fiberG}g Fiber (${f.servingUnit})`).join('\n')}

Why these work:
- High satiety from natural fiber and plant protein prevents late-night overeating.
- Low Glycemic Index avoids the 5 PM energy crash caused by biscuits or samosas.`;
  }

  if (q.includes('fiber') || q.includes('sugar') || q.includes('diabet') || q.includes('glycemic') || q.includes('gi')) {
    const lowGiFoods = matchingFoods
      .filter((f) => f.glycemicIndex === 'low' && f.fiberG >= 4)
      .slice(0, 5);
    return `Why Dietary Fiber is Crucial for Blood Sugar & Metabolic Health:

1. Slows Glucose Absorption: Soluble fiber forms a gel-like matrix in the gut, slowing carbohydrate breakdown and preventing post-meal blood sugar spikes.
2. Improves Insulin Sensitivity: ICMR recommends 30g to 40g of dietary fiber per day for Indian adults to protect against Type-2 Diabetes.
3. Gut Microbiome & Cholesterol: Binds excess bile acids and supports beneficial gut bacteria.

Top Low-GI, High-Fiber Indian Foods for You:
${lowGiFoods.map((f) => `- ${f.name}: ${f.fiberG}g Fiber | Low GI | ${f.calories} kcal | ₹${f.estimatedCostINR}`).join('\n')}

Simple Swap: Replace refined maida/white rice with hand-pounded brown rice, jowar/bajra bhakri, or vegetable daliya.`;
  }

  if (q.includes('liver') || q.includes('lung') || q.includes('smok') || q.includes('alcohol') || q.includes('detox') || q.includes('stress')) {
    const antioxidantFoods = [...matchingFoods]
      .sort((a, b) => b.vitC_mg + b.antioxidantRating * 10 - (a.vitC_mg + a.antioxidantRating * 10))
      .slice(0, 5);
    return `Supportive Indian Nutrition for Liver, Lung & Lifestyle Stress Recovery:

1. Vitamin C & Lung Repair: Oxidative stress depletes Vitamin C rapidly. Include 1 fresh Amla (600mg Vit C) or Guava daily.
2. Glutathione & Liver Support: Sulfur-rich and cruciferous foods (methi, spinach, garlic, turmeric with black pepper) aid natural hepatic detoxification.
3. Hydration & Electrolyte Balance: Aim for 3+ liters of fluids including coconut water, nimbu pani (no sugar), and jeera-dhaniya water.

Top Antioxidant-Rich Indian Choices:
${antioxidantFoods.map((f) => `- ${f.name}: ${f.vitC_mg}mg Vit C | Antioxidant Score: ${f.antioxidantRating}/5 | ₹${f.estimatedCostINR}`).join('\n')}

Disclaimer: Educational nutrition guidance only; consult a physician for clinical care.`;
  }

  // General query matching by dish keywords or personalized overview
  const keywordMatches = matchingFoods.filter(
    (f) =>
      q.includes(f.name.toLowerCase().split(' ')[0]) ||
      f.ingredients.some((ing) => q.includes(ing.toLowerCase()))
  );

  const selectedFoods = (keywordMatches.length > 0 ? keywordMatches : matchingFoods).slice(0, 4);

  return `Namaste ${userProfile?.name || 'there'}! Based on your profile (${userProfile?.age || 28} yrs, ${diet}, ${region.replace('_', ' ')} region, Goal: ${goal.replace('_', ' ')}) and ICMR-NIN guidelines, here are tailored recommendations for "${query}":

Recommended Indian Dishes & Nutritional Breakdown:
${selectedFoods.map((f) => `- ${f.name} (${f.servingUnit}): ${f.calories} kcal | Protein: ${f.proteinG}g | Carbs: ${f.carbsG}g | Fiber: ${f.fiberG}g | GI: ${f.glycemicIndex.toUpperCase()} | Est. Cost: ₹${f.estimatedCostINR}`).join('\n')}

Key Nutritional Takeaways:
- Follow the ICMR "My Plate for the Day": 50% vegetables/fruits/salads, 25% whole grains/millets, and 25% protein (dal, curd, paneer, sprouts, or lean protein).
- Keep cooking oil under 20-25g (4-5 teaspoons) per day using cold-pressed mustard, groundnut, or rice bran oil.
- Stay hydrated with 2.5 to 3 liters of water, buttermilk (chaas), or lemon water daily.

Note: I am an educational AI nutrition guide. Feel free to ask about specific dishes, calorie swaps, or meal timings!`;
}

// ---------------------------------------------------------
// Unified AI Generation Helper (Client SDK -> /api/chat -> ICMR Fallback)
// ---------------------------------------------------------
async function generateAIResponse(
  query: string,
  systemInstruction: string,
  historyMessages: ChatMessage[],
  userProfile: UserProfile,
  currentPlan?: DayPlan,
  isVoiceShort = false
): Promise<string> {
  let formattedHistory = historyMessages.slice(-6).map((msg) => ({
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

  // 1. Try Direct Client Gemini SDK across valid models
  const ai = getGeminiClient();
  if (ai) {
    for (const modelName of CHAT_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });
        if (response && response.text) {
          return cleanTextFormatting(response.text);
        }
      } catch (err: any) {
        console.warn(`[NutriSwasth AI] Client model ${modelName} error:`, err?.message);
      }
    }
  }

  // 2. Try Server/Vercel Serverless Function (/api/chat)
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction,
        temperature: 0.7,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.text) {
        return cleanTextFormatting(data.text);
      }
    }
  } catch (err: any) {
    console.warn('[NutriSwasth AI] /api/chat fallback error:', err?.message);
  }

  // 3. Guaranteed ICMR Nutrition Knowledge Engine Fallback
  return generateICMRNutritionResponse(query, userProfile, currentPlan, isVoiceShort);
}

// ---------------------------------------------------------
// Audio Streaming Helpers for Live Voice
// ---------------------------------------------------------
function downsampleBuffer(
  buffer: Float32Array,
  inputSampleRate: number,
  targetSampleRate: number
): Float32Array {
  if (targetSampleRate === inputSampleRate) {
    return buffer;
  }
  const sampleRateRatio = inputSampleRate / targetSampleRate;
  const newLength = Math.round(buffer.length / sampleRateRatio);
  const result = new Float32Array(newLength);
  let offsetResult = 0;
  let offsetBuffer = 0;
  while (offsetResult < result.length) {
    const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
    let accum = 0;
    let count = 0;
    for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
      accum += buffer[i];
      count++;
    }
    result[offsetResult] = count > 0 ? accum / count : 0;
    offsetResult++;
    offsetBuffer = nextOffsetBuffer;
  }
  return result;
}

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
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
  }
}

// ---------------------------------------------------------
// Live Voice Assistant Modal Component
// Supports Gemini Live WebSocket + Seamless Web Speech Recognition Fallback
// ---------------------------------------------------------
type LiveSessionStatus = 'idle' | 'connecting' | 'connected' | 'listening' | 'speaking' | 'error';

interface LiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
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
  const [voiceInputText, setVoiceInputText] = useState('');

  const sessionRef = useRef<any>(null);
  const audioPlayerRef = useRef<LiveAudioPlayer | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const recognitionRef = useRef<any>(null);
  const isMutedRef = useRef(false);
  const isFallbackModeRef = useRef(false);
  const isModalOpenRef = useRef(isOpen);

  isMutedRef.current = isMuted;
  isModalOpenRef.current = isOpen;

  const cleanup = useCallback(() => {
    isFallbackModeRef.current = false;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      recognitionRef.current = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
    }

    if (processorRef.current) {
      try {
        processorRef.current.disconnect();
      } catch (e) {
        // ignore
      }
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

  // Speak text out loud via Web Speech Synthesis (used in Hybrid/Browser Speech Mode)
  const speakResponseOutLoud = useCallback(
    (textToSpeak: string, onDone?: () => void) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        onDone?.();
        return;
      }

      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice =
          voices.find((v) => v.lang.includes('en-IN') || v.name.toLowerCase().includes('india')) ||
          voices.find((v) => v.lang.startsWith('en')) ||
          voices[0];

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
        utterance.rate = 1.02;
        utterance.pitch = selectedVoice === 'Puck' ? 1.1 : selectedVoice === 'Charon' ? 0.92 : 1.0;

        utterance.onstart = () => {
          if (isModalOpenRef.current) {
            setStatus('speaking');
            setAudioLevel(0.6);
          }
        };

        utterance.onend = () => {
          if (isModalOpenRef.current) {
            setAudioLevel(0.1);
            setStatus('listening');
          }
          onDone?.();
        };

        utterance.onerror = () => {
          if (isModalOpenRef.current) {
            setStatus('listening');
          }
          onDone?.();
        };

        window.speechSynthesis.speak(utterance);
      } catch (e) {
        onDone?.();
      }
    },
    [selectedVoice]
  );

  // Handle user spoken turn in Hybrid Speech Recognition Mode
  const handleSpokenQuery = useCallback(
    async (spokenText: string) => {
      const trimmed = spokenText.trim();
      if (!trimmed) return;

      setTranscript((prev) => [
        ...prev,
        { id: `${Date.now()}_user`, sender: 'user', text: trimmed },
      ]);

      setStatus('speaking');

      const systemInstruction = `You are "NutriSwasth AI", a conversational, warm Indian Nutritionist & Wellness Assistant.
Keep your spoken response concise, natural, and easy to listen to (2 to 3 sentences maximum).
Do not use any markdown, bullet points, or asterisks.
User Info: Age ${userProfile?.age || 28} (${userProfile?.ageGroup || 'Adult'}), Region: ${userProfile?.region || 'Pan-India'}, Diet: ${userProfile?.dietType || 'Vegetarian'}, Goal: ${userProfile?.healthGoal || 'General Health'}.`;

      const reply = await generateAIResponse(
        trimmed,
        systemInstruction,
        [],
        userProfile,
        currentPlan,
        true
      );

      if (!isModalOpenRef.current) return;

      setTranscript((prev) => [
        ...prev,
        { id: `${Date.now()}_model`, sender: 'model', text: reply },
      ]);

      speakResponseOutLoud(reply, () => {
        if (isFallbackModeRef.current && recognitionRef.current && isModalOpenRef.current && !isMutedRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            // already started
          }
        }
      });
    },
    [userProfile, currentPlan, speakResponseOutLoud]
  );

  // Start Web Speech API Continuous Voice Assistant (Fallback when Live WebSocket is unavailable)
  const startBrowserSpeechFallback = useCallback(
    async (existingStream?: MediaStream) => {
      isFallbackModeRef.current = true;
      setErrorMessage(null);
      setStatus('listening');

      // Setup mic volume visualizer if stream available
      try {
        const stream =
          existingStream ||
          (await navigator.mediaDevices.getUserMedia({ audio: true }));
        mediaStreamRef.current = stream;

        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const inputCtx = new AudioCtx();
        inputAudioCtxRef.current = inputCtx;
        const source = inputCtx.createMediaStreamSource(stream);
        const processor = inputCtx.createScriptProcessor(2048, 1, 1);
        processorRef.current = processor;

        processor.onaudioprocess = (e) => {
          if (isMutedRef.current) {
            setAudioLevel(0);
            return;
          }
          const inputData = e.inputBuffer.getChannelData(0);
          let sum = 0;
          for (let i = 0; i < inputData.length; i++) {
            sum += inputData[i] * inputData[i];
          }
          const rms = Math.sqrt(sum / inputData.length);
          setAudioLevel((prev) => prev * 0.7 + Math.min(rms * 10, 1) * 0.3);
        };

        source.connect(processor);
        processor.connect(inputCtx.destination);
      } catch (e) {
        // Mic visualizer optional in fallback mode
      }

      const SpeechRecognitionClass =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognitionClass) {
        try {
          const recognition = new SpeechRecognitionClass();
          recognition.continuous = true;
          recognition.interimResults = false;
          recognition.lang = 'en-IN';

          recognition.onresult = (event: any) => {
            if (isMutedRef.current) return;
            const lastResultIdx = event.results.length - 1;
            const text = event.results[lastResultIdx]?.[0]?.transcript;
            if (text && text.trim()) {
              try {
                recognition.stop();
              } catch (e) {
                // ignore
              }
              handleSpokenQuery(text);
            }
          };

          recognition.onerror = () => {
            // Keep status in listening so user can also use quick voice input or retry
          };

          recognition.onend = () => {
            if (
              isFallbackModeRef.current &&
              isModalOpenRef.current &&
              !isMutedRef.current &&
              window.speechSynthesis &&
              !window.speechSynthesis.speaking
            ) {
              try {
                recognition.start();
              } catch (e) {
                // ignore
              }
            }
          };

          recognitionRef.current = recognition;
          recognition.start();
        } catch (e) {
          console.warn('[LiveVoice] SpeechRecognition init warning:', e);
        }
      }
    },
    [handleSpokenQuery]
  );

  const startLiveSession = async () => {
    cleanup();
    setStatus('connecting');
    setErrorMessage(null);

    let stream: MediaStream | undefined;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;
    } catch (micErr: any) {
      console.warn('[LiveVoice] Mic permission not granted, enabling interactive voice fallback');
      await startBrowserSpeechFallback();
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      // No client-side key bundled; seamlessly use Browser Speech + /api/chat / ICMR voice assistant
      await startBrowserSpeechFallback(stream);
      return;
    }

    // Initialize Player
    const player = new LiveAudioPlayer();
    player.init();
    audioPlayerRef.current = player;

    const systemInstruction = `You are "NutriSwasth AI", a conversational, friendly Indian Nutritionist & Wellness Assistant.
You speak naturally in real-time voice with Indian users about their daily food, regional recipes, healthy swaps, hydration, and nutrition.
Keep spoken responses concise, warm, natural, and easy to understand over voice (1-3 sentences per turn unless detailed breakdown is requested).
User Info: Age ${userProfile?.age || 28} (${userProfile?.ageGroup || 'Adult'}), Region: ${userProfile?.region || 'Pan-India'}, Diet: ${userProfile?.dietType || 'Vegetarian'}, Goal: ${userProfile?.healthGoal || 'General Health'}.
Feel free to sprinkle culturally familiar greetings like 'Namaste' or reference regional Indian staples like Dal-Chawal, Idli-Sambar, Khichdi, Sprouts, or seasonal fruits.`;

    let connectedSession: any = null;

    for (const liveModel of LIVE_MODELS) {
      try {
        connectedSession = await ai.live.connect({
          model: liveModel,
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: selectedVoice,
                },
              },
            },
            systemInstruction: {
              parts: [{ text: systemInstruction }],
            },
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
              console.warn('[LiveVoice] Live WebSocket error, switching to Speech Recognition fallback:', err);
              if (!isFallbackModeRef.current && isModalOpenRef.current) {
                startBrowserSpeechFallback(mediaStreamRef.current || undefined);
              }
            },
            onclose: () => {
              if (!isFallbackModeRef.current && isModalOpenRef.current) {
                startBrowserSpeechFallback(mediaStreamRef.current || undefined);
              }
            },
          },
        });

        if (connectedSession) {
          break;
        }
      } catch (err) {
        console.warn(`[LiveVoice] Model ${liveModel} connection failed, trying next...`);
      }
    }

    if (!connectedSession) {
      // Seamlessly activate Web Speech Recognition + TTS voice mode
      await startBrowserSpeechFallback(stream);
      return;
    }

    sessionRef.current = connectedSession;
    setStatus('listening');

    // Capture Mic Audio at native hardware sampleRate and downsample to 16kHz PCM
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new AudioCtx();
      inputAudioCtxRef.current = inputCtx;

      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (isMutedRef.current || isFallbackModeRef.current) return;
        const inputData = e.inputBuffer.getChannelData(0);

        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += inputData[i] * inputData[i];
        }
        const rms = Math.sqrt(sum / inputData.length);
        setAudioLevel((prev) => prev * 0.7 + Math.min(rms * 10, 1) * 0.3);

        if (sessionRef.current) {
          try {
            const downsampled = downsampleBuffer(inputData, inputCtx.sampleRate, 16000);
            const pcmBase64 = pcmToBase64(downsampled);
            sessionRef.current.sendRealtimeInput({
              audio: {
                data: pcmBase64,
                mimeType: 'audio/pcm;rate=16000',
              },
            });
          } catch (sendErr) {
            // ignore transient frame error
          }
        }
      };

      source.connect(processor);
      processor.connect(inputCtx.destination);
    } catch (audioErr) {
      console.warn('[LiveVoice] Audio processor fallback:', audioErr);
      await startBrowserSpeechFallback(stream);
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
          className="relative w-full max-w-md rounded-2xl sm:rounded-3xl bg-[#0e1626] border border-[#1e2e4a] text-white shadow-2xl overflow-hidden flex flex-col items-center justify-between p-4 sm:p-7 min-h-[460px] sm:min-h-[520px] max-h-[92dvh] my-auto"
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
                      {selectedVoice === v.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 ml-1" />
                      )}
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
                  showTranscript
                    ? 'bg-indigo-500/20 text-indigo-300'
                    : 'bg-[#15233e] text-slate-400 hover:text-white'
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
          <div className="text-center my-2 sm:my-3 z-10 px-2">
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white font-sans">
              Live Voice Assistant
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium leading-snug">
              {status === 'connecting' && 'Connecting to Live AI...'}
              {status === 'listening' && 'NutriSwasth is listening. Speak now!'}
              {status === 'speaking' && 'NutriSwasth is speaking...'}
              {status === 'idle' && 'Tap the red button to speak'}
              {status === 'error' && (errorMessage || 'Connection issue. Tap to retry.')}
            </p>
          </div>

          {/* Central Concentric Pulse Visualizer + Big Button */}
          <div className="relative my-2 sm:my-3 flex items-center justify-center min-h-[150px] sm:min-h-[200px]">
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
              className="absolute w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-[#1b2b4d]/40 border border-indigo-500/20 pointer-events-none"
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
              className="absolute w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-[#15233e] border border-[#233a66] pointer-events-none shadow-inner"
            />

            {/* Inner Ring */}
            <div className="absolute w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-[#1b2e50] border border-[#2d477a] pointer-events-none flex items-center justify-center" />

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

            {/* Main Coral / Red Action Button */}
            <button
              id="live-voice-main-action-button"
              onClick={() => {
                if (isActive) {
                  cleanup();
                } else {
                  startLiveSession();
                }
              }}
              className={`relative z-10 w-18 h-18 sm:w-22 sm:h-22 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg active:scale-95 touch-manipulation ${
                isActive
                  ? 'bg-[#f04438] hover:bg-[#e0382d] text-white shadow-red-500/40 ring-4 ring-red-500/20'
                  : 'bg-[#f04438] hover:bg-[#e0382d] text-white shadow-red-500/30'
              }`}
              title={isActive ? 'Stop Voice Conversation' : 'Start Voice Conversation'}
            >
              {isActive ? (
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-[4px] bg-white" />
              ) : (
                <Mic className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              )}
            </button>
          </div>

          {/* Interactive Voice Prompt Bar (Allows speaking OR tapping/typing to trigger spoken AI response) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!voiceInputText.trim()) return;
              const q = voiceInputText;
              setVoiceInputText('');
              handleSpokenQuery(q);
            }}
            className="w-full flex items-center gap-1.5 z-10 mb-2"
          >
            <input
              type="text"
              value={voiceInputText}
              onChange={(e) => setVoiceInputText(e.target.value)}
              placeholder="Speak into mic or type to hear voice reply..."
              className="flex-1 px-3 py-2 rounded-xl bg-[#15233e] border border-[#233a66] text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-400"
            />
            <button
              type="submit"
              disabled={!voiceInputText.trim()}
              className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold cursor-pointer transition-colors"
            >
              Speak
            </button>
          </form>

          {/* Bottom Live Waveform Badge */}
          <div className="flex flex-col items-center gap-2 w-full z-10">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#15233e]/80 border border-[#233a66] text-xs font-semibold text-indigo-300">
              <Activity
                className={`w-3.5 h-3.5 text-indigo-400 ${isActive ? 'animate-pulse' : 'opacity-40'}`}
              />
              <span className="tracking-wide">Live Audio Active</span>
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer min-h-[36px] touch-manipulation disabled:opacity-40 ${
                  isMuted
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-[#15233e] text-slate-300 hover:text-white border border-[#233a66]'
                }`}
              >
                {isMuted ? (
                  <MicOff className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <Mic className="w-3.5 h-3.5 shrink-0" />
                )}
                <span>{isMuted ? 'Muted' : 'Mic Active'}</span>
              </button>

              <button
                id="reconnect-button"
                onClick={() => startLiveSession()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#15233e] hover:bg-[#1f335b] text-slate-300 hover:text-white border border-[#233a66] text-xs font-medium transition-colors cursor-pointer min-h-[36px] touch-manipulation"
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
              className="w-full mt-2.5 p-2.5 rounded-2xl bg-[#090f1a]/90 border border-[#1e2e4a] text-xs max-h-28 overflow-y-auto space-y-1.5 no-scrollbar"
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

      const aiReplyText = await generateAIResponse(
        query.trim(),
        systemInstruction,
        messages,
        userProfile,
        currentPlan,
        false
      );

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackReply = generateICMRNutritionResponse(
        query.trim(),
        userProfile,
        currentPlan,
        false
      );
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
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
              title="Open Live Voice Assistant"
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
