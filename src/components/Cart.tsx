
import React from 'react';
import { X, Plus, Minus, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const Cart = () => {
  const { state, removeItem, updateQuantity, clearCart, closeCart, getTotalPrice } = useCart();

  const handleWhatsAppOrder = () => {
    if (state.items.length === 0) return;
    
    let message = "مرحباً! أريد طلب المنتجات التالية:\n\n";
    
    state.items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   الكمية: ${item.quantity}\n`;
      message += `   السعر: ${item.price}\n\n`;
    });
    
    message += `إجمالي الطلب: $${getTotalPrice().toFixed(2)}\n\n`;
    message += "شكراً لكم!";
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/+201010673596?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const handleDiscordOrder = () => {
    if (state.items.length === 0) return;
    
    const discordUrl = 'https://discord.gg/HbGJt7Wcxg';
    window.open(discordUrl, '_blank');
  };

  if (!state.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeCart} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-gray-900 shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-purple-800/30 p-6">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-bold text-white">سلة الشراء</h2>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {state.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="w-16 h-16 text-gray-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-400 mb-2">السلة فارغة</h3>
                <p className="text-gray-500">أضف بعض المنتجات لتبدأ التسوق</p>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="gaming-card p-4">
                    <div className="flex items-start space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white text-sm mb-2 line-clamp-2">
                          {item.name}
                        </h4>
                        <p className="text-pink-400 font-bold mb-3">{item.price}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-1">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 text-gray-400 hover:text-white transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-white font-semibold min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 text-gray-400 hover:text-white transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t border-purple-800/30 p-6 space-y-4">
              <div className="flex items-center justify-between text-white">
                <span className="text-lg font-semibold">الإجمالي:</span>
                <span className="text-2xl font-bold text-pink-400">
                  ${getTotalPrice().toFixed(2)}
                </span>
              </div>
              
              <div className="space-y-3">
                <button 
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>اطلب عبر واتساب</span>
                </button>
                <button 
                  onClick={handleDiscordOrder}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span className="text-lg">💬</span>
                  <span>اطلب عبر ديسكورد</span>
                </button>
                <button
                  onClick={clearCart}
                  className="w-full glass-effect-gaming text-white font-semibold py-3 px-6 rounded-xl hover:bg-red-500/20 transition-all duration-300"
                >
                  مسح السلة
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
