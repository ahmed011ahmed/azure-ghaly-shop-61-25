import ServiceCard from './ServiceCard';
import PriceFilter from './PriceFilter';
import { useServices } from '../contexts/ServicesContext';
import { Loader2 } from 'lucide-react';
import { useState, useMemo } from 'react';

const ServicesSection = () => {
  const {
    services,
    loading
  } = useServices();
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const handlePriceChange = (min: number | null, max: number | null) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const extractPriceFromString = (priceString: string): number => {
    const match = priceString.match(/\d+\.?\d*/);
    return match ? parseFloat(match[0]) : 0;
  };

  const filteredServices = useMemo(() => {
    if (!minPrice && !maxPrice) {
      return services;
    }

    return services.filter(service => {
      const servicePrice = extractPriceFromString(service.price);
      
      if (minPrice && maxPrice) {
        return servicePrice >= minPrice && servicePrice <= maxPrice;
      } else if (minPrice) {
        return servicePrice >= minPrice;
      } else if (maxPrice) {
        return servicePrice <= maxPrice;
      }
      
      return true;
    });
  }, [services, minPrice, maxPrice]);

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          
          
          
        </div>
        
        <PriceFilter onPriceChange={handlePriceChange} />
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            <span className="text-gray-300 mr-3">جاري تحميل الحسابات...</span>
          </div>
        ) : (
          <>
            {filteredServices.length === 0 && (minPrice || maxPrice) ? (
              <div className="text-center py-12">
                <div className="text-gray-300 text-lg mb-2">لا توجد حسابات في هذا النطاق السعري</div>
                <div className="text-gray-500 text-sm">جرب تعديل نطاق الأسعار</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredServices.map((service, index) => (
                  <div 
                    key={service.id} 
                    className="animate-fade-in" 
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ServiceCard {...service} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;
