
import ProductCard from './ProductCard';

const ProductsSection = () => {
  const products = [
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

  return (
    <section id="products" className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            أدوات <span className="bg-gaming-gradient bg-clip-text text-transparent">الجيمنج</span> المتقدمة
          </h2>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto mb-4">
            مجموعة حصرية من أقوى أدوات الهاكينج والبايباس للجيمرز المحترفين
          </p>
          <p className="text-lg text-pink-400 font-semibold">
            ⚡ جميع الأسعار للاشتراك الشهري - ضمان الجودة والأمان
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
