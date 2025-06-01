
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { NewPubgAccount } from '../../types/pubgAccount';

interface PubgAccountFormProps {
  onSubmit: (account: NewPubgAccount) => void;
  onCancel: () => void;
}

const PubgAccountForm: React.FC<PubgAccountFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<NewPubgAccount>({
    image: '',
    description: '',
    video: '',
    price: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // إعادة تعيين النموذج
    setFormData({
      image: '',
      description: '',
      video: '',
      price: 0
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <Card className="gaming-card max-w-2xl mx-auto">
      <CardHeader className="bg-slate-950">
        <CardTitle className="text-white text-xl">إضافة حساب PUBG جديد</CardTitle>
        <CardDescription className="text-gray-300">
          أدخل تفاصيل حساب PUBG الجديد مع السعر
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-slate-950 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="price" className="text-white">السعر ($)</Label>
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
            <Label htmlFor="image" className="text-white">رابط الصورة</Label>
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
            <Label htmlFor="description" className="text-white">الوصف</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full h-32 px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white resize-none"
              placeholder="اكتب وصف مفصل عن الحساب..."
              required
            />
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
