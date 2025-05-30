
import { ArrowDown, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="hero-section min-h-screen flex items-center justify-center relative">
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-blue-300 mr-3 animate-float" />
            <span className="text-blue-200 font-semibold">منتجات متميزة وحصرية</span>
            <Sparkles className="w-8 h-8 text-blue-300 ml-3 animate-float" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            مرحباً بك في
            <span className="block bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
              GHALY
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            اكتشف مجموعتنا الحصرية من المنتجات عالية الجودة التي تلبي جميع احتياجاتك بأفضل الأسعار
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="btn-primary text-lg px-8 py-4">
              تسوق الآن
            </button>
            <button className="glass-effect text-white font-semibold py-4 px-8 rounded-xl hover:bg-white/20 transition-all duration-300">
              تعرف علينا
            </button>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-8 h-8 text-blue-300" />
        </div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/20" />
    </section>
  );
};

export default Hero;
