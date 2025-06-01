
import ProductCard from './ProductCard';
import { useProducts } from '../contexts/ProductsContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Loader2 } from 'lucide-react';

const ProductsSection = () => {
  const { products, loading } = useProducts();
  const { t } = useLanguage();

  return (
    <section id="products" className="py-20 bg-gradient-to-b from-gray-900 to-gray-800 bg-[#222222]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('products.advanced.tools').split(' ').slice(0, -1).join(' ')} <span className="bg-gaming-gradient bg-clip-text text-transparent">{t('products.advanced.tools').split(' ').slice(-1)}</span>
          </h2>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto mb-4">
            {t('products.exclusive.collection')}
          </p>
          <p className="text-lg text-pink-400 font-semibold">
            {t('products.monthly.subscription')}
          </p>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            <span className="text-gray-300 mr-3">{t('products.loading')}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <div 
                key={product.id} 
                className="animate-fade-in" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
