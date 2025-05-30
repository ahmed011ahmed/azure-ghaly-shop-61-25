
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProductsSection from '../components/ProductsSection';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import { CartProvider } from '../contexts/CartContext';

const Index = () => {
  return (
    <CartProvider>
      <div className="min-h-screen">
        <Header />
        <Hero />
        <ProductsSection />
        <Footer />
        <Cart />
      </div>
    </CartProvider>
  );
};

export default Index;
