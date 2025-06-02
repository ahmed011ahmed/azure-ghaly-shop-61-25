
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Service } from '../types/service';

interface ServicesContextType {
  services: Service[];
  loading: boolean;
  addService: (service: Omit<Service, 'id'>) => Promise<void>;
  updateService: (id: string, service: Omit<Service, 'id'>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
}

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

export const useServices = () => {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error('useServices must be used within a ServicesProvider');
  }
  return context;
};

// دالة لإنشاء ID عشوائي مكون من 6 حروف وأرقام
const generateRandomId = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// التأكد من عدم تكرار الـ ID
const generateUniqueId = (existingServices: Service[]): string => {
  let newId = generateRandomId();
  while (existingServices.some(service => service.id === newId)) {
    newId = generateRandomId();
  }
  return newId;
};

const defaultServices: Service[] = [
  {
    id: "A1B2C3",
    name: "🔒 حساب بوبجي متقدم",
    price: "$25",
    description: "حساب بوبجي محترف مع مستوى عالي وأسلحة نادرة وإكسسوارات حصرية",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=500&q=60",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    rating: 5,
    category: "بوبجي"
  },
  {
    id: "X7Y8Z9",
    name: "⚡ حساب فورتنايت مميز",
    price: "$30",
    description: "حساب فورتنايت مع سكنز حصرية ومستوى عالي ومجموعة كبيرة من الأدوات",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=500&q=60",
    rating: 4,
    category: "فورتنايت"
  },
  {
    id: "M5N6P7",
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
      id: generateUniqueId(services)
    };
    const updatedServices = [...services, newService];
    saveServices(updatedServices);
  };

  const updateService = async (id: string, serviceData: Omit<Service, 'id'>) => {
    const updatedServices = services.map(service => 
      service.id === id ? { ...serviceData, id } : service
    );
    saveServices(updatedServices);
  };

  const deleteService = async (id: string) => {
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
