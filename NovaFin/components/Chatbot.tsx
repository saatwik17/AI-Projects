import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2, Mic, Volume2, VolumeX } from 'lucide-react';
import { createWebsiteChatSession, generateSpeech } from '../services/ai';
import { LiveVoice } from './LiveVoice';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'voice'>('text');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Hi! I am Nova, your AI assistant. How can I help you navigate NovaFin today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  
  const chatSessionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (isOpen && !chatSessionRef.current) {
      chatSessionRef.current = createWebsiteChatSession();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const playAudio = (base64Audio: string) => {
    try {
      const binary = atob(base64Audio);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const audioCtx = audioContextRef.current;
      const buffer = audioCtx.createBuffer(1, bytes.length / 2, 24000);
      const channelData = buffer.getChannelData(0);
      const dataView = new DataView(bytes.buffer);
      for (let i = 0; i < channelData.length; i++) {
        channelData[i] = dataView.getInt16(i * 2, true) / 32768.0;
      }
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      source.start();
    } catch (err) {
      console.error("Audio playback error:", err);
    }
  };

  const handleSend = async (e?: React.FormEvent, overrideText?: string) => {
    e?.preventDefault();
    const userMessage = (overrideText || input).trim();
    if (!userMessage || isLoading) return;

    setInput('');
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: 'user', text: userMessage },
    ]);
    setIsLoading(true);

    try {
      if (!chatSessionRef.current) {
        chatSessionRef.current = createWebsiteChatSession();
      }
      const response = await chatSessionRef.current.sendMessage({ message: userMessage });
      const responseText = response.text;
      
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: 'model', text: responseText },
      ]);

      if (voiceMode) {
        const audioBase64 = await generateSpeech(responseText);
        if (audioBase64) {
          playAudio(audioBase64);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'model',
          text: 'Sorry, I encountered an error while processing your request. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) return;
    
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = (e: any) => {
      console.error("Speech recognition error", e);
      setIsRecording(false);
    };
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      handleSend(undefined, transcript);
    };
    
    recognition.start();
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-nova-accent text-white shadow-lg hover:bg-indigo-600 transition-all duration-300 z-50 ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
        aria-label="Open chat"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] max-h-[80vh] bg-nova-dark border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 z-50 origin-bottom-right ${
          isOpen
            ? 'scale-100 opacity-100 pointer-events-auto'
            : 'scale-95 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-black/20 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-nova-accent/20 flex items-center justify-center text-nova-accent">
                <MessageCircle size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Nova AI</h3>
                <p className="text-xs text-gray-400">Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {activeTab === 'text' && (
                <button
                  onClick={() => setVoiceMode(!voiceMode)}
                  className={`p-1.5 rounded-full transition-colors ${voiceMode ? 'bg-nova-accent text-white' : 'text-gray-400 hover:text-white bg-white/5'}`}
                  title={voiceMode ? "Voice Output On" : "Voice Output Off"}
                >
                  {voiceMode ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('text')}
              className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${activeTab === 'text' ? 'bg-nova-accent text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Text Chat
            </button>
            <button
              onClick={() => setActiveTab('voice')}
              className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${activeTab === 'voice' ? 'bg-nova-accent text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Live Voice
            </button>
          </div>
        </div>

        {/* Body */}
        {activeTab === 'text' ? (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-nova-accent text-white rounded-br-sm'
                        : 'bg-white/5 text-gray-200 border border-white/10 rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-bl-sm">
                    <Loader2 size={16} className="animate-spin text-nova-accent" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-black/20">
              <form
                onSubmit={handleSend}
                className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full p-1 pl-4"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Nova..."
                  className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-gray-500"
                  disabled={isLoading || isRecording}
                />
                <button
                  type="button"
                  onClick={toggleRecording}
                  disabled={isLoading}
                  className={`p-2 rounded-full transition-colors ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:text-white hover:bg-white/10'} disabled:opacity-50 disabled:cursor-not-allowed`}
                  title="Voice Input"
                >
                  <Mic size={16} />
                </button>
                <button
                  type="submit"
                  disabled={(!input.trim() && !isRecording) || isLoading}
                  className="p-2 rounded-full bg-nova-accent text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-600 transition-colors"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-hidden bg-black/10">
            <LiveVoice />
          </div>
        )}
      </div>
    </>
  );
};
