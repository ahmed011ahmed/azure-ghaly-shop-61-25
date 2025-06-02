
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
    price: 0, // سيتم تجاهل هذا الحقل
    image: '',
    description: '',
    video: '',
    rating: 5,
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.productName.trim()) {
      newErrors.productName = 'اسم المنتج مطلوب';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'رابط الصورة مطلوب';
    } else {
      try {
        new URL(formData.image);
      } catch {
        newErrors.image = 'رابط الصورة غير صحيح';
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = 'الوصف مطلوب';
    } else if (formData.description.length < 20) {
      newErrors.description = 'الوصف يجب أن يكون 20 حرف على الأقل';
    }

    if (formData.video && formData.video.trim()) {
      try {
        new URL(formData.video);
      } catch {
        newErrors.video = 'رابط الفيديو غير صحيح';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('إرسال بيانات النموذج:', formData);
      
      const cleanedData: NewPubgAccount = {
        productName: formData.productName.trim(),
        price: 0, // قيمة افتراضية
        image: formData.image.trim(),
        description: formData.description.trim(),
        video: formData.video?.trim() || undefined,
        rating: Number(formData.rating),
        notes: formData.notes?.trim() || undefined
      };

      await onSubmit(cleanedData);
      
      setFormData({
        productName: '',
        price: 0,
        image: '',
        description: '',
        video: '',
        rating: 5,
        notes: ''
      });
      setErrors({});
    } catch (error) {
      console.error('خطأ في إرسال النموذج:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? Number(value) : value
    }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-6 h-6 cursor-pointer transition-colors ${
          index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400 hover:text-yellow-300'
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
              className={`bg-gray-800 border-gray-600 text-white ${errors.productName ? 'border-red-500' : ''}`}
              placeholder="مثال: حساب PUBG مميز مع سكنات نادرة"
              required
            />
            {errors.productName && <p className="text-red-400 text-sm">{errors.productName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image" className="text-white">رابط الصورة *</Label>
            <Input
              id="image"
              name="image"
              type="url"
              value={formData.image}
              onChange={handleChange}
              className={`bg-gray-800 border-gray-600 text-white ${errors.image ? 'border-red-500' : ''}`}
              placeholder="https://example.com/image.jpg"
              required
            />
            {errors.image && <p className="text-red-400 text-sm">{errors.image}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="video" className="text-white">رابط الفيديو (اختياري)</Label>
            <Input
              id="video"
              name="video"
              type="url"
              value={formData.video}
              onChange={handleChange}
              className={`bg-gray-800 border-gray-600 text-white ${errors.video ? 'border-red-500' : ''}`}
              placeholder="https://example.com/video.mp4"
            />
            {errors.video && <p className="text-red-400 text-sm">{errors.video}</p>}
            <p className="text-sm text-gray-400">يمكنك ترك هذا الحقل فارغاً إذا لم تكن تريد إضافة فيديو</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">وصف الحساب *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`bg-gray-800 border-gray-600 text-white resize-none ${errors.description ? 'border-red-500' : ''}`}
              placeholder="أدخل وصف تفصيلي للحساب، المستوى، السكنات، الأسلحة، إلخ..."
              maxLength={500}
              rows={4}
              required
            />
            {errors.description && <p className="text-red-400 text-sm">{errors.description}</p>}
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
              {formData.notes?.length || 0}/200 حرف
            </p>
          </div>

          <div className="flex space-x-3 justify-end pt-4">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              className="bg-gaming-gradient hover:shadow-lg hover:shadow-purple-500/25"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'جاري الإضافة...' : 'إضافة الحساب'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PubgAccountForm;
