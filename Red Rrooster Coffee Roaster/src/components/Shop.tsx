import { useState } from 'react';
import { Filter, Search, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { useStore } from '../context/StoreContext';
import clsx from 'clsx';

export default function Shop() {
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();
  const { addToCart } = useStore();

  const shopProducts = PRODUCTS.filter(p => p.name !== "The Fix Subscription");

  const filteredProducts = filter === 'All' 
    ? shopProducts 
    : shopProducts.filter(p => p.type.includes(filter) || p.region.includes(filter) || p.roast.includes(filter));

  const handleQuickAdd = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    addToCart({
      ...product,
      cartId: `${product.id}-12oz-Whole Bean-onetime-${Date.now()}`,
      selectedSize: '12oz',
      selectedGrind: 'Whole Bean',
      quantity: 1,
      purchaseType: 'onetime'
    });
  };

  const handleFilterClick = (e: React.MouseEvent, category: string) => {
    e.stopPropagation();
    setFilter(category);
  };

  return (
    <div className="bg-[#F5F2EB] min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h1 className="font-serif text-4xl font-bold text-[var(--color-rooster-green)] mb-2">Shop Coffee</h1>
            <p className="text-stone-500">Freshly roasted in Floyd, VA. Free shipping on orders over $50.</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input 
                type="text" 
                placeholder="Search coffees..." 
                className="w-full pl-10 pr-4 py-2 rounded-full border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-rooster-green)] focus:border-transparent bg-white"
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex overflow-x-auto pb-4 mb-8 gap-2 no-scrollbar">
          {['All', 'Single Origin', 'Blend', 'Decaf', 'Light', 'Medium', 'Dark'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={clsx(
                "px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border",
                filter === cat 
                  ? 'bg-[var(--color-rooster-green)] text-white border-[var(--color-rooster-green)]' 
                  : 'bg-transparent text-stone-600 border-stone-300 hover:border-stone-500'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              onClick={() => navigate(`/shop/${product.id}`)}
              className="bg-[#EAE7DE] rounded-xl overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center p-8 pb-6"
            >
              <div className="relative w-full aspect-[3/4] mb-6 flex items-center justify-center">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              <h3 className="font-serif text-2xl font-normal text-[var(--color-rooster-green)] mb-2 leading-tight min-h-[3.5rem] flex items-center justify-center">
                {product.name}
              </h3>
              
              <div className="text-xl font-light text-stone-800 mb-6">
                ${product.price.toFixed(2)}
              </div>

              <div className="flex gap-3 mb-6">
                <button 
                  onClick={(e) => handleFilterClick(e, product.roast.split('-')[0])}
                  className="px-4 py-1.5 border border-stone-400 rounded-full text-xs font-bold text-stone-600 uppercase tracking-wider hover:bg-stone-200 transition-colors"
                >
                  {product.roast} Roast
                </button>
                <button 
                  onClick={(e) => handleFilterClick(e, product.type)}
                  className="px-4 py-1.5 border border-stone-400 rounded-full text-xs font-bold text-stone-600 uppercase tracking-wider hover:bg-stone-200 transition-colors"
                >
                  {product.type}
                </button>
              </div>

              <button 
                onClick={(e) => handleQuickAdd(e, product)}
                className="w-full bg-white border border-stone-300 text-[var(--color-rooster-green)] font-bold py-3 rounded-full hover:bg-[var(--color-rooster-green)] hover:text-white transition-all uppercase tracking-widest text-xs shadow-sm"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        {/* Roast Guide - Pain Point 2 */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-stone-200">
          <h2 className="font-serif text-3xl font-bold text-[var(--color-rooster-green)] mb-8 text-center">Find Your Perfect Roast</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-amber-200 rounded-full mx-auto flex items-center justify-center text-amber-800 font-bold text-xl">L</div>
              <h3 className="font-bold text-xl text-[var(--color-rooster-dark)]">Light Roast</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Bright, acidic, and complex. Highlights the unique characteristics of the bean's origin. Expect floral, fruity, and tea-like notes.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-amber-700 rounded-full mx-auto flex items-center justify-center text-white font-bold text-xl">M</div>
              <h3 className="font-bold text-xl text-[var(--color-rooster-dark)]">Medium Roast</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Balanced and smooth. The perfect middle ground retaining some origin character while introducing sweetness from the roast. Notes of chocolate, nuts, and caramel.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-stone-800 rounded-full mx-auto flex items-center justify-center text-white font-bold text-xl">D</div>
              <h3 className="font-bold text-xl text-[var(--color-rooster-dark)]">Dark Roast</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Bold, rich, and full-bodied. Lower acidity with prominent roast flavors. Expect notes of dark chocolate, smoke, and molasses.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
