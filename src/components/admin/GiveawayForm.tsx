
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { NewGiveaway } from '../../types/giveaway';

interface GiveawayFormProps {
  onSubmit: (giveaway: NewGiveaway) => void;
  onCancel: () => void;
}

const GiveawayForm: React.FC<GiveawayFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<NewGiveaway>({
    title: '',
    description: '',
    image: '',
    prize: '',
    endDate: '',
    participationLink: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data being submitted:', formData);
    
    // التحقق من أن جميع الحقول المطلوبة مملوءة
    if (!formData.title || !formData.description || !formData.image || !formData.prize || !formData.endDate) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    
    onSubmit(formData);
    // إعادة تعيين النموذج
    setFormData({
      title: '',
      description: '',
      image: '',
      prize: '',
      endDate: '',
      participationLink: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(`Field ${name} changed to:`, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Card className="gaming-card max-w-2xl mx-auto">
      <CardHeader className="bg-slate-950">
        <CardTitle className="text-white text-xl">إضافة Giveaway جديد</CardTitle>
        <CardDescription className="text-gray-300">
          أدخل تفاصيل الـ Giveaway الجديد
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-slate-950 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">عنوان الـ Giveaway</Label>
            <Input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="اكتب عنوان الـ Giveaway"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prize" className="text-white">الجائزة</Label>
            <Input
              id="prize"
              name="prize"
              type="text"
              value={formData.prize}
              onChange={handleChange}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="اكتب تفاصيل الجائزة"
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
            <Label htmlFor="participationLink" className="text-white">رابط المشاركة</Label>
            <Input
              id="participationLink"
              name="participationLink"
              type="url"
              value={formData.participationLink}
              onChange={handleChange}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="https://example.com/participate"
            />
            <p className="text-xs text-gray-400">
              الرابط الذي سيتم توجيه المستخدمين إليه عند الضغط على "شارك الآن"
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate" className="text-white">تاريخ انتهاء الـ Giveaway</Label>
            <Input
              id="endDate"
              name="endDate"
              type="datetime-local"
              value={formData.endDate}
              onChange={handleChange}
              className="bg-gray-800 border-gray-600 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">الوصف</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full h-32 px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white resize-none"
              placeholder="اكتب وصف مفصل عن الـ Giveaway..."
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
              إضافة الـ Giveaway
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default GiveawayForm;
