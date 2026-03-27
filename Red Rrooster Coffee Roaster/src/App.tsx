import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Visit from './components/Visit';
import Learn from './components/Learn';
import Shop from './components/Shop';
import ProductDetail from './components/ProductDetail';
import Contact from './components/Contact';
import Login from './components/Login';
import TheFix from './components/TheFix';
import CartDrawer from './components/CartDrawer';
import Wholesale from './components/Wholesale';
import ChatWidget from './components/ChatWidget';
import BookingQuery from './components/BookingQuery';
import BookingConfirmation from './components/BookingConfirmation';
import Checkout from './components/Checkout';
import { StoreProvider } from './context/StoreContext';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

import FAQ from './components/FAQ';
import CoffeeQuiz from './components/CoffeeQuiz';
import OrderTracking from './components/OrderTracking';

export default function App() {
  return (
    <StoreProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen font-sans text-stone-900 bg-[var(--color-rooster-cream)]">
          <Navbar />
          <CartDrawer />
          <ChatWidget />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/visit" element={<Visit />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/learn/book" element={<BookingQuery />} />
              <Route path="/learn/confirmation" element={<BookingConfirmation />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/:id" element={<ProductDetail />} />
              <Route path="/the-fix" element={<TheFix />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/wholesale" element={<Wholesale />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/quiz" element={<CoffeeQuiz />} />
              <Route path="/track-order" element={<OrderTracking />} />
              <Route path="*" element={<div className="pt-32 text-center">Page not found</div>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </StoreProvider>
  );
}
