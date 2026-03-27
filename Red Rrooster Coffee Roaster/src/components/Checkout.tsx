import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ChevronDown, ChevronUp, Truck, Store, Info, CreditCard } from 'lucide-react';
import clsx from 'clsx';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useStore();
  const [step, setStep] = useState<'information' | 'shipping' | 'payment'>('information');
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'ship' | 'pickup'>('ship');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [phone, setPhone] = useState('');
  const [newsOffers, setNewsOffers] = useState(false);
  const [textOffers, setTextOffers] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateInfoStep = () => {
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = 'Email is required';
    if (!firstName) newErrors.firstName = 'First name is required';
    if (!lastName) newErrors.lastName = 'Last name is required';
    if (!address) newErrors.address = 'Address is required';
    if (!city) newErrors.city = 'City is required';
    if (!state) newErrors.state = 'State is required';
    if (!zip) newErrors.zip = 'ZIP code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToShipping = () => {
    if (validateInfoStep()) {
      setStep('shipping');
      window.scrollTo(0, 0);
    }
  };

  const handleContinueToPayment = () => {
    setStep('payment');
    window.scrollTo(0, 0);
  };

  const handlePayNow = () => {
    clearCart();
    setIsSuccess(true);
    window.scrollTo(0, 0);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans text-[#333] p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Order Confirmed!</h2>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. We've sent a confirmation email to {email}.
          </p>
          <Link 
            to="/" 
            className="inline-block bg-[#7F1D1D] text-white px-8 py-3 rounded font-medium hover:bg-[#601515] transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans text-[#333]">
      {/* Left Column - Form */}
      <div className="w-full lg:w-[58%] px-4 py-8 lg:px-12 lg:py-12 border-r border-gray-200">
        <div className="max-w-xl mx-auto lg:mx-0 lg:ml-auto">
            {/* Header / Breadcrumbs */}
            <div className="mb-6">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <span className={clsx("font-medium", step === 'information' ? "text-black" : "text-[#7F1D1D]")}>Information</span>
                    <span className="text-gray-400">&gt;</span>
                    <span className={clsx("font-medium", step === 'shipping' ? "text-black" : step === 'payment' ? "text-[#7F1D1D]" : "text-gray-500")}>Shipping</span>
                    <span className="text-gray-400">&gt;</span>
                    <span className={clsx("font-medium", step === 'payment' ? "text-black" : "text-gray-500")}>Payment</span>
                </div>
            </div>

            {/* Information Step */}
            {step === 'information' && (
                <>
                    {/* Contact Information */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-medium">Contact</h2>
                            <Link to="/login" className="text-sm text-[#7F1D1D] underline hover:no-underline">Sign in</Link>
                        </div>
                        <input 
                            type="email" 
                            placeholder="Email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={clsx(
                                "w-full border rounded px-3 py-3 mb-1 focus:outline-none focus:ring-2 focus:ring-[#7F1D1D] focus:border-transparent transition-shadow",
                                errors.email ? "border-red-500" : "border-gray-300"
                            )}
                        />
                        {errors.email && <p className="text-red-500 text-xs mb-2">{errors.email}</p>}
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={newsOffers}
                                onChange={(e) => setNewsOffers(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-[#7F1D1D] focus:ring-[#7F1D1D]"
                            />
                            <span className="text-sm text-gray-600">Email me with news and offers</span>
                        </label>
                    </div>

                    {/* Delivery Method */}
                    <div className="mb-8">
                        <h2 className="text-lg font-medium mb-3">Delivery method</h2>
                        <div className="border border-gray-300 rounded overflow-hidden">
                            <label className={clsx(
                                "flex items-center justify-between p-4 cursor-pointer border-b border-gray-200 transition-colors",
                                deliveryMethod === 'ship' ? "bg-[#F0F5FF] border-[#7F1D1D] z-10 relative" : "hover:bg-gray-50"
                            )}>
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="radio" 
                                        name="deliveryMethod" 
                                        checked={deliveryMethod === 'ship'} 
                                        onChange={() => setDeliveryMethod('ship')}
                                        className="w-4 h-4 text-[#7F1D1D] focus:ring-[#7F1D1D]"
                                    />
                                    <span className="text-sm font-medium">Ship</span>
                                </div>
                                <Truck className="w-5 h-5 text-gray-500" />
                            </label>
                            <label className={clsx(
                                "flex items-center justify-between p-4 cursor-pointer transition-colors",
                                deliveryMethod === 'pickup' ? "bg-[#F0F5FF] border-[#7F1D1D] z-10 relative" : "hover:bg-gray-50"
                            )}>
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="radio" 
                                        name="deliveryMethod" 
                                        checked={deliveryMethod === 'pickup'} 
                                        onChange={() => setDeliveryMethod('pickup')}
                                        className="w-4 h-4 text-[#7F1D1D] focus:ring-[#7F1D1D]"
                                    />
                                    <span className="text-sm font-medium">Pick up</span>
                                </div>
                                <Store className="w-5 h-5 text-gray-500" />
                            </label>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="mb-8">
                        <h2 className="text-lg font-medium mb-3">Shipping address</h2>
                        <div className="space-y-3">
                            <div className="relative">
                                <select className="w-full border border-gray-300 rounded px-3 py-3 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#7F1D1D] focus:border-transparent">
                                    <option>United States</option>
                                    <option>Canada</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                <label className="absolute text-xs text-gray-500 left-3 top-1 pointer-events-none">Country/Region</label>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <input 
                                        type="text" 
                                        placeholder="First name" 
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className={clsx(
                                            "w-full border rounded px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#7F1D1D] focus:border-transparent",
                                            errors.firstName ? "border-red-500" : "border-gray-300"
                                        )}
                                    />
                                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                                </div>
                                <div>
                                    <input 
                                        type="text" 
                                        placeholder="Last name" 
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className={clsx(
                                            "w-full border rounded px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#7F1D1D] focus:border-transparent",
                                            errors.lastName ? "border-red-500" : "border-gray-300"
                                        )}
                                    />
                                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                                </div>
                            </div>
                            <input 
                                type="text" 
                                placeholder="Company (optional)" 
                                className="w-full border border-gray-300 rounded px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#7F1D1D] focus:border-transparent"
                            />
                            <div>
                                <input 
                                    type="text" 
                                    placeholder="Address" 
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className={clsx(
                                        "w-full border rounded px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#7F1D1D] focus:border-transparent",
                                        errors.address ? "border-red-500" : "border-gray-300"
                                    )}
                                />
                                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                            </div>
                            <input 
                                type="text" 
                                placeholder="Apartment, suite, etc. (optional)" 
                                value={apartment}
                                onChange={(e) => setApartment(e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#7F1D1D] focus:border-transparent"
                            />
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <input 
                                        type="text" 
                                        placeholder="City" 
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className={clsx(
                                            "w-full border rounded px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#7F1D1D] focus:border-transparent",
                                            errors.city ? "border-red-500" : "border-gray-300"
                                        )}
                                    />
                                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                                </div>
                                <div className="relative">
                                    <select 
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                        className={clsx(
                                            "w-full border rounded px-3 py-3 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#7F1D1D] focus:border-transparent",
                                            errors.state ? "border-red-500" : "border-gray-300"
                                        )}
                                    >
                                        <option value="">State</option>
                                        <option value="VA">Virginia</option>
                                        <option value="NY">New York</option>
                                        <option value="CA">California</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                    {errors.state && <p className="text-red-500 text-xs mt-1 absolute -bottom-5 left-0">{errors.state}</p>}
                                </div>
                                <div>
                                    <input 
                                        type="text" 
                                        placeholder="ZIP code" 
                                        value={zip}
                                        onChange={(e) => setZip(e.target.value)}
                                        className={clsx(
                                            "w-full border rounded px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#7F1D1D] focus:border-transparent",
                                            errors.zip ? "border-red-500" : "border-gray-300"
                                        )}
                                    />
                                    {errors.zip && <p className="text-red-500 text-xs mt-1">{errors.zip}</p>}
                                </div>
                            </div>
                            <div className="relative">
                                <input 
                                    type="tel" 
                                    placeholder="Phone" 
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full border border-gray-300 rounded px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#7F1D1D] focus:border-transparent pl-10"
                                />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                                    <Info className="w-4 h-4" />
                                </div>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">
                                    Question mark icon
                                </div>
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer mt-2">
                                <input 
                                    type="checkbox" 
                                    checked={textOffers}
                                    onChange={(e) => setTextOffers(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-[#7F1D1D] focus:ring-[#7F1D1D]"
                                />
                                <span className="text-sm text-gray-600">Text me with news and offers</span>
                            </label>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end mb-12">
                        <button 
                            onClick={handleContinueToShipping}
                            className="bg-[#7F1D1D] text-white px-8 py-4 rounded font-medium hover:bg-[#601515] transition-colors"
                        >
                            Continue to shipping
                        </button>
                    </div>
                </>
            )}

            {/* Shipping Step */}
            {step === 'shipping' && (
                <>
                    {/* Summary Card */}
                    <div className="border border-gray-200 rounded-lg p-4 mb-8 text-sm">
                        <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-3">
                            <div className="flex gap-4">
                                <span className="text-gray-500 w-16">Contact</span>
                                <span>{email}</span>
                            </div>
                            <button onClick={() => setStep('information')} className="text-[#7F1D1D] underline hover:no-underline text-xs">Change</button>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex gap-4">
                                <span className="text-gray-500 w-16">Ship to</span>
                                <span>{address}, {city} {state} {zip}, United States</span>
                            </div>
                            <button onClick={() => setStep('information')} className="text-[#7F1D1D] underline hover:no-underline text-xs">Change</button>
                        </div>
                    </div>

                    {/* Shipping Method */}
                    <div className="mb-8">
                        <h2 className="text-lg font-medium mb-3">Shipping method</h2>
                        <div className="border border-gray-300 rounded overflow-hidden">
                            <label className="flex items-center justify-between p-4 cursor-pointer border-b border-gray-200 hover:bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="radio" 
                                        name="shippingMethod" 
                                        checked={shippingMethod === 'standard'} 
                                        onChange={() => setShippingMethod('standard')}
                                        className="w-4 h-4 text-[#7F1D1D] focus:ring-[#7F1D1D]"
                                    />
                                    <span className="text-sm font-medium">Standard Shipping (5-7 business days)</span>
                                </div>
                                <span className="text-sm font-medium">$5.00</span>
                            </label>
                            <label className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="radio" 
                                        name="shippingMethod" 
                                        checked={shippingMethod === 'express'} 
                                        onChange={() => setShippingMethod('express')}
                                        className="w-4 h-4 text-[#7F1D1D] focus:ring-[#7F1D1D]"
                                    />
                                    <span className="text-sm font-medium">Express Shipping (2-3 business days)</span>
                                </div>
                                <span className="text-sm font-medium">$15.00</span>
                            </label>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-between items-center mb-12">
                        <button onClick={() => setStep('information')} className="text-[#7F1D1D] text-sm flex items-center gap-1 hover:underline">
                            <ChevronDown className="w-4 h-4 rotate-90" /> Return to information
                        </button>
                        <button 
                            onClick={handleContinueToPayment}
                            className="bg-[#7F1D1D] text-white px-8 py-4 rounded font-medium hover:bg-[#601515] transition-colors"
                        >
                            Continue to payment
                        </button>
                    </div>
                </>
            )}

            {/* Payment Step */}
            {step === 'payment' && (
                <>
                    {/* Summary Card */}
                    <div className="border border-gray-200 rounded-lg p-4 mb-8 text-sm">
                        <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-3">
                            <div className="flex gap-4">
                                <span className="text-gray-500 w-16">Contact</span>
                                <span>{email}</span>
                            </div>
                            <button onClick={() => setStep('information')} className="text-[#7F1D1D] underline hover:no-underline text-xs">Change</button>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-3">
                            <div className="flex gap-4">
                                <span className="text-gray-500 w-16">Ship to</span>
                                <span>{address}, {city} {state} {zip}, United States</span>
                            </div>
                            <button onClick={() => setStep('information')} className="text-[#7F1D1D] underline hover:no-underline text-xs">Change</button>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex gap-4">
                                <span className="text-gray-500 w-16">Method</span>
                                <span>{shippingMethod === 'standard' ? 'Standard Shipping' : 'Express Shipping'} · ${shippingMethod === 'standard' ? '5.00' : '15.00'}</span>
                            </div>
                            <button onClick={() => setStep('shipping')} className="text-[#7F1D1D] underline hover:no-underline text-xs">Change</button>
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="mb-8">
                        <h2 className="text-lg font-medium mb-1">Payment</h2>
                        <p className="text-sm text-gray-500 mb-4">All transactions are secure and encrypted.</p>
                        
                        <div className="border border-gray-300 rounded overflow-hidden">
                            <div className="bg-[#F0F5FF] border-b border-gray-200 p-4 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <input type="radio" checked readOnly className="w-4 h-4 text-[#7F1D1D] focus:ring-[#7F1D1D]" />
                                    <span className="text-sm font-medium">Credit card</span>
                                </div>
                                <div className="flex gap-1">
                                    <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center">
                                        <CreditCard className="w-4 h-4 text-gray-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-[#F4F4F4] border-b border-gray-200">
                                <div className="space-y-3">
                                    <input type="text" placeholder="Card number" className="w-full border border-gray-300 rounded px-3 py-3 bg-white" />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input type="text" placeholder="Expiration date (MM / YY)" className="w-full border border-gray-300 rounded px-3 py-3 bg-white" />
                                        <input type="text" placeholder="Security code" className="w-full border border-gray-300 rounded px-3 py-3 bg-white" />
                                    </div>
                                    <input type="text" placeholder="Name on card" className="w-full border border-gray-300 rounded px-3 py-3 bg-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                     {/* Footer Actions */}
                     <div className="flex justify-between items-center mb-12">
                        <button onClick={() => setStep('shipping')} className="text-[#7F1D1D] text-sm flex items-center gap-1 hover:underline">
                            <ChevronDown className="w-4 h-4 rotate-90" /> Return to shipping
                        </button>
                        <button 
                            onClick={handlePayNow}
                            className="bg-[#7F1D1D] text-white px-8 py-4 rounded font-medium hover:bg-[#601515] transition-colors"
                        >
                            Pay now
                        </button>
                    </div>
                </>
            )}
        </div>
      </div>

      {/* Right Column - Summary */}
      <div className="w-full lg:w-[42%] bg-[#F5F5F0] px-4 py-8 lg:px-12 lg:py-12 border-l border-gray-200">
        <div className="max-w-md mx-auto lg:mx-0">
            {/* Logo */}
            <div className="mb-8 hidden lg:block">
                <div className="relative w-14 h-14 bg-[#EAE7DE] flex items-center justify-center shadow-md overflow-hidden border border-[#C5A065]/30">
                 <svg viewBox="0 0 100 100" className="w-full h-full">
                   <text x="10" y="60" fontFamily='"Playfair Display", serif' fontSize="70" fill="#8B6E4E" fontWeight="900">R</text>
                   <text x="35" y="85" fontFamily='"Playfair Display", serif' fontSize="70" fill="#8B6E4E" fontWeight="900">R</text>
                 </svg>
               </div>
            </div>

            {/* Cart Items */}
            <div className="space-y-6 mb-8">
                {cart.map((item) => (
                    <div key={item.cartId} className="flex flex-col gap-3 pb-6 border-b border-gray-100 last:border-0">
                        <div className="flex items-start gap-4">
                            <div className="relative w-16 h-16 bg-white border border-gray-200 rounded overflow-hidden flex-shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                                <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-500 text-white text-xs rounded-full flex items-center justify-center font-medium shadow-sm">
                                    {item.quantity}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
                                <p className="text-xs text-gray-500 mb-1">{item.selectedSize} / {item.selectedGrind}</p>
                            </div>
                            <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
                                ${(item.price * item.quantity).toFixed(2)}
                            </div>
                        </div>

                        {/* Subscription Toggle removed as per request */}
                    </div>
                ))}
            </div>



            {/* Totals */}
            <div className="space-y-3 border-t border-gray-200 pt-6 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal · {cart.length} items</span>
                    <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                        <span>Shipping</span>
                        <Info className="w-3 h-3 text-gray-400" />
                    </div>
                    {step === 'information' ? (
                        <span className="text-xs text-gray-500">Calculated at next step</span>
                    ) : (
                        <span className="text-sm font-medium">${shippingMethod === 'standard' ? '5.00' : '15.00'}</span>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center border-t border-gray-200 pt-6 mb-8">
                <span className="text-lg font-medium text-gray-800">Total</span>
                <div className="flex items-baseline gap-2">
                    <span className="text-xs text-gray-500">USD</span>
                    <span className="text-2xl font-medium text-gray-900">
                        ${(cartTotal + (step === 'information' ? 0 : (shippingMethod === 'standard' ? 5 : 15))).toFixed(2)}
                    </span>
                </div>
            </div>


        </div>
      </div>
    </div>
  );
}
