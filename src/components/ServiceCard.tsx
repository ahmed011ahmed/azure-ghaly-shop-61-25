import { ShoppingCart, Heart, Play } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useState } from 'react';

interface ServiceCardProps {
  id: number;
  name: string;
  price: string;
  image: string;
  video?: string;
  description: string;
  rating: number;
  category: string;
}

const ServiceCard = ({ id, name, price, image, video, description, rating, category }: ServiceCardProps) => {
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
    console.log('Video URL type:', typeof video);
    console.log('Video URL length:', video ? video.length : 0);
    console.log('Has video?', !!video);
    console.log('Video error state:', videoError);
    
    if (!video) {
      console.error('No video URL provided for this service');
      return;
    }
    
    if (!showVideo) {
      console.log('Setting video to show - starting load');
      setVideoLoading(true);
      setVideoError(false);
    } else {
      console.log('Hiding video');
    }
    
    const newShowVideo = !showVideo;
    console.log('Setting showVideo to:', newShowVideo);
    setShowVideo(newShowVideo);
  };

  const handleVideoError = (e: any) => {
    console.error('=== VIDEO ERROR ===');
    console.error('Video URL that failed:', video);
    console.error('Error event:', e);
    console.error('Error type:', e.type);
    console.error('Error target:', e.target);
    if (e.target && e.target.error) {
      console.error('Media error code:', e.target.error.code);
      console.error('Media error message:', e.target.error.message);
    }
    setVideoError(true);
    setVideoLoading(false);
    setShowVideo(false);
  };

  const handleVideoEnd = () => {
    console.log('Video playback ended');
    setShowVideo(false);
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

  console.log('ServiceCard render - showVideo:', showVideo, 'hasVideo:', !!video, 'videoError:', videoError);

  return (
    <div className="gaming-card overflow-hidden group">
      <div className="relative overflow-hidden">
        {showVideo && video && !videoError ? (
          <div className="relative">
            <div className="absolute top-2 left-2 bg-green-600/90 backdrop-blur-sm px-3 py-1 rounded-full z-30">
              <span className="text-white text-xs">فيديو نشط</span>
            </div>
            {videoLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                <div className="text-white">جاري تحميل الفيديو...</div>
              </div>
            )}
            <video 
              src={video} 
              controls
              autoPlay
              muted
              className="w-full h-64 object-cover"
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
            <button 
              onClick={toggleVideo}
              className="absolute top-2 right-2 bg-gray-900/90 backdrop-blur-sm p-2 rounded-full hover:bg-gray-800/90 transition-colors z-10"
            >
              <span className="text-white text-sm font-bold">×</span>
            </button>
          </div>
        ) : (
          <>
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
          </>
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
            <span>احصل عليها</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
