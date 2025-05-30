
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  image: string;
  description: string;
  rating: number;
}

const ProductCard = ({ id, name, price, image, description, rating }: ProductCardProps) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({ id, name, price, image });
    console.log(`Adding ${name} to cart - Price: ${price}`);
  };

  const handleAddToFavorites = () => {
    console.log(`Adding ${name} to favorites`);
    // يمكن إضافة المنطق الخاص بالمفضلة هنا
  };

  return (
    <div className="gaming-card overflow-hidden group">
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={handleAddToFavorites}
            className="bg-gray-900/90 backdrop-blur-sm p-2 rounded-full hover:bg-pink-500/20 transition-colors"
          >
            <Heart className="w-5 h-5 text-pink-400 hover:text-pink-300" />
          </button>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-white">{name}</h3>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <span 
                key={i} 
                className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-600'}`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        
        <p className="text-purple-200 mb-4 text-sm leading-relaxed">{description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-pink-400">{price}</span>
          <button 
            onClick={handleAddToCart}
            className="btn-gaming flex items-center space-x-2 hover:scale-105 active:scale-95"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>احصل عليه</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
