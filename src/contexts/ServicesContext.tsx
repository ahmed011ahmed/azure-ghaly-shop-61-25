import React, { createContext, useContext, useState, useEffect } from 'react';
import { Service } from '../types/service';

interface ServicesContextType {
  services: Service[];
  loading: boolean;
  addService: (service: Omit<Service, 'id'>) => Promise<void>;
  updateService: (id: number, service: Omit<Service, 'id'>) => Promise<void>;
  deleteService: (id: number) => Promise<void>;
}

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

export const useServices = () => {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error('useServices must be used within a ServicesProvider');
  }
  return context;
};

const defaultServices: Service[] = [
  {
    id: 1,
    name: "🔒 حساب بوبجي متقدم",
    price: "$25",
    description: "حساب بوبجي محترف مع مستوى عالي وأسلحة نادرة وإكسسوارات حصرية",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=500&q=60",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    rating: 5,
    category: "بوبجي"
  },
  {
    id: 2,
    name: "⚡ حساب فورتنايت مميز",
    price: "$30",
    description: "حساب فورتنايت مع سكنز حصرية ومستوى عالي ومجموعة كبيرة من الأدوات",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=500&q=60",
    rating: 4,
    category: "فورتنايت"
  },
  {
    id: 3,
    name: "🎯 حساب كول أوف ديوتي",
    price: "$15",
    description: "حساب كول أوف ديوتي مع إنجازات متقدمة وأسلحة مفتوحة ومستوى احترافي",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=500&q=60",
    rating: 5,
    category: "كول أوف ديوتي"
  }
];

export const ServicesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // محاكاة تحميل البيانات
    const loadServices = () => {
      const savedServices = localStorage.getItem('services');
      if (savedServices) {
        setServices(JSON.parse(savedServices));
      } else {
        setServices(defaultServices);
        localStorage.setItem('services', JSON.stringify(defaultServices));
      }
      setLoading(false);
    };

    loadServices();
  }, []);

  const saveServices = (newServices: Service[]) => {
    localStorage.setItem('services', JSON.stringify(newServices));
    setServices(newServices);
  };

  const addService = async (serviceData: Omit<Service, 'id'>) => {
    const newService: Service = {
      ...serviceData,
      id: Date.now()
    };
    const updatedServices = [...services, newService];
    saveServices(updatedServices);
  };

  const updateService = async (id: number, serviceData: Omit<Service, 'id'>) => {
    const updatedServices = services.map(service => 
      service.id === id ? { ...serviceData, id } : service
    );
    saveServices(updatedServices);
  };

  const deleteService = async (id: number) => {
    const updatedServices = services.filter(service => service.id !== id);
    saveServices(updatedServices);
  };

  return (
    <ServicesContext.Provider value={{
      services,
      loading,
      addService,
      updateService,
      deleteService
    }}>
      {children}
    </ServicesContext.Provider>
  );
};
