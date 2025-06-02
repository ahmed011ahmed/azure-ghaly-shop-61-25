import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Star, ArrowLeft, DollarSign } from 'lucide-react';
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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.productName.trim()) {
      newErrors.productName = 'اسم المنتج مطلوب';
    }

    if (formData.price <= 0) {
      newErrors.price = 'السعر يجب أن يكون أكبر من صفر';
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

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
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
        price: Number(formData.price),
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

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // إزالة رسالة الخطأ عند التعديل
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={onCancel} 
          className="mb-4 border-gray-600 hover:bg-gray-700 text-gray-950"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          العودة للقائمة
        </Button>
        
        <h2 className="text-2xl font-bold text-white">إضافة حساب PUBG جديد</h2>
        <p className="text-gray-300 mt-1">أدخل بيانات حساب PUBG الجديد بالتفصيل</p>
      </div>

      <Card className="gaming-card">
        <CardHeader className="bg-slate-950">
          <CardTitle className="text-white">بيانات الحساب</CardTitle>
          <CardDescription className="text-gray-300">
            جميع الحقول مطلوبة عدا الفيديو والملاحظات
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-gray-950">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* اسم المنتج */}
            <div>
              <Label htmlFor="productName" className="text-gray-300">اسم المنتج</Label>
              <Input 
                id="productName"
                value={formData.productName}
                onChange={(e) => handleInputChange('productName', e.target.value)}
                placeholder="مثال: حساب PUBG مميز مع سكنات نادرة"
                className={`mt-1 bg-gray-800/50 border-gray-600 text-white ${errors.productName ? 'border-red-500' : ''}`}
              />
              {errors.productName && <p className="text-red-400 text-sm mt-1">{errors.productName}</p>}
            </div>

            {/* السعر */}
            <div>
              <Label htmlFor="price" className="text-gray-300">السعر (بالدولار)</Label>
              <div className="relative mt-1">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price || ''}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className={`pl-10 bg-gray-800/50 border-gray-600 text-white ${errors.price ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.price && <p className="text-red-400 text-sm mt-1">{errors.price}</p>}
              <p className="text-gray-500 text-sm mt-1">أدخل سعر الحساب بالدولار الأمريكي</p>
            </div>

            {/* رابط الصورة */}
            <div>
              <Label htmlFor="image" className="text-gray-300">رابط الصورة</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                placeholder="https://example.com/image.jpg"
                className={`mt-1 bg-gray-800/50 border-gray-600 text-white ${errors.image ? 'border-red-500' : ''}`}
              />
              {errors.image && <p className="text-red-400 text-sm mt-1">{errors.image}</p>}
              
              {/* معاينة الصورة */}
              {formData.image && isValidUrl(formData.image) && (
                <div className="mt-4">
                  <p className="text-gray-300 text-sm mb-2">معاينة الصورة:</p>
                  <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-700">
                    <img 
                      src={formData.image} 
                      alt="معاينة" 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* رابط الفيديو */}
            <div>
              <Label htmlFor="video" className="text-gray-300">رابط الفيديو (اختياري)</Label>
              <Input
                id="video"
                value={formData.video}
                onChange={(e) => handleInputChange('video', e.target.value)}
                placeholder="https://example.com/video.mp4"
                className={`mt-1 bg-gray-800/50 border-gray-600 text-white ${errors.video ? 'border-red-500' : ''}`}
              />
              {errors.video && <p className="text-red-400 text-sm mt-1">{errors.video}</p>}
              <p className="text-gray-500 text-sm mt-1">يمكنك ترك هذا الحقل فارغاً إذا لم تكن تريد إضافة فيديو</p>
            </div>

            {/* الوصف */}
            <div>
              <Label htmlFor="description" className="text-gray-300">وصف الحساب</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="أدخل وصف تفصيلي للحساب، المستوى، السكنات، الأسلحة، إلخ..."
                rows={4}
                className={`mt-1 bg-gray-800/50 border-gray-600 text-white resize-none ${errors.description ? 'border-red-500' : ''}`}
              />
              {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
              <p className="text-gray-500 text-sm mt-1">
                {formData.description.length}/500 حرف (الحد الأدنى 20 حرف)
              </p>
            </div>

            {/* التقييم */}
            <div>
              <Label className="text-gray-300">التقييم</Label>
              <div className="mt-2 flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleInputChange('rating', star)}
                      className={`transition-colors ${
                        star <= formData.rating ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-300'
                      }`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
                <span className="text-gray-300">({formData.rating}/5)</span>
              </div>
            </div>

            {/* ملاحظات إضافية */}
            <div>
              <Label htmlFor="notes" className="text-gray-300">ملاحظات إضافية (اختياري)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="أي ملاحظات إضافية حول الحساب..."
                maxLength={200}
                rows={3}
                className="mt-1 bg-gray-800/50 border-gray-600 text-white resize-none"
              />
              <p className="text-gray-500 text-sm mt-1">
                {formData.notes?.length || 0}/200 حرف
              </p>
            </div>

            {/* أزرار الحفظ والإلغاء */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="border-gray-600 text-black bg-white my-[6px] py-[7px] mx-[12px]"
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
    </div>
  );
};

export default PubgAccountForm;
