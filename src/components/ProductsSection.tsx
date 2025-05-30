
import ProductCard from './ProductCard';

const ProductsSection = () => {
  const products = [
    {
      id: 1,
      name: "Bypass GHALY + HAK RNG",
      price: "$60",
      description: "منتج متميز بجودة عالية ومواصفات ممتازة يلبي جميع احتياجاتك",
      image: "https://i.imgur.com/ogU7D3c.jpeg",
      rating: 5
    },
    {
      id: 2,
      name: "RNG",
      price: "$35",
      description: "منتج امان 100%",
      image: "https://i.imgur.com/SJJK1ZQ.jpeg",
      rating: 4
    },
    {
      id: 3,
      name: "Bypass GHALY+ HAK GHALY",
      price: "$50",
      description: "طريقك الى الكونكر",
      image: "https://i.imgur.com/TzAjRA0.jpeg",
      rating: 5
    },
    {
      id: 4,
      name: "Bypass GHALY",
      price: "$40",
      description: "بيباس غالي فقط",
      image: "https://i.imgur.com/viiCVaD.jpeg",
      rating: 4
    }
  ];

  return (
    <section id="products" className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            منتجاتنا <span className="bg-blue-gradient bg-clip-text text-transparent">المتميزة</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
            مجموعة مختارة بعناية من أفضل المنتجات لتلبية جميع احتياجاتك
          </p>
          <p className="text-lg text-blue-600 font-semibold">
            * جميع الأسعار للاشتراك الشهري
          </p>
        </div>
        
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
      </div>
    </section>
  );
};

export default ProductsSection;
