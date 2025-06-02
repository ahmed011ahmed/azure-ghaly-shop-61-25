
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Star } from 'lucide-react';
import { NewPubgAccount } from '../../types/pubgAccount';

interface PubgAccountFormProps {
  onSubmit: (account: NewPubgAccount) => void;
  onCancel: () => void;
}

const PubgAccountForm: React.FC<PubgAccountFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<NewPubgAccount>({
    productName: '',
    price: 0,
    image: '',
    description: '',
    video: '',
    rating: 5,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من صحة البيانات
    if (!formData.productName.trim()) {
      alert('يرجى إدخال اسم المنتج');
      return;
    }
    
    if (!formData.image.trim()) {
      alert('يرجى إدخال رابط الصورة');
      return;
    }
    
    if (!formData.description.trim() || formData.description.length < 20) {
      alert('يرجى إدخال وصف لا يقل عن 20 حرف');
      return;
    }
    
    if (formData.price < 0) {
      alert('يرجى إدخال سعر صحيح');
      return;
    }

    onSubmit(formData);
    
    // إعادة تعيين النموذج
    setFormData({
      productName: '',
      price: 0,
      image: '',
      description: '',
      video: '',
      rating: 5,
      notes: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'rating' ? Number(value) : value
    }));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-6 h-6 cursor-pointer ${
          index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'
        }`}
        onClick={() => setFormData(prev => ({ ...prev, rating: index + 1 }))}
      />
    ));
  };

  return (
    <Card className="gaming-card max-w-2xl mx-auto">
      <CardHeader className="bg-slate-950">
        <CardTitle className="text-white text-xl">إضافة حساب PUBG جديد</CardTitle>
        <CardDescription className="text-gray-300">
          أدخل بيانات حساب PUBG الجديد بالتفصيل
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-slate-950 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="productName" className="text-white">اسم المنتج *</Label>
            <Input
              id="productName"
              name="productName"
              type="text"
              value={formData.productName}
              onChange={handleChange}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="مثال: حساب PUBG مميز مع سكنات نادرة"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price" className="text-white">السعر (بالدولار) *</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="25.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image" className="text-white">رابط الصورة *</Label>
            <Input
              id="image"
              name="image"
              type="url"
              value={formData.image}
              onChange={handleChange}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video" className="text-white">رابط الفيديو (اختياري)</Label>
            <Input
              id="video"
              name="video"
              type="url"
              value={formData.video}
              onChange={handleChange}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="https://example.com/video.mp4"
            />
            <p className="text-sm text-gray-400">يمكنك ترك هذا الحقل فارغاً إذا لم تكن تريد إضافة فيديو</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">وصف الحساب *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="bg-gray-800 border-gray-600 text-white resize-none"
              placeholder="أدخل وصف تفصيلي للحساب، المستوى، السكنات، الأسلحة، إلخ..."
              maxLength={500}
              rows={4}
              required
            />
            <p className="text-sm text-gray-400">
              {formData.description.length}/500 حرف (الحد الأدنى 20 حرف)
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-white">التقييم *</Label>
            <div className="flex items-center space-x-1">
              {renderStars(formData.rating)}
              <span className="text-white ml-2">({formData.rating}/5)</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-white">ملاحظات إضافية (اختياري)</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="bg-gray-800 border-gray-600 text-white resize-none"
              placeholder="أي ملاحظات إضافية حول الحساب..."
              maxLength={200}
              rows={3}
            />
            <p className="text-sm text-gray-400">
              {formData.notes.length}/200 حرف
            </p>
          </div>

          <div className="flex space-x-3 justify-end pt-4">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              className="bg-gaming-gradient hover:shadow-lg hover:shadow-purple-500/25"
            >
              إضافة الحساب
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PubgAccountForm;
