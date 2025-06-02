
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Service } from '../../types/service';

interface ServiceFormProps {
  service: Service | null;
  onSave: (service: Omit<Service, 'id'>) => void;
  onCancel: () => void;
}

const ServiceForm = ({ service, onSave, onCancel }: ServiceFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    rating: 5,
    category: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        price: service.price,
        description: service.description,
        image: service.image,
        rating: service.rating,
        category: service.category
      });
    }
  }, [service]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'اسم الحساب مطلوب';
    }
    
    if (!formData.price.trim()) {
      newErrors.price = 'السعر مطلوب';
    } else if (!formData.price.startsWith('$')) {
      newErrors.price = 'السعر يجب أن يبدأ بعلامة $';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'وصف الحساب مطلوب';
    } else if (formData.description.length < 20) {
      newErrors.description = 'الوصف يجب أن يكون 20 حرف على الأقل';
    }
    
    if (!formData.image.trim()) {
      newErrors.image = 'رابط الصورة مطلوب';
    } else if (!isValidUrl(formData.image)) {
      newErrors.image = 'رابط الصورة غير صحيح';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'فئة الحساب مطلوبة';
    }
    
    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'التقييم يجب أن يكون بين 1 و 5';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
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
        
        <h2 className="text-2xl font-bold text-white">
          {service ? 'تعديل الحساب' : 'إضافة حساب جديد'}
        </h2>
        <p className="text-gray-300 mt-1">
          {service ? 'قم بتعديل بيانات الحساب' : 'أدخل بيانات الحساب الجديد'}
        </p>
      </div>

      <Card className="gaming-card">
        <CardHeader className="bg-slate-950">
          <CardTitle className="text-white">بيانات الحساب</CardTitle>
          <CardDescription className="text-gray-300">
            جميع الحقول مطلوبة
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-gray-950">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* اسم الحساب */}
            <div>
              <Label htmlFor="name" className="text-gray-300">اسم الحساب</Label>
              <Input 
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="مثال: 🔒 حساب بوبجي متقدم"
                className={`mt-1 bg-gray-800/50 border-gray-600 text-white ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* السعر */}
            <div>
              <Label htmlFor="price" className="text-gray-300">السعر</Label>
              <Input 
                id="price"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="مثال: $25"
                className={`mt-1 bg-gray-800/50 border-gray-600 text-white ${errors.price ? 'border-red-500' : ''}`}
              />
              {errors.price && <p className="text-red-400 text-sm mt-1">{errors.price}</p>}
              <p className="text-gray-500 text-sm mt-1">السعر يجب أن يبدأ بعلامة $</p>
            </div>

            {/* فئة الحساب */}
            <div>
              <Label htmlFor="category" className="text-gray-300">فئة الحساب</Label>
              <Input 
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                placeholder="مثال: بوبجي، فورتنايت، كول أوف ديوتي"
                className={`mt-1 bg-gray-800/50 border-gray-600 text-white ${errors.category ? 'border-red-500' : ''}`}
              />
              {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category}</p>}
            </div>

            {/* الوصف */}
            <div>
              <Label htmlFor="description" className="text-gray-300">وصف الحساب</Label>
              <textarea 
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="أدخل وصف تفصيلي للحساب..."
                rows={4}
                className={`mt-1 w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${errors.description ? 'border-red-500' : ''}`}
              />
              {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
              <p className="text-gray-500 text-sm mt-1">
                {formData.description.length}/300 حرف (الحد الأدنى 20 حرف)
              </p>
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

            {/* التقييم */}
            <div>
              <Label htmlFor="rating" className="text-gray-300">التقييم</Label>
              <div className="mt-2 flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleInputChange('rating', star)}
                      className={`transition-colors ${
                        star <= formData.rating 
                          ? 'text-yellow-400' 
                          : 'text-gray-600 hover:text-yellow-300'
                      }`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
                <span className="text-gray-300">({formData.rating}/5)</span>
              </div>
              {errors.rating && <p className="text-red-400 text-sm mt-1">{errors.rating}</p>}
            </div>

            {/* أزرار الحفظ والإلغاء */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-700">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="border-gray-600 text-black bg-white my-[6px] py-[7px] mx-[12px]"
              >
                إلغاء
              </Button>
              <Button 
                type="submit" 
                className="bg-gaming-gradient hover:shadow-lg hover:shadow-purple-500/25"
              >
                {service ? 'حفظ التعديلات' : 'إضافة الحساب'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceForm;
