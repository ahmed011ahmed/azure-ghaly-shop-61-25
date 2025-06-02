
import React from 'react';
import { Star, Play } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { PubgAccount } from '../types/pubgAccount';

interface PubgAccountCardProps {
  account: PubgAccount;
}

const PubgAccountCard: React.FC<PubgAccountCardProps> = ({ account }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'
        }`}
      />
    ));
  };

  return (
    <Card className="gaming-card group hover:scale-105 transition-all duration-300 overflow-hidden">
      {/* صورة الحساب */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={account.image}
          alt={account.productName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        <div className="absolute top-4 left-4">
          <Badge className="bg-green-900 text-green-200">
            {account.isAvailable ? 'متاح الآن' : 'غير متاح'}
          </Badge>
        </div>

        {/* عرض الـ Random ID */}
        <div className="absolute top-4 right-4">
          <div className="bg-black/70 text-yellow-400 px-3 py-1 rounded-lg font-bold text-sm">
            ID: {account.randomId}
          </div>
        </div>

        {/* السعر */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-gaming-gradient text-white px-4 py-2 rounded-lg font-bold text-lg">
            ${account.price}
          </div>
        </div>

        {/* زر تشغيل الفيديو إذا كان متوفراً */}
        {account.video && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="bg-purple-600/80 hover:bg-purple-600 text-white rounded-full p-4 backdrop-blur-sm"
                >
                  <Play className="w-8 h-8" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl w-full bg-black border-gray-800">
                <div className="aspect-video">
                  <video
                    controls
                    autoPlay
                    className="w-full h-full rounded-lg"
                    src={account.video}
                  >
                    متصفحك لا يدعم تشغيل الفيديو
                  </video>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      <CardContent className="bg-slate-950 p-6">
        {/* اسم المنتج */}
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
          {account.productName}
        </h3>

        {/* عرض ID الحساب */}
        <div className="text-center mb-4">
          <div className="inline-block bg-yellow-600 text-black px-4 py-2 rounded-lg font-bold text-lg">
            ID: {account.randomId}
          </div>
        </div>

        {/* التقييم */}
        <div className="flex items-center mb-4">
          <div className="flex items-center space-x-1">
            {renderStars(account.rating)}
          </div>
          <span className="text-gray-300 text-sm mr-2">({account.rating}/5)</span>
        </div>

        {/* الوصف */}
        <p className="text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3">
          {account.description}
        </p>

        {/* الملاحظات إذا كانت متوفرة */}
        {account.notes && (
          <div className="bg-purple-900/20 rounded-lg p-3 mb-4">
            <p className="text-purple-300 text-sm">{account.notes}</p>
          </div>
        )}
        
        {/* دعوة للتواصل */}
        <div className="bg-purple-900/20 rounded-lg p-4 text-center">
          <p className="text-purple-300 text-sm mb-2">للاستفسار والشراء</p>
          <p className="text-white font-medium">تواصل معنا عبر الشات</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PubgAccountCard;
