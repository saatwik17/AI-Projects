import { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageCircle, X, Send, Loader2, Sparkles, Phone } from 'lucide-react';
import Markdown from 'react-markdown';
import LiveVoice from './LiveVoice';

// System instruction addressing all pain points
const getSystemInstruction = () => {
  const now = new Date();
  const currentTime = now.toLocaleString('en-US', { timeZone: 'America/New_York', weekday: 'long', hour: 'numeric', minute: 'numeric', hour12: true });
  
  return `You are "RoosterBot", the virtual assistant for Red Rooster Coffee Roaster in Floyd, VA.
Your goal is to be friendly, helpful, and knowledgeable about coffee.

CURRENT TIME IN FLOYD, VA: ${currentTime}

KEY INFORMATION & PAIN POINTS TO ADDRESS:

1. NO-SHOWS & CANCELLATIONS (Pain Point 1):
   - If asked about booking tours/classes, YOU MUST EMPHASIZE: "Please note: We are a small team and prepare materials specifically for each guest. We require 24-hour notice for cancellations to provide a refund. No-shows significantly impact our small operation."
   - Cancellation Policy: Must cancel 24 hours in advance for a full refund.
   - Arrive 10 minutes early.

2. INFORMATIONAL QUERIES (Pain Point 2):
   - Hours: Mon-Fri 7AM-5PM, Sat 8AM-3PM, Closed Sunday.
   - Location: 823 E. Main St, Floyd, VA 24091 (Downtown, near Country Store).
   - Parking: Dedicated lot adjacent to building + free street parking.
   - Food: Locally made pastries, bagels, light breakfast. Gluten-free options available.
   - Wifi: Free high-speed wifi (Network: RedRoosterGuest).
   - Dogs: Welcome on patio. Service animals only inside.
   - Sourcing: Organic & Fair Trade for blends. Direct Trade for single origins (paying farmers above fair trade).
   - Roast Levels:
     * Light: Bright, acidic, fruity/floral.
     * Medium: Balanced, sweet, chocolate/nutty.
     * Dark: Bold, rich, smoky, low acidity.
   - ORDER STATUS: "You can check your order status by logging into your account. If you haven't received a tracking email within 2 business days, please check your spam folder or email support@redroostercoffeeroaster.com."

3. AFTER-HOURS & URGENT (Pain Point 3):
   - Check the CURRENT TIME provided above against our hours.
   - If it is currently CLOSED and the user has an URGENT wholesale issue or custom roast request, say:
     "Since it is currently after hours (we are closed), our team is away. For URGENT wholesale matters only, please call 540-745-7338 ext 2 and leave a voicemail. We will address it immediately the next business day."
   - Remind them the online shop is open 24/7.

TONE:
- Warm, inviting, like a friendly barista.
- Use coffee emojis occasionally ☕.
- Keep answers concise but complete.
`;
};

const ai = new GoogleGenAI({ apiKey: "" });

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hi! I'm RoosterBot 🐓. I can help with hours, roast questions, or booking info. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (textToSend: string = input) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // 1. Get Text Response
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: { systemInstruction: getSystemInstruction() },
        history: messages
          .filter((m, i) => !(i === 0 && m.role === 'model'))
          .map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
          }))
      });

      const result = await chat.sendMessage({ message: textToSend });
      const responseText = result.text;

      if (!responseText) {
        throw new Error("No response text received");
      }

      setMessages(prev => [...prev, { role: 'model', text: responseText }]);

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting to the roastery right now. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Live Voice Modal */}
      {isLiveMode && <LiveVoice onClose={() => setIsLiveMode(false)} />}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-[var(--color-rooster-green)] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform border-4 border-[var(--color-rooster-gold)]"
      >
        {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-stone-200 animate-in slide-in-from-bottom-10 fade-in duration-300">
          
          {/* Header */}
          <div className="bg-[var(--color-rooster-green)] p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[var(--color-rooster-red)] font-bold border-2 border-[var(--color-rooster-gold)]">
                R
              </div>
              <div>
                <h3 className="font-bold font-serif">RoosterBot</h3>
                <span className="text-xs text-[var(--color-rooster-gold)] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Powered by Gemini
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsLiveMode(true)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors animate-pulse"
                title="Start Live Voice Call"
              >
                <Phone className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--color-rooster-cream)]">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-[var(--color-rooster-red)] text-white rounded-tr-none' 
                      : 'bg-white text-stone-800 rounded-tl-none border border-stone-100'
                  }`}
                >
                  <Markdown>{msg.text}</Markdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-stone-100 shadow-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[var(--color-rooster-green)]" />
                  <span className="text-xs text-stone-500">Roasting response...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-stone-100">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about coffee, hours, or tours..."
                className="flex-1 bg-stone-50 border border-stone-200 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-rooster-green)] focus:border-transparent"
              />
              
              <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-3 bg-[var(--color-rooster-green)] text-white rounded-full hover:bg-[#1e3a30] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
