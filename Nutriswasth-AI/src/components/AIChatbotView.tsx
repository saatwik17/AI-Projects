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
} from 'lucide-react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { UserProfile, ChatMessage, DayPlan } from '../types';
import { INDIAN_FOOD_DATABASE } from '../data/indianFoods';
import { calculateNutritionTargets } from '../utils/nutritionCalculator';

interface AIChatbotViewProps {
  userProfile: UserProfile;
  currentPlan?: DayPlan;
}

const CHAT_MODELS = [
  'gemini-2.5-flash',
  'gemini-flash-latest',
  'gemini-3.8-flash',
  'gemini-3.1-flash-lite',
  'gemini-3-flash-preview',
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
// Helper: Build Complete Website + User + General Knowledge Context
// ---------------------------------------------------------
function buildWebsiteAndUserSystemContext(
  userProfile: UserProfile,
  currentPlan?: DayPlan,
  isVoiceMode = false
): string {
  const targets = calculateNutritionTargets(userProfile);
  const heightM = (userProfile?.heightCm || 170) / 100;
  const bmi = ((userProfile?.weightKg || 65) / (heightM * heightM)).toFixed(1);

  const mealSummary = currentPlan?.meals?.length
    ? currentPlan.meals
        .map(
          (m) =>
            `${m.mealType}: ${m.dish.name} (${m.dish.calories} kcal, ${m.dish.proteinG}g protein, ₹${m.dish.estimatedCostINR}, Status: ${m.isTaken ? 'Completed/Eaten' : 'Scheduled'})`
        )
        .join(' | ')
    : 'Standard balanced Indian meal plan';

  return `You are "NutriSwasth AI", an intelligent, warm, and versatile AI Assistant built into the NutriSwasth AI website.

YOUR DUAL CAPABILITY (IMPORTANT):
1. Expert on NutriSwasth AI Website & Indian Nutrition: You know everything about this website, its features, its tech stack, ICMR-NIN Indian nutrition guidelines, and the user's live profile and active meal plan.
2. General-Purpose All-Round Assistant: You can ALSO answer ANY other question on ANY topic that the user asks (including general knowledge, science, technology, coding, fitness, yoga, medicine, cooking recipes, academic/college viva questions, math, history, current affairs, or casual conversation). Never refuse a general question — answer it accurately, helpfully, and clearly!

COMPLETE KNOWLEDGE OF THIS WEBSITE (NUTRISWASTH AI):
- Purpose: An Indian Personalized Nutrition, Meal Planning, and Preventive Healthcare platform aligned with ICMR-NIN (Indian Council of Medical Research - National Institute of Nutrition) standards and UN SDG 3 (Good Health & Well-Being).
- 5 Core Modules on the Website:
  1. Dashboard: Real-time calorie & macro tracking, BMR/TDEE/BMI metrics, Routine Context switcher (Normal Day, High Stress, Exam/Deadline, Travel), interactive 3D meal cards, ICMR comparison charts, hydration tracker, and smart dish swaps.
  2. Meal Planner: Generates and customizes a full-day Indian diet plan (Breakfast, Lunch, Evening Snack, Dinner) with portion multipliers, dish swapping, macro breakdowns, and daily cost in Indian Rupees (₹).
  3. My Health Profile (Lifestyle & Risk Assessment): Tracks personal biometrics and evaluates lifestyle habits like smoking (oxidative stress & extra Vitamin C needs) and alcohol intake (liver support & extra hydration), recommending protective Indian superfoods.
  4. Food Database: Searchable & filterable catalog of 50+ authentic regional Indian dishes standardized with ICMR-NIN & IFCT data (calories, protein, carbs, fats, fiber, Vitamin C, Glycemic Index Low/Medium/High, prep time, and cost in ₹).
  5. AI Nutritionist & Live Voice Assistant: Real-time text chat and live voice assistant for diet coaching, website guidance, and general Q&A.
- Tech Stack & Database:
  - Frontend: React 18, TypeScript, Tailwind CSS, Motion animations, Lucide icons, and Recharts.
  - Backend & AI: Serverless architecture using Google Gemini AI (@google/genai SDK), Node.js/Vite build pipeline, and Web Speech & Web Audio APIs.
  - Database: Hybrid architecture combining an ICMR-NIN / IFCT standardized Indian Food Dataset, Browser Storage/State for user profiles and meal logs, and real-time Gemini AI inference.

CURRENT USER LIVE PROFILE ON THE WEBSITE:
- Name: ${userProfile?.name || 'User'} (${userProfile?.age || 21} yrs, ${userProfile?.ageGroup || 'student'}, ${userProfile?.gender || 'male'})
- Height & Weight: ${userProfile?.heightCm || 172} cm, ${userProfile?.weightKg || 68} kg (BMI: ${bmi})
- Activity & Goal: ${userProfile?.activityLevel || 'light'}, Goal: ${userProfile?.healthGoal || 'maintain'}
- Diet, Region & Setting: ${userProfile?.dietType || 'vegetarian'}, ${userProfile?.region || 'north'} India, Setting: ${userProfile?.setting || 'hostel'}, Budget: ${userProfile?.budget || 'budget'}
- Lifestyle Indicators: Smoking: ${userProfile?.smokingStatus || 'non_smoker'}, Alcohol: ${userProfile?.alcoholUsage || 'none'}
- Daily ICMR Targets: ${targets.targetCalories} kcal/day (BMR: ${targets.bmr} kcal, TDEE: ${targets.tdee} kcal), Protein: ${targets.proteinG}g, Carbs: ${targets.carbsG}g, Fat: ${targets.fatG}g, Fiber: ${targets.fiberG}g, Vitamin C: ${targets.vitC_mg}mg, Water: ${targets.waterLiters} Liters.

CURRENT ACTIVE MEAL PLAN ON THE WEBSITE (${currentPlan?.dayName || 'Today'}, Routine: ${currentPlan?.routineContext || 'normal'}):
- Scheduled Meals: ${mealSummary}
- Total Planned Nutrition: ${currentPlan?.totalCalories || 0} kcal, ${currentPlan?.totalProtein || 0}g Protein, ${currentPlan?.totalCarbs || 0}g Carbs, ${currentPlan?.totalFat || 0}g Fat, Total Cost: ₹${currentPlan?.totalCostINR || 0}

${
  isVoiceMode
    ? `VOICE MODE INSTRUCTIONS: Speak naturally, warmly, and concisely (1 to 3 sentences per turn unless detailed explanation is requested). Answer any question the user asks—whether about this website, nutrition, or any general topic. Never use markdown symbols.`
    : `TEXT CHAT FORMATTING RULES:
1. Answer any question the user asks—about the NutriSwasth AI website, their meal plan, Indian nutrition, or any general topic/subject—clearly and accurately.
2. NEVER use markdown headers (#), asterisks (* or **), bold (**text**), or backticks. Write in clean plain text using simple dashes (-) or numbers (1., 2.) for lists.`
}`;
}

// ---------------------------------------------------------
// Helper: Fallback Knowledge Engine (Only used if offline / rate-limited)
// ---------------------------------------------------------
function generateFallbackResponse(
  query: string,
  userProfile: UserProfile,
  currentPlan?: DayPlan,
  isVoiceShort = false
): string {
  const q = query.toLowerCase();
  const diet = userProfile?.dietType || 'vegetarian';
  const region = userProfile?.region || 'pan_india';
  const goal = userProfile?.healthGoal || 'maintain';
  const targets = calculateNutritionTargets(userProfile);
  const heightM = (userProfile?.heightCm || 170) / 100;
  const bmi = ((userProfile?.weightKg || 65) / (heightM * heightM)).toFixed(1);

  if (
    q.includes('website') ||
    q.includes('this app') ||
    q.includes('nutriswasth') ||
    q.includes('platform') ||
    q.includes('feature') ||
    q.includes('about this') ||
    q.includes('project') ||
    q.includes('tech stack') ||
    q.includes('dashboard') ||
    q.includes('module')
  ) {
    if (isVoiceShort) {
      return `NutriSwasth AI is an Indian personalized nutrition and preventive health website based on ICMR guidelines. It includes a real-time Dashboard, a regional Indian Meal Planner, a Health Profile and BMI tracker, an Indian Food Database, and me, your AI Voice and Chat Assistant.`;
    }
    return `Welcome to NutriSwasth AI! Here is a complete overview of our website:

1. Dashboard: Displays your daily calorie and macronutrient progress (${targets.targetCalories} kcal target), BMR/TDEE metrics, Routine Context switcher (Normal, High Stress, Exam/Deadline, Travel), hydration tracker (${targets.waterLiters}L goal), ICMR target comparison charts, and 3D interactive meal cards.
2. Meal Planner: Generates and customizes your full-day Indian meal plan (Breakfast, Lunch, Evening Snack, Dinner) tailored to your region (${region.replace('_', ' ')}), diet (${diet}), setting (${userProfile?.setting || 'home'}), and budget in Rupees (₹).
3. My Health Profile: Calculates your BMI (${bmi}), BMR (${targets.bmr} kcal), and TDEE (${targets.tdee} kcal), and evaluates lifestyle factors like smoking or alcohol intake to recommend antioxidant and liver-supportive Indian superfoods.
4. Food Database: A searchable catalog of 50+ authentic Indian foods standardized with ICMR-NIN values showing calories, protein, carbs, fat, fiber, Vitamin C, Glycemic Index, prep time, and cost in ₹.
5. Dr. NutriSwasth AI & Live Voice Assistant: Real-time text and voice assistant that answers questions about this website, your meal plan, Indian nutrition, and any general topic.

Tech Stack: React 18, TypeScript, Tailwind CSS, Motion, Recharts, Google Gemini AI (@google/genai), and ICMR-NIN data layers.`;
  }

  if (
    q.includes('my meal plan') ||
    q.includes('current plan') ||
    q.includes('today plan') ||
    q.includes("today's plan") ||
    q.includes('what is in my plan') ||
    q.includes('what should i eat today')
  ) {
    const mealsList = currentPlan?.meals || [];
    if (isVoiceShort) {
      const spokenMeals = mealsList.map((m) => `${m.mealType} is ${m.dish.name}`).join(', ');
      return `On your website meal plan today, ${spokenMeals}. Your total planned intake is ${currentPlan?.totalCalories || targets.targetCalories} calories and ${currentPlan?.totalProtein || targets.proteinG} grams of protein, costing around ${currentPlan?.totalCostINR || 120} rupees.`;
    }
    return `Here is your active Meal Plan on NutriSwasth AI (${currentPlan?.dayName || 'Today'} - Routine: ${(currentPlan?.routineContext || 'normal').replace('_', ' ')}):

${mealsList.map((m) => `- ${m.mealType}: ${m.dish.name} (${m.dish.servingUnit}) | ${Math.round(m.dish.calories * m.portionMultiplier)} kcal | Protein: ${Math.round(m.dish.proteinG * m.portionMultiplier)}g | Cost: ₹${Math.round(m.dish.estimatedCostINR * m.portionMultiplier)} | Status: ${m.isTaken ? 'Completed' : 'Pending'}`).join('\n')}

Summary: ${currentPlan?.totalCalories || 0} kcal | ${currentPlan?.totalProtein || 0}g Protein | ${currentPlan?.totalCarbs || 0}g Carbs | ${currentPlan?.totalFat || 0}g Fat | Total Cost: ₹${currentPlan?.totalCostINR || 0}`;
  }

  if (
    q.includes('my profile') ||
    q.includes('my bmi') ||
    q.includes('my target') ||
    q.includes('my calorie')
  ) {
    if (isVoiceShort) {
      return `Hi ${userProfile?.name}! Your BMI is ${bmi}, and your daily ICMR target is ${targets.targetCalories} calories with ${targets.proteinG} grams of protein and ${targets.waterLiters} liters of water.`;
    }
    return `Here is your Health Profile on NutriSwasth AI:
- Name: ${userProfile?.name} (${userProfile?.age} yrs, ${userProfile?.ageGroup}, ${userProfile?.gender})
- Height & Weight: ${userProfile?.heightCm} cm | ${userProfile?.weightKg} kg | BMI: ${bmi}
- Daily Targets (ICMR): ${targets.targetCalories} kcal (BMR: ${targets.bmr} kcal, TDEE: ${targets.tdee} kcal), Protein: ${targets.proteinG}g, Carbs: ${targets.carbsG}g, Fat: ${targets.fatG}g, Fiber: ${targets.fiberG}g, Water: ${targets.waterLiters}L`;
  }

  const matchingFoods = INDIAN_FOOD_DATABASE.filter((item) => {
    if (diet === 'vegetarian' && !item.dietaryType.includes('vegetarian')) return false;
    if (diet === 'vegan' && !item.dietaryType.includes('vegan')) return false;
    if (diet === 'jain' && !item.dietaryType.includes('jain')) return false;
    return true;
  });

  if (q.includes('protein')) {
    const highProtein = [...matchingFoods].sort((a, b) => b.proteinG - a.proteinG).slice(0, 5);
    if (isVoiceShort) {
      return `To boost protein on a ${diet} diet, include ${highProtein.slice(0, 3).map((f) => f.name).join(', ')}. Aim for ${targets.proteinG} grams of protein daily.`;
    }
    return `Here are top high-protein Indian foods for your ${diet} diet (Daily Target: ${targets.proteinG}g):
${highProtein.map((f) => `- ${f.name}: ${f.proteinG}g protein | ${f.calories} kcal | ₹${f.estimatedCostINR} (${f.servingUnit})`).join('\n')}`;
  }

  if (q.includes('snack') || q.includes('30') || q.includes('evening') || q.includes('budget')) {
    const cheapSnacks = matchingFoods.filter((f) => f.category === 'snack' && f.estimatedCostINR <= 35).slice(0, 5);
    if (isVoiceShort) {
      return `Healthy Indian evening snacks under 30 rupees include ${cheapSnacks.slice(0, 3).map((f) => `${f.name} at ${f.estimatedCostINR} rupees`).join(', ')}.`;
    }
    return `Healthy Indian evening snacks under ₹30:
${cheapSnacks.map((f) => `- ${f.name}: ₹${f.estimatedCostINR} | ${f.calories} kcal | ${f.proteinG}g Protein | ${f.fiberG}g Fiber`).join('\n')}`;
  }

  const selectedFoods = matchingFoods.slice(0, 3);
  if (isVoiceShort) {
    return `Namaste ${userProfile?.name || ''}! I am here to help you with questions about NutriSwasth AI, your daily nutrition plan, or any general topic. For your ${goal.replace('_', ' ')} goal today, aim for ${targets.targetCalories} calories and ${targets.waterLiters} liters of water.`;
  }

  return `Namaste ${userProfile?.name || 'there'}! Here is helpful information based on your query "${query}":

- Your Daily NutriSwasth Targets: ${targets.targetCalories} kcal | Protein: ${targets.proteinG}g | Fiber: ${targets.fiberG}g | Water: ${targets.waterLiters}L
- Top Recommended Dishes: ${selectedFoods.map((f) => `${f.name} (${f.calories} kcal, ${f.proteinG}g protein, ₹${f.estimatedCostINR})`).join(', ')}

Feel free to ask me any question about this website, your meal plan, health & fitness, or any general topic!`;
}

// ---------------------------------------------------------
// Unified AI Generation Helper (/api/chat -> Client SDK -> Fallback)
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

  // 1. Try Server/Vercel Serverless Function (/api/chat) first
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
    console.warn('[NutriSwasth AI] /api/chat warning:', err?.message);
  }

  // 2. Try Direct Client Gemini SDK across all active models
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

  // 3. Fallback Engine
  return generateFallbackResponse(query, userProfile, currentPlan, isVoiceShort);
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
// Live Voice Assistant Modal Component (Clean Voice UI without Transcript)
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
  const [audioLevel, setAudioLevel] = useState(0);

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

      setStatus('speaking');

      const systemInstruction = buildWebsiteAndUserSystemContext(userProfile, currentPlan, true);

      const reply = await generateAIResponse(
        trimmed,
        systemInstruction,
        [],
        userProfile,
        currentPlan,
        true
      );

      if (!isModalOpenRef.current) return;

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
            // Keep status in listening
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

    try {
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

      const ai = getGeminiClient();
      if (!ai) {
        await startBrowserSpeechFallback(stream);
        return;
      }

      // 1. Initialize Player
      const player = new LiveAudioPlayer();
      player.init();
      audioPlayerRef.current = player;

      const systemInstruction = buildWebsiteAndUserSystemContext(userProfile, currentPlan, true);

      // 2. Connect to Gemini Live API using the primary live model
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
              }
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
            console.warn('[LiveVoice] Session error, activating speech fallback:', err);
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

      sessionRef.current = session;
      setStatus('listening');

      // 3. Capture Mic Audio and stream 16kHz PCM
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
    } catch (err: any) {
      console.warn('[LiveVoice] Falling back to browser speech recognition:', err);
      await startBrowserSpeechFallback(mediaStreamRef.current || undefined);
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
                      {selectedVoice === v.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Top Right Close Button */}
            <div className="flex items-center gap-2">
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
              {status === 'listening' && 'NutriSwasth is listening. Speak now!'}
              {status === 'speaking' && 'NutriSwasth is speaking...'}
              {status === 'idle' && 'Tap the red button to speak'}
              {status === 'error' && (errorMessage || 'Connection issue. Tap to retry.')}
            </p>
          </div>

          {/* Central Concentric Pulse Visualizer + Big Button */}
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
              className={`relative z-10 w-18 h-18 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg active:scale-95 touch-manipulation ${
                isActive
                  ? 'bg-[#f04438] hover:bg-[#e0382d] text-white shadow-red-500/40 ring-4 ring-red-500/20'
                  : 'bg-[#f04438] hover:bg-[#e0382d] text-white shadow-red-500/30'
              }`}
              title={isActive ? 'Stop Voice Conversation' : 'Start Voice Conversation'}
            >
              {isActive ? (
                <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-[4px] bg-white" />
              ) : (
                <Mic className="w-7 h-7 sm:w-9 sm:h-9 text-white" />
              )}
            </button>
          </div>

          {/* Bottom Live Waveform Badge */}
          <div className="flex flex-col items-center gap-2.5 sm:gap-3 w-full z-10 mt-1 sm:mt-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#15233e]/80 border border-[#233a66] text-xs font-semibold text-indigo-300">
              <Activity
                className={`w-3.5 h-3.5 text-indigo-400 ${isActive ? 'animate-pulse' : 'opacity-40'}`}
              />
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
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#15233e] hover:bg-[#1f335b] text-slate-300 hover:text-white border border-[#233a66] text-xs font-medium transition-colors cursor-pointer min-h-[38px] touch-manipulation"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Reset</span>
              </button>
            </div>
          </div>
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
      text: `Namaste ${userProfile.name || 'there'}! I am your NutriSwasth AI Assistant. You can ask me anything about this website, your personalized meal plan, Indian recipes, health & nutrition, or any other general question! You can also tap "Live Voice Assistant" for real-time voice conversations.`,
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
      const systemInstruction = buildWebsiteAndUserSystemContext(userProfile, currentPlan, false);

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
      const fallbackReply = generateFallbackResponse(
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
    'Tell me about this website and its features',
    'What is in my current meal plan today?',
    'How do I increase my protein on a vegetarian diet?',
    'What are healthy Indian evening snacks under ₹30?',
    'Why is dietary fiber important for blood sugar?',
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
              Multilingual Indian nutrition & all-round AI voice-assisted guide
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
                <span className="text-xs font-medium">NutriSwasth AI is preparing your response...</span>
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
              placeholder="Ask anything — about this website, your diet plan, recipes, or any topic..."
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
