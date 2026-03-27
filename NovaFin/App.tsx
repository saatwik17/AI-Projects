import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { RecommendationEngine } from './components/RecommendationEngine';
import { Features } from './components/Features';
import { About } from './components/About';
import { Chatbot } from './components/Chatbot';

const Footer: React.FC = () => (
  <footer className="bg-black/40 border-t border-white/5 py-12">
    <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
      <p>&copy; 2024 NovaFin AI. Built for TCS Hackathon.</p>
      <div className="flex justify-center gap-6 mt-4">
        <a href="#" className="hover:text-white transition-colors">Privacy</a>
        <a href="#" className="hover:text-white transition-colors">Terms</a>
        <a href="#" className="hover:text-white transition-colors">Contact</a>
      </div>
    </div>
  </footer>
);

const LandingPage: React.FC = () => (
  <>
    <Hero />
    <div className="py-20 bg-black/20">
      <div className="max-w-7xl mx-auto px-4">
         <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-white mb-4">Why NovaFin?</h2>
            <p className="text-gray-400">Precision engineered financial advice.</p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 glass-panel rounded-xl">
               <h3 className="text-xl font-bold text-white mb-2">Deep Analysis</h3>
               <p className="text-gray-400">We don't just look at income. We analyze spending patterns and lifestyle goals.</p>
            </div>
            <div className="p-8 glass-panel rounded-xl">
               <h3 className="text-xl font-bold text-white mb-2">Unbiased AI</h3>
               <p className="text-gray-400">Our agent ranks cards based on value to YOU, not commission rates.</p>
            </div>
            <div className="p-8 glass-panel rounded-xl">
               <h3 className="text-xl font-bold text-white mb-2">Real-time Data</h3>
               <p className="text-gray-400">Up-to-the-minute APRs and bonus offers integrated into our model.</p>
            </div>
         </div>
      </div>
    </div>
  </>
);

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-nova-dark text-slate-100 font-sans selection:bg-indigo-500/30">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/advisor" element={<RecommendationEngine />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
        <Chatbot />
      </div>
    </Router>
  );
};

export default App;