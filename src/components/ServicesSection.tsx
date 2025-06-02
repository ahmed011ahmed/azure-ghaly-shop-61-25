import ServiceCard from './ServiceCard';
import { useServices } from '../contexts/ServicesContext';
import { Loader2 } from 'lucide-react';
const ServicesSection = () => {
  const {
    services,
    loading
  } = useServices();
  return <section id="services" className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          
          
          
        </div>
        
        {loading ? <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            <span className="text-gray-300 mr-3">جاري تحميل الحسابات...</span>
          </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => <div key={service.id} className="animate-fade-in" style={{
          animationDelay: `${index * 0.1}s`
        }}>
                <ServiceCard {...service} />
              </div>)}
          </div>}
      </div>
    </section>;
};
export default ServicesSection;