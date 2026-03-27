import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Minus, Plus, ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useStore } from '../context/StoreContext';
import clsx from 'clsx';

// Helper to get color for tasting notes
const getNoteColor = (note: string) => {
  const colors = [
    'bg-[#D4A373]', // Toasted Almond (Tan)
    'bg-[#E9C46A]', // Sunflower Butter (Yellow)
    'bg-[#F4A261]', // Caramel (Orange)
    'bg-[#9D0208]', // Red Plum (Red)
    'bg-[#264653]', // Dark Green
    'bg-[#2A9D8F]', // Teal
    'bg-[#606C38]', // Olive
    'bg-[#BC6C25]', // Brown
  ];
  // Simple hash to pick a color
  const index = note.length % colors.length;
  return colors[index];
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useStore();
  const product = PRODUCTS.find(p => p.id === Number(id));

  const [size, setSize] = useState('12oz');
  const [grind, setGrind] = useState('Whole Bean');
  const [quantity, setQuantity] = useState(1);
  const [purchaseType, setPurchaseType] = useState<'onetime' | 'subscription'>('onetime');
  const [frequency, setFrequency] = useState('Monthly');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Check for passed state from The Fix page
  useEffect(() => {
    if (location.state?.selectedPlan) {
      setPurchaseType('subscription');
      setFrequency(location.state.selectedPlan);
    }
  }, [location.state]);

  if (!product) {
    return <div className="pt-32 text-center">Product not found</div>;
  }

  // Mock images for carousel (using the main image + some placeholders if needed)
  const images = [
    product.image,
    "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1610632380989-680fe40816c6?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=800"
  ];

  const handleAddToCart = () => {
    addToCart({
      ...product,
      cartId: `${product.id}-${size}-${grind}-${purchaseType}-${Date.now()}`,
      selectedSize: size,
      selectedGrind: grind,
      quantity,
      purchaseType,
      frequency: purchaseType === 'subscription' ? frequency : undefined
    });
  };

  // Calculate price based on size and subscription
  let currentPrice = product.price;
  if (size === '2LB') currentPrice *= 2.5;
  if (size === '5LB') currentPrice *= 6;
  
  if (purchaseType === 'subscription') {
    if (frequency === '1 Year') {
      currentPrice *= 0.80;
    } else if (frequency === '2 Year') {
      currentPrice *= 0.75;
    } else {
      currentPrice *= 0.85;
    }
  }

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="pt-24 pb-24 bg-[#EAE7DE] min-h-screen font-sans text-[#2D2D2D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Left Column: Images */}
          <div className="space-y-8">
            <div className="relative aspect-[4/5] bg-white rounded-lg shadow-sm overflow-hidden group">
              <img 
                src={images[currentImageIndex]} 
                alt={product.name} 
                className="w-full h-full object-contain p-8 transition-transform duration-500"
              />
            </div>
            
            {/* Carousel Controls */}
            <div className="flex items-center justify-center gap-6">
              <button onClick={prevImage} className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-stone-50 transition-colors">
                <ArrowLeft className="w-5 h-5 text-stone-600" />
              </button>
              
              <div className="flex gap-4 overflow-x-auto py-2 px-2 no-scrollbar">
                {images.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentImageIndex(i)}
                    className={clsx(
                      "w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 transition-all",
                      currentImageIndex === i ? "border-[#2D4F43] scale-110" : "border-transparent opacity-70 hover:opacity-100"
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <button onClick={nextImage} className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-stone-50 transition-colors">
                <ArrowRight className="w-5 h-5 text-stone-600" />
              </button>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="flex flex-col">
            <h1 className="font-serif text-4xl md:text-5xl text-[#2D4F43] mb-2 leading-tight">
              {product.name}
            </h1>
            <div className="font-serif text-4xl text-[#2D4F43] mb-6">
              ${currentPrice.toFixed(2)}
            </div>

            <div className="flex gap-3 mb-8">
              <span className="px-4 py-1.5 border border-stone-400 rounded-full text-sm font-mono text-stone-700 bg-[#EAE7DE]">
                {product.roast} Roast
              </span>
              <span className="px-4 py-1.5 border border-stone-400 rounded-full text-sm font-mono text-stone-700 bg-[#EAE7DE]">
                {product.type}
              </span>
            </div>

            <p className="text-stone-700 text-lg leading-relaxed mb-8 font-light">
              {product.description}
            </p>

            {/* Origin & Brew Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg border border-stone-200">
                <h3 className="font-serif text-lg font-bold text-[var(--color-rooster-green)] mb-2">Origin Story</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{product.originStory || "Sourced with care from the world's best coffee regions."}</p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-stone-200">
                <h3 className="font-serif text-lg font-bold text-[var(--color-rooster-green)] mb-2">Best Brew Method</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{product.bestBrewMethod || "Drip, Pour Over, or French Press"}</p>
              </div>
            </div>

            {/* Tasting Notes */}
            <div className="border-t border-stone-300 py-6 mb-8">
              <div className="grid grid-cols-[120px_1fr] gap-4 items-start">
                <span className="font-mono text-sm text-stone-600 pt-1">Tasting Notes</span>
                <div className="space-y-2">
                  {product.tastingNotes.map((note, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getNoteColor(note)}`} />
                      <span className="font-mono text-sm text-stone-800 uppercase tracking-wide">{note}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Size Selector */}
            <div className="border-t border-stone-300 py-6 mb-6">
              <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
                <span className="font-mono text-sm text-stone-600">Size:</span>
                <div className="flex gap-3">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={clsx(
                        "px-6 py-2 rounded-full font-mono text-sm transition-all border border-stone-300",
                        size === s 
                          ? "bg-[#2D4F43] text-white border-[#2D4F43]" 
                          : "bg-transparent text-stone-600 hover:border-stone-400"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quantity & Grind */}
            <div className="border-t border-stone-300 py-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
                  <span className="font-mono text-sm text-stone-600">Quantity:</span>
                  <div className="flex items-center justify-between bg-[#EAE7DE] border border-stone-300 rounded-full px-4 py-2 w-32">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="hover:text-[#9D0208]">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-mono text-sm">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="hover:text-[#9D0208]">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-[60px_1fr] gap-4 items-center">
                  <span className="font-mono text-sm text-stone-600">Grind:</span>
                  <div className="relative">
                    <select 
                      value={grind}
                      onChange={(e) => setGrind(e.target.value)}
                      className="w-full px-4 py-2 rounded-full border border-stone-300 bg-[#EAE7DE] font-mono text-sm text-stone-700 focus:border-[#2D4F43] outline-none appearance-none cursor-pointer pr-10"
                    >
                      <option>Whole Bean</option>
                      <option>Drip</option>
                      <option>Espresso</option>
                      <option>French Press</option>
                      <option>Pour Over</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase Options */}
            <div className="space-y-4 mb-8">
              <label className={clsx(
                "flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all",
                purchaseType === 'onetime' ? "border-[#2D4F43] bg-white" : "border-transparent hover:bg-white/50"
              )}>
                <div className={clsx(
                  "w-5 h-5 rounded-full border flex items-center justify-center",
                  purchaseType === 'onetime' ? "border-[#2D4F43]" : "border-stone-400"
                )}>
                  {purchaseType === 'onetime' && <div className="w-3 h-3 rounded-full bg-[#2D4F43]" />}
                </div>
                <input type="radio" name="purchaseType" className="hidden" checked={purchaseType === 'onetime'} onChange={() => setPurchaseType('onetime')} />
                <span className="font-mono text-sm text-stone-700">One-time Purchase</span>
              </label>

              <label className={clsx(
                "flex flex-wrap items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all",
                purchaseType === 'subscription' ? "border-[#2D4F43] bg-white" : "border-transparent hover:bg-white/50"
              )}>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className={clsx(
                    "w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0",
                    purchaseType === 'subscription' ? "border-[#2D4F43]" : "border-stone-400"
                  )}>
                    {purchaseType === 'subscription' && <div className="w-3 h-3 rounded-full bg-[#2D4F43]" />}
                  </div>
                  <input type="radio" name="purchaseType" className="hidden" checked={purchaseType === 'subscription'} onChange={() => setPurchaseType('subscription')} />
                  <span className="font-mono text-sm text-stone-700">Subscribe & Save</span>
                </div>
                
                {purchaseType === 'subscription' && (
                  <div className="ml-9 sm:ml-auto w-full sm:w-auto relative">
                    <select 
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="w-full sm:w-48 px-4 py-2 rounded-full border border-stone-300 bg-[#EAE7DE] font-mono text-sm text-stone-700 focus:border-[#2D4F43] outline-none appearance-none cursor-pointer pr-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="Monthly">Monthly (Save 15%)</option>
                      <option value="1 Year">Prepay 1 Year (Save 20%)</option>
                      <option value="2 Year">Prepay 2 Years (Save 25%)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 pointer-events-none" />
                  </div>
                )}
              </label>
            </div>

            <button 
              onClick={handleAddToCart}
              className="w-full bg-[#7F1D1D] text-white font-bold font-mono text-lg py-4 rounded-md hover:bg-[#601515] transition-colors shadow-lg uppercase tracking-widest"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
