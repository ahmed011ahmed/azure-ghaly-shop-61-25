
import ProductCard from './ProductCard';

const ProductsSection = () => {
  const products = [
    {
      id: 1,
      name: "Bypass GHALY + HAK RNG",
      price: "299 ج.م",
      description: "منتج متميز بجودة عالية ومواصفات ممتازة يلبي جميع احتياجاتك",
      image: "https://i.imgur.com/ogU7D3c.jpeg",
      rating: 5
    },
    {
      id: 2,
      name: "المنتج الأنيق",
      price: "450 ج.م",
      description: "تصميم عصري وأنيق مع أداء متفوق وضمان شامل لراحتك",
      image: "/placeholder.svg",
      rating: 4
    },
    {
      id: 3,
      name: "المنتج الذكي",
      price: "650 ج.م",
      description: "تقنية متطورة وحلول ذكية تجعل حياتك أسهل وأكثر راحة",
      image: "/placeholder.svg",
      rating: 5
    },
    {
      id: 4,
      name: "المنتج العملي",
      price: "380 ج.م",
      description: "عملي ومتين، مصمم خصيصاً للاستخدام اليومي المكثف",
      image: "/placeholder.svg",
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
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            مجموعة مختارة بعناية من أفضل المنتجات لتلبية جميع احتياجاتك
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
