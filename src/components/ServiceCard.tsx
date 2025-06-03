
import { ShoppingCart, Heart, Play, Hash } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useState } from 'react';

interface ServiceCardProps {
  id: number;
  uniqueId: string;
  name: string;
  price: string;
  image: string;
  video?: string;
  description: string;
  rating: number;
  category: string;
}

const ServiceCard = ({ id, uniqueId, name, price, image, video, description, rating, category }: ServiceCardProps) => {
  const { addItem } = useCart();
  const { t } = useLanguage();
  const [showVideo, setShowVideo] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);

  const handleAddToCart = () => {
    addItem({ id, name, price, image });
    console.log(`Adding service ${name} to cart - Price: ${price}`);
  };

  const handleAddToFavorites = () => {
    console.log(`Adding service ${name} to favorites`);
  };

  const toggleVideo = () => {
    console.log('=== TOGGLE VIDEO CLICKED ===');
    console.log('Service ID:', id);
    console.log('Service Name:', name);
    console.log('Current showVideo state:', showVideo);
    console.log('Video URL provided:', video);
    
    if (!video) {
      console.error('No video URL provided for this service');
      return;
    }
    
    if (!showVideo) {
      console.log('Setting video to show - starting load');
      setVideoLoading(true);
      setVideoError(false);
      document.body.style.overflow = 'hidden';
    } else {
      console.log('Hiding video');
      document.body.style.overflow = 'auto';
    }
    
    setShowVideo(!showVideo);
  };

  const handleVideoError = (e: any) => {
    console.error('=== VIDEO ERROR ===');
    console.error('Video URL that failed:', video);
    console.error('Error event:', e);
    setVideoError(true);
    setVideoLoading(false);
    setShowVideo(false);
    document.body.style.overflow = 'auto';
  };

  const handleVideoEnd = () => {
    console.log('Video playback ended');
    setShowVideo(false);
    document.body.style.overflow = 'auto';
  };

  const handleVideoLoadStart = () => {
    console.log('Video loading started for URL:', video);
    setVideoLoading(true);
  };

  const handleVideoCanPlay = () => {
    console.log('Video can play - ready for playback');
    setVideoLoading(false);
  };

  const handleVideoLoadedData = () => {
    console.log('Video data loaded successfully');
    setVideoLoading(false);
  };

  const handleVideoPlay = () => {
    console.log('Video started playing successfully');
  };

  const handleVideoPause = () => {
    console.log('Video paused');
  };

  const closeVideoModal = () => {
    setShowVideo(false);
    document.body.style.overflow = 'auto';
  };

  console.log('ServiceCard render - showVideo:', showVideo, 'hasVideo:', !!video, 'videoError:', videoError);

  return (
    <>
      <div className="gaming-card overflow-hidden group">
        <div className="relative overflow-hidden">
          <img 
            src={image} 
            alt={name}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {video && (
            <button 
              onClick={toggleVideo}
              className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ zIndex: 5 }}
            >
              <div className="bg-purple-600/90 backdrop-blur-sm p-4 rounded-full hover:bg-purple-500/90 transition-colors">
                <Play className="w-8 h-8 text-white fill-current" />
              </div>
            </button>
          )}
          {videoError && video && (
            <div className="absolute top-2 left-2 bg-red-600/90 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-white text-xs">خطأ في تحميل الفيديو</span>
            </div>
          )}
          {!video && (
            <div className="absolute top-2 left-2 bg-yellow-600/90 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-white text-xs">لا يوجد فيديو</span>
            </div>
          )}
          
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={handleAddToFavorites}
              className="bg-gray-900/90 backdrop-blur-sm p-2 rounded-full hover:bg-pink-500/20 transition-colors"
            >
              <Heart className="w-5 h-5 text-pink-400 hover:text-pink-300" />
            </button>
          </div>
          <div className="absolute top-4 left-4">
            <span className="bg-purple-600/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white">
              {category}
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        
        <div className="p-6">
          {/* معرف الحساب */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Hash className="w-4 h-4 text-purple-400" />
              <span className="font-mono text-purple-300 bg-purple-900/20 px-2 py-1 rounded text-sm">
                {uniqueId}
              </span>
            </div>
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

          <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
          
          <p className="text-purple-200 mb-4 text-sm leading-relaxed">{description}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-pink-400">{price}</span>
            <button 
              onClick={handleAddToCart}
              className="btn-gaming flex items-center space-x-2 hover:scale-105 active:scale-95"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>احصل عليها</span>
            </button>
          </div>
        </div>
      </div>

      {/* Video Modal Overlay */}
      {showVideo && video && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          {/* Close Button */}
          <button 
            onClick={closeVideoModal}
            className="absolute top-4 right-4 bg-gray-900/90 backdrop-blur-sm p-3 rounded-full hover:bg-gray-800/90 transition-colors z-60"
          >
            <span className="text-white text-xl font-bold">×</span>
          </button>

          {/* Video Container */}
          <div className="relative w-full max-w-4xl mx-4">
            {/* Service Info */}
            <div className="absolute top-4 left-4 bg-purple-600/90 backdrop-blur-sm px-4 py-2 rounded-full z-30">
              <span className="text-white text-sm font-semibold">{name}</span>
            </div>

            {/* Loading Indicator */}
            {videoLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20 rounded-lg">
                <div className="text-white text-lg">جاري تحميل الفيديو...</div>
              </div>
            )}

            {/* Video Player */}
            {!videoError ? (
              <video 
                src={video} 
                controls
                autoPlay
                muted
                className="w-full max-h-[80vh] rounded-lg shadow-2xl"
                style={{ aspectRatio: '16/9' }}
                onEnded={handleVideoEnd}
                onError={handleVideoError}
                onLoadStart={handleVideoLoadStart}
                onCanPlay={handleVideoCanPlay}
                onLoadedData={handleVideoLoadedData}
                onPlay={handleVideoPlay}
                onPause={handleVideoPause}
                onLoadedMetadata={() => console.log('Video metadata loaded')}
                onSeeking={() => console.log('Video seeking')}
                onSeeked={() => console.log('Video seeked')}
                onWaiting={() => console.log('Video waiting')}
                onPlaying={() => console.log('Video playing event')}
              />
            ) : (
              <div className="w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-red-400 text-xl mb-2">خطأ في تحميل الفيديو</div>
                  <div className="text-gray-300 text-sm">تعذر تشغيل الفيديو</div>
                </div>
              </div>
            )}
          </div>

          {/* Click outside to close */}
          <div 
            className="absolute inset-0 -z-10" 
            onClick={closeVideoModal}
          />
        </div>
      )}
    </>
  );
};

export default ServiceCard;
