
import ServiceCard from './ServiceCard';
import { useServices } from '../contexts/ServicesContext';
import { Loader2 } from 'lucide-react';

const ServicesSection = () => {
  const { services, loading } = useServices();

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            حسابات <span className="bg-gaming-gradient bg-clip-text text-transparent">احترافية</span>
          </h2>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto mb-4">
            حسابات متخصصة لتطوير تجربة اللعب وتحسين الأداء
          </p>
          <p className="text-lg text-pink-400 font-semibold">
            حسابات عالية الجودة بأسعار تنافسية
          </p>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            <span className="text-gray-300 mr-3">جاري تحميل الحسابات...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
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
      </div>
    </section>
  );
};

export default ServicesSection;
