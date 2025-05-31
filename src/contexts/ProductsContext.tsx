
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string;
  rating: number;
}

interface ProductsState {
  products: Product[];
}

interface ProductsContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: number) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

const initialProducts: Product[] = [
  {
    id: 1,
    name: "🎯 Bypass GHALY + HAK RNG",
    price: "$60",
    description: "أداة متقدمة للبايباس والهاكينج - تجربة جيمنج لا تُضاهى مع حماية 100%",
    image: "https://i.imgur.com/ogU7D3c.jpeg",
    rating: 5
  },
  {
    id: 2,
    name: "🔥 RNG Tool",
    price: "$35",
    description: "أداة RNG متطورة - امان مضمون 100% مع أداء فائق",
    image: "https://i.imgur.com/SJJK1ZQ.jpeg",
    rating: 4
  },
  {
    id: 3,
    name: "⚡ Bypass GHALY+ HAK GHALY",
    price: "$50",
    description: "طريقك المضمون للكونكر - أداة شاملة للجيمرز المحترفين",
    image: "https://i.imgur.com/TzAjRA0.jpeg",
    rating: 5
  },
  {
    id: 4,
    name: "🛡️ Bypass GHALY",
    price: "$40",
    description: "بايباس غالي المتخصص - حل مثالي للعبة آمنة ومتقدمة",
    image: "https://i.imgur.com/viiCVaD.jpeg",
    rating: 4
  }
];

const STORAGE_KEY = 'ghaly_products';

const loadProductsFromStorage = (): Product[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('Loaded products from localStorage:', parsed);
      return parsed;
    }
  } catch (error) {
    console.error('Error loading products from localStorage:', error);
  }
  return initialProducts;
};

const saveProductsToStorage = (products: Product[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    console.log('Saved products to localStorage:', products);
  } catch (error) {
    console.error('Error saving products to localStorage:', error);
  }
};

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  // Load products from localStorage on mount
  useEffect(() => {
    const loadedProducts = loadProductsFromStorage();
    setProducts(loadedProducts);
  }, []);

  // Save to localStorage whenever products change
  useEffect(() => {
    if (products.length > 0) {
      saveProductsToStorage(products);
    }
  }, [products]);

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: Math.max(...products.map(p => p.id), 0) + 1
    };
    setProducts(prev => [...prev, newProduct]);
    console.log('Added new product:', newProduct);
  };

  const updateProduct = (id: number, productData: Omit<Product, 'id'>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...productData, id } : p));
    console.log('Updated product:', productData);
  };

  const deleteProduct = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    console.log(`Deleted product with id: ${id}`);
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}
