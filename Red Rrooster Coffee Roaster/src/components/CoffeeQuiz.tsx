import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check, RefreshCw, Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';

const questions = [
  {
    id: 1,
    question: "How do you usually drink your coffee?",
    options: [
      { label: "Black", value: "black" },
      { label: "With milk/cream", value: "milk" },
      { label: "As espresso", value: "espresso" },
      { label: "Decaf only", value: "decaf" }
    ]
  },
  {
    id: 2,
    question: "What flavors do you prefer?",
    options: [
      { label: "Fruity & Floral", value: "fruity" },
      { label: "Chocolate & Nutty", value: "nutty" },
      { label: "Bold & Smoky", value: "bold" },
      { label: "Sweet & Balanced", value: "sweet" }
    ]
  },
  {
    id: 3,
    question: "How do you brew at home?",
    options: [
      { label: "Drip Machine", value: "drip" },
      { label: "Pour Over / Chemex", value: "pourover" },
      { label: "French Press", value: "press" },
      { label: "Espresso Machine", value: "espresso_machine" }
    ]
  }
];

export default function CoffeeQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [currentStep]: value });
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResult(false);
  };

  const getRecommendation = () => {
    // Simple logic for recommendation
    const { 0: drinkStyle, 1: flavor, 2: brewMethod } = answers;

    if (drinkStyle === 'decaf') return {
      name: "Night Owl Decaf",
      desc: "All the flavor, none of the jitters. Perfect for your late-night cravings.",
      link: "/shop/7"
    };

    if (flavor === 'fruity' || brewMethod === 'pourover') return {
      name: "Ethiopia Yirgacheffe Worka",
      desc: "Bright, floral, and tea-like. A stunning example of Ethiopian coffee.",
      link: "/shop/5"
    };

    if (flavor === 'bold' || brewMethod === 'press') return {
      name: "Organic Funky Chicken",
      desc: "Complex, rich, and full-bodied. Our signature blend for a reason.",
      link: "/shop/1"
    };

    if (drinkStyle === 'espresso' || brewMethod === 'espresso_machine') return {
      name: "Lovebirds",
      desc: "Sweet, balanced, and perfect for espresso. Notes of chocolate and cherry.",
      link: "/shop/4"
    };

    // Default
    return {
      name: "Organic Floyd Farmhouse Breakfast Blend",
      desc: "The perfect crowd-pleaser. Balanced, bright, and welcoming.",
      link: "/shop/3"
    };
  };

  const recommendation = getRecommendation();

  return (
    <div className="bg-[#2C241B] min-h-screen pt-32 pb-24 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[500px] flex flex-col">
        
        {/* Header */}
        <div className="bg-[var(--color-rooster-green)] p-8 text-center">
          <h1 className="font-serif text-3xl text-white font-bold flex items-center justify-center gap-3">
            <Coffee className="w-8 h-8 text-[var(--color-rooster-gold)]" />
            Find Your Perfect Coffee
          </h1>
        </div>

        {/* Content */}
        <div className="flex-grow p-8 md:p-12 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <span className="text-xs font-bold tracking-widest text-[var(--color-rooster-gold)] uppercase mb-2 block">
                    Question {currentStep + 1} of {questions.length}
                  </span>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-[var(--color-rooster-dark)]">
                    {questions[currentStep].question}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {questions[currentStep].options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(option.value)}
                      className="p-4 rounded-xl border-2 border-stone-200 hover:border-[var(--color-rooster-green)] hover:bg-stone-50 transition-all text-left group"
                    >
                      <span className="font-bold text-stone-700 group-hover:text-[var(--color-rooster-green)]">
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="w-20 h-20 bg-[var(--color-rooster-green)] rounded-full mx-auto flex items-center justify-center text-white mb-6">
                  <Check className="w-10 h-10" />
                </div>
                
                <div>
                  <h2 className="text-stone-500 font-medium mb-2">We recommend:</h2>
                  <h3 className="font-serif text-3xl md:text-4xl font-bold text-[var(--color-rooster-dark)] mb-4">
                    {recommendation.name}
                  </h3>
                  <p className="text-stone-600 text-lg max-w-md mx-auto">
                    {recommendation.desc}
                  </p>
                </div>

                <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    to={recommendation.link}
                    className="px-8 py-3 bg-[var(--color-rooster-green)] text-white font-bold rounded-full hover:bg-[var(--color-rooster-dark)] transition-colors flex items-center justify-center gap-2"
                  >
                    Shop Now <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button 
                    onClick={resetQuiz}
                    className="px-8 py-3 border border-stone-300 text-stone-600 font-bold rounded-full hover:bg-stone-50 transition-colors flex items-center justify-center gap-2"
                  >
                    Retake Quiz <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        {!showResult && (
          <div className="h-2 bg-stone-100">
            <div 
              className="h-full bg-[var(--color-rooster-gold)] transition-all duration-300"
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
