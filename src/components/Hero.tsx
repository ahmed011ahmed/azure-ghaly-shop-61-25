import { ArrowDown, Gamepad2 } from 'lucide-react';
const Hero = () => {
  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  const scrollToFooter = () => {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <section id="home" className="hero-section min-h-screen flex items-center justify-center relative">
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <Gamepad2 className="w-8 h-8 text-purple-300 mr-3 animate-float px-0 mx-0" />
            <span className="text-purple-200 font-semibold px-[14px]">أدوات الجيمنج المتقدمة</span>
            <Gamepad2 className="w-8 h-8 text-purple-300 ml-3 animate-float" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 px-[26px] py-[34px]">
            مرحباً بك في
            <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent py-[24px]">
              GHALY HAX
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            اكتشف أقوى أدوات الهاكينج والبايباس للألعاب - منتجات حصرية لتجربة جيمنج استثنائية
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button onClick={scrollToProducts} className="btn-gaming text-lg px-8 py-4">
              🎮 ابدأ اللعب الآن
            </button>
            <button onClick={scrollToFooter} className="glass-effect-gaming text-white font-semibold py-4 px-8 rounded-xl hover:bg-purple-500/20 transition-all duration-300">
              🏆 انضم للمجتمع
            </button>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          
        </div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/20" />
    </section>;
};
export default Hero;