# ☕ **Rooster Coffee Co.** - Premium Artisan Coffee Experience

**Welcome to Rooster Coffee Co.** - Your destination for premium, single-origin coffee beans, expert brewing guides, and the ultimate coffee lifestyle! ☕✨
# 🎙️ **AI Voice Assistant** - Voice-Powered Coffee Companion

**✨ Experience hands-free coffee magic!** Speak to shop, learn, and get recommendations instantly.

[🚀 Live Demo - Red Rooster ](https://cute-tomato-r9qncsknw6.edgeone.app/) ✨

---
## 🎤 **Voice Assistant Features**

| Feature | What It Does | Tech Used |
|---------|--------------|-----------|
| **🎧 Speech-to-Text** | Converts your voice to text instantly | **Web Speech API** + Gemini AI |
| **🤖 AI Responses** | Smart coffee recommendations & answers | **Google Gemini AI** |
| **🔊 Voice Output** | AI speaks back with natural voice | **SpeechSynthesis API** |
| **🛒 Voice Shopping** | "Add espresso beans to cart" → ✅ Done! | React Context + Voice Commands |
| **📚 Voice Learning** | "How to brew pour-over?" → Full guide! | Real-time AI processing |

---

## 🌟 **Key Features**

- **🏠 Home** - Stunning hero with coffee showcase & quick actions
- **🛒 Shop** - Full e-commerce with product details & cart system
- **📱 Cart & Checkout** - Smooth shopping flow with drawer UI
- **🎓 Learn** - Coffee education hub with booking system
- **💬 AI Chat Widget** - **Gemini AI-powered** coffee assistant[file:40]
- **📞 Booking & Contact** - Cafe visits, wholesale inquiries
- **🎯 Coffee Quiz** - Personalized recommendations
- **📦 Order Tracking** - Real-time delivery status

## 🎨 **Premium Design**

```
🌟 Custom Color Palette:
--rooster-red: #D32F2F      ☕ Warm & inviting
--rooster-cream: #F5F2EB    ✨ Elegant backdrop
--rooster-gold: #C5A065     🏆 Luxury accents
```
**Fonts:** Playfair Display (Headings) + Inter (Body)[file:47]

---

## 🛠️ **Tech Stack**

| Frontend | Backend/AI | Tools |
|----------|------------|-------|
| **React 19** • TypeScript • Tailwind CSS • React Router | **Google Gemini AI** • Express.js | Vite • Framer Motion • Lucide Icons • EdgeOne |

**Dependencies Highlights:**
- `googlegenai` - AI Chat & Recommendations
- `react-router-dom` - Multi-page SPA
- `lucide-react` - 500+ premium icons

---

## 🚀 **Quick Start**

### **1. Clone & Install**
```bash
git clone <your-repo-url>
cd rooster-coffee
npm install
```

### **2. AI Setup** (Required for Chat!)
```bash
# Create .env.local
GEMINI_API_KEY=your-gemini-api-key-here
```

### **3. Run Development**
```bash
npm run dev
```
**🌐 Open:** `http://localhost:3000`[file:40]

### **4. Build & Deploy**
```bash
npm run build
# Deploy dist/ to EdgeOne/Netlify/Vercel
```

---

## 📱 **Pages & Components**

```
🏠 Home              - Hero + Featured Products
🛒 Shop              - Product Catalog + Cart Drawer [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/83451490/8d1b6680-e9ce-4969-8fc1-dff2ec920439/App.tsx?AWSAccessKeyId=ASIA2F3EMEYEQZESLLRJ&Signature=HOHJW33XjcgFraqjq74eZifOibA%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEBoaCXVzLWVhc3QtMSJIMEYCIQDjJbLzFEp0alY6F8rPuolSPkzTIPJStJvv0xeWnE0S4AIhALWKc81hZgEsKUTvw5CacykXpkXhcDDT7paIGYDmgEPeKvwECOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQARoMNjk5NzUzMzA5NzA1Igw6VbsPG08xvkpg6M0q0AQALdj8wa8BSNZfN61wPS39L4wxOwBV04sRqK4rYGOsC1TPeHUoepPuuqB0OHzKcG3DhLH3pCq%2Bf5GUB7tM6bzxFT5qbK0iyhA0tBi6H3PE71bk0mjF%2BHY99hXpImWBxc6%2Fdvp1mUuq016P1IvL9pS2qkbXhUP%2F0WS0TlQj07YbTq7%2B48xMaH61CoW95wMcLao0O%2BEN1wcoSao11rV7yaC5EpexkJDzvaKZ97jGKyXSZZMMT7YLPnXTg1mxISdew8wOSc5HL1f77wspfUAZSvk0u%2FUd%2BoEN1%2BWCgfj0Z7djs%2FoWinN%2FpbiFKRoNWXfn6j3fi8g6rQmXpGg9fSaQlfKawqhM7WIw1bARkCKf%2FYTzetCILyE7PPqueZte9VfHipS0opCIllWQ%2BAMUttCqiCkox4mFGEnptuwLBj7x8B20QRk9pKxS38MuSxenAhsD6JPSkWV8baQ%2FghM384DMn7H8VmxCBTIOQ%2BfZMI8xKPTWPOQnSF4cGm7hl9amFCzPZiZSCf0JAJhOoT%2Br2RqHkSZhqAqpfc4IBHnPPkdP1WRx%2ByvRJGmAk1jXHnM%2F1JLjpFx8JC6i9I2eqipNGo5FkoFozw%2FXUQYoNTldvrmj6pL6puKdL%2FSWcmQackEKeyJb7Hn19SdnqRCoAUWB%2B1%2FH83Pfj%2F9ERnWBCsASmMlomq%2FNXv8IBQlBc9qwJq%2BzGFfhgCJgvaxbpPBVGo6RiwGJO9CH6rsudv0C9rvKP4A%2FCvgKXfKlFfeTwGEDRGyD0sOk%2FWaYpvrbgAnPB2QB7cL0u2UNMNaKm84GOpcBfEPKdrEpYfdr6jugwa60oPsQkw5oWgEDP81Fmt%2BWEkuNrrQ8R%2Bi4JfFNoeGq8NjA43vmxwQJYaFlpLgZ6%2Bhivd2%2FgIh5a5ro2%2FdynIrEd7VXZBhE9wDBpGjCcOMyDhAP6iUPkGQQ2NeQKxrckCWwZfXLeikL2btKJg0S5XSvTTPfsezS84hgs0ip%2Fop8Bn15z5tBkH7gWw%3D%3D&Expires=1774635336)
📦 Product Detail    - Individual product pages
🎓 Learn             - Coffee education + Booking
💬 Chat Widget       - AI-powered assistant [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/83451490/8d1b6680-e9ce-4969-8fc1-dff2ec920439/App.tsx?AWSAccessKeyId=ASIA2F3EMEYEQZESLLRJ&Signature=HOHJW33XjcgFraqjq74eZifOibA%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEBoaCXVzLWVhc3QtMSJIMEYCIQDjJbLzFEp0alY6F8rPuolSPkzTIPJStJvv0xeWnE0S4AIhALWKc81hZgEsKUTvw5CacykXpkXhcDDT7paIGYDmgEPeKvwECOP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQARoMNjk5NzUzMzA5NzA1Igw6VbsPG08xvkpg6M0q0AQALdj8wa8BSNZfN61wPS39L4wxOwBV04sRqK4rYGOsC1TPeHUoepPuuqB0OHzKcG3DhLH3pCq%2Bf5GUB7tM6bzxFT5qbK0iyhA0tBi6H3PE71bk0mjF%2BHY99hXpImWBxc6%2Fdvp1mUuq016P1IvL9pS2qkbXhUP%2F0WS0TlQj07YbTq7%2B48xMaH61CoW95wMcLao0O%2BEN1wcoSao11rV7yaC5EpexkJDzvaKZ97jGKyXSZZMMT7YLPnXTg1mxISdew8wOSc5HL1f77wspfUAZSvk0u%2FUd%2BoEN1%2BWCgfj0Z7djs%2FoWinN%2FpbiFKRoNWXfn6j3fi8g6rQmXpGg9fSaQlfKawqhM7WIw1bARkCKf%2FYTzetCILyE7PPqueZte9VfHipS0opCIllWQ%2BAMUttCqiCkox4mFGEnptuwLBj7x8B20QRk9pKxS38MuSxenAhsD6JPSkWV8baQ%2FghM384DMn7H8VmxCBTIOQ%2BfZMI8xKPTWPOQnSF4cGm7hl9amFCzPZiZSCf0JAJhOoT%2Br2RqHkSZhqAqpfc4IBHnPPkdP1WRx%2ByvRJGmAk1jXHnM%2F1JLjpFx8JC6i9I2eqipNGo5FkoFozw%2FXUQYoNTldvrmj6pL6puKdL%2FSWcmQackEKeyJb7Hn19SdnqRCoAUWB%2B1%2FH83Pfj%2F9ERnWBCsASmMlomq%2FNXv8IBQlBc9qwJq%2BzGFfhgCJgvaxbpPBVGo6RiwGJO9CH6rsudv0C9rvKP4A%2FCvgKXfKlFfeTwGEDRGyD0sOk%2FWaYpvrbgAnPB2QB7cL0u2UNMNaKm84GOpcBfEPKdrEpYfdr6jugwa60oPsQkw5oWgEDP81Fmt%2BWEkuNrrQ8R%2Bi4JfFNoeGq8NjA43vmxwQJYaFlpLgZ6%2Bhivd2%2FgIh5a5ro2%2FdynIrEd7VXZBhE9wDBpGjCcOMyDhAP6iUPkGQQ2NeQKxrckCWwZfXLeikL2btKJg0S5XSvTTPfsezS84hgs0ip%2Fop8Bn15z5tBkH7gWw%3D%3D&Expires=1774635336)
🛒 Checkout          - Complete payment flow
📊 Coffee Quiz       - Personalized recommendations
📦 Order Tracking    - Delivery status checker
```

## 🎨 **UI Highlights**

- **🍅 Tomato-inspired warmth** - Cozy coffee shop vibes
- **Motion animations** - Smooth page transitions[file:40]
- **Responsive design** - Mobile-first perfection
- **Glassmorphism cards** - Modern premium feel
- **Custom typography** - Elegant coffee branding[file:47]

---

## 🤝 **Built For**

- **E-commerce coffee brand** - Ready for real sales
- **AI-enhanced UX** - Smart chat & recommendations
- **Production deployment** - EdgeOne optimized
- **Portfolio showcase** - Saatwik Sinha's mastery

---

<div align="center">
  <strong>☕ Made with ❤️ by **Saatwik Sinha**</strong><br>
  <em>#Coffee #Ecommerce #AI #React #FullStack</em><br><br>
  **🙏 Thank you for visiting Rooster Coffee Co.! Your star ⭐ brews my next project! ☕**
</div>
```
