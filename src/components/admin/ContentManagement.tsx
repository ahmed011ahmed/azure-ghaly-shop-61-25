
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Package, Download, Calendar, Gift, Wrench, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useContent } from '../../hooks/useContent';
import { NewContentItem, CONTENT_TYPES } from '../../types/content';
import { SUBSCRIPTION_LEVELS } from '../../types/subscriber';

const ContentManagement = () => {
  const { content, loading, addContent, updateContent, deleteContent } = useContent();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [formData, setFormData] = useState<NewContentItem>({
    title: '',
    description: '',
    type: 'download',
    minimum_level: 1,
    download_url: '',
    version: '',
    file_size: '',
    price: '',
    image: '',
    rating: 5
  });
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    try {
      setActionLoading('submit');
      
      if (editingItem) {
        await updateContent(editingItem, formData);
        setEditingItem(null);
        toast({
          title: "تم التحديث",
          description: "تم تحديث المحتوى بنجاح"
        });
      } else {
        await addContent(formData);
        toast({
          title: "تم الإضافة",
          description: "تم إضافة المحتوى الجديد بنجاح"
        });
      }
      
      // إعادة تعيين النموذج
      setFormData({
        title: '',
        description: '',
        type: 'download',
        minimum_level: 1,
        download_url: '',
        version: '',
        file_size: '',
        price: '',
        image: '',
        rating: 5
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "فشل في حفظ المحتوى",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (item: any) => {
    setFormData(item);
    setEditingItem(item.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المحتوى؟')) {
      try {
        setActionLoading(id);
        await deleteContent(id);
        toast({
          title: "تم الحذف",
          description: "تم حذف المحتوى بنجاح"
        });
      } catch (error) {
        console.error('Error deleting content:', error);
        toast({
          title: "خطأ في الحذف",
          description: "فشل في حذف المحتوى",
          variant: "destructive"
        });
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      setActionLoading(id);
      await updateContent(id, { is_active: !currentStatus });
      toast({
        title: "تم التحديث",
        description: `تم ${!currentStatus ? 'تفعيل' : 'إلغاء تفعيل'} المحتوى`
      });
    } catch (error) {
      console.error('Error toggling content status:', error);
      toast({
        title: "خطأ في التحديث",
        description: "فشل في تحديث حالة المحتوى",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'download': return <Download className="w-4 h-4" />;
      case 'update': return <Calendar className="w-4 h-4" />;
      case 'giveaway': return <Gift className="w-4 h-4" />;
      case 'service': return <Wrench className="w-4 h-4" />;
      case 'product': return <Package className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const typeInfo = CONTENT_TYPES.find(t => t.value === type);
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        {getTypeIcon(type)}
        {typeInfo?.label || type}
      </Badge>
    );
  };

  const getLevelBadge = (level: number) => {
    const levelInfo = SUBSCRIPTION_LEVELS.find(l => l.level === level);
    if (!levelInfo) return <Badge variant="outline">غير محدد</Badge>;
    
    return (
      <Badge className={`${levelInfo.color} border-current`}>
        المستوى {level} - {levelInfo.name}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">إدارة المحتوى</h2>
          <p className="text-gray-300 mt-1">إدارة المحتوى مع تحديد المستويات المطلوبة للعرض</p>
        </div>
        <Button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingItem(null);
            setFormData({
              title: '',
              description: '',
              type: 'download',
              minimum_level: 1,
              download_url: '',
              version: '',
              file_size: '',
              price: '',
              image: '',
              rating: 5
            });
          }}
          className="bg-gaming-gradient hover:shadow-lg hover:shadow-purple-500/25"
        >
          <Plus className="w-4 h-4 mr-2" />
          إضافة محتوى جديد
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card className="gaming-card">
          <CardHeader className="bg-slate-900">
            <CardTitle className="text-white">
              {editingItem ? 'تعديل المحتوى' : 'إضافة محتوى جديد'}
            </CardTitle>
            <CardDescription className="text-gray-300">
              أدخل تفاصيل المحتوى واختر المستوى المطلوب لعرضه
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-slate-950 pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="text-gray-300">العنوان *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="mt-1 bg-gray-800/50 border-gray-600 text-white"
                    required
                  />
                </div>
                
                <div>
                  <Label className="text-gray-300">نوع المحتوى *</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value: any) => setFormData({...formData, type: value})}
                  >
                    <SelectTrigger className="mt-1 bg-gray-800/50 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTENT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(type.value)}
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-gray-300">الوصف *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="mt-1 bg-gray-800/50 border-gray-600 text-white"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">المستوى المطلوب للعرض *</Label>
                  <Select 
                    value={formData.minimum_level.toString()} 
                    onValueChange={(value) => setFormData({...formData, minimum_level: parseInt(value) as 1 | 2 | 3 | 4 | 5})}
                  >
                    <SelectTrigger className="mt-1 bg-gray-800/50 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBSCRIPTION_LEVELS.map((level) => (
                        <SelectItem key={level.level} value={level.level.toString()}>
                          <div className="flex items-center space-x-2">
                            <span className={level.color}>●</span>
                            <span>المستوى {level.level} - {level.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-400 mt-1">
                    المشتركون من هذا المستوى فما فوق يمكنهم رؤية هذا المحتوى
                  </p>
                </div>

                {(formData.type === 'download' || formData.type === 'update') && (
                  <div>
                    <Label htmlFor="download_url" className="text-gray-300">رابط التحميل</Label>
                    <Input
                      id="download_url"
                      value={formData.download_url || ''}
                      onChange={(e) => setFormData({...formData, download_url: e.target.value})}
                      className="mt-1 bg-gray-800/50 border-gray-600 text-white"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(formData.type === 'product' || formData.type === 'service') && (
                  <div>
                    <Label htmlFor="price" className="text-gray-300">السعر</Label>
                    <Input
                      id="price"
                      value={formData.price || ''}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="mt-1 bg-gray-800/50 border-gray-600 text-white"
                      placeholder="$50"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="version" className="text-gray-300">الإصدار</Label>
                  <Input
                    id="version"
                    value={formData.version || ''}
                    onChange={(e) => setFormData({...formData, version: e.target.value})}
                    className="mt-1 bg-gray-800/50 border-gray-600 text-white"
                    placeholder="v1.0"
                  />
                </div>

                <div>
                  <Label htmlFor="file_size" className="text-gray-300">حجم الملف</Label>
                  <Input
                    id="file_size"
                    value={formData.file_size || ''}
                    onChange={(e) => setFormData({...formData, file_size: e.target.value})}
                    className="mt-1 bg-gray-800/50 border-gray-600 text-white"
                    placeholder="25 MB"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image" className="text-gray-300">رابط الصورة</Label>
                <Input
                  id="image"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="mt-1 bg-gray-800/50 border-gray-600 text-white"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  className="bg-gaming-gradient hover:shadow-lg hover:shadow-purple-500/25"
                  disabled={actionLoading === 'submit'}
                >
                  {actionLoading === 'submit' ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      {editingItem ? 'تحديث المحتوى' : 'إضافة المحتوى'}
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingItem(null);
                  }}
                  className="border-gray-600 text-gray-300"
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Content Table */}
      <Card className="gaming-card">
        <CardHeader className="bg-slate-900">
          <CardTitle className="text-white">
            قائمة المحتوى ({loading ? '...' : content.length})
          </CardTitle>
          <CardDescription className="text-gray-300">
            جميع المحتوى المضاف مع المستويات المطلوبة
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-slate-950">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
              <span className="text-gray-300 mr-3">جاري تحميل المحتوى...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-300">العنوان</TableHead>
                    <TableHead className="text-gray-300">النوع</TableHead>
                    <TableHead className="text-gray-300">المستوى المطلوب</TableHead>
                    <TableHead className="text-gray-300">الحالة</TableHead>
                    <TableHead className="text-gray-300">تاريخ الإنشاء</TableHead>
                    <TableHead className="text-gray-300">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {content.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium text-white">
                        <div>
                          <div className="font-semibold">{item.title}</div>
                          <div className="text-sm text-gray-400">{item.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getTypeBadge(item.type)}
                      </TableCell>
                      <TableCell>
                        {getLevelBadge(item.minimum_level)}
                      </TableCell>
                      <TableCell>
                        <Badge className={item.is_active ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}>
                          {item.is_active ? 'نشط' : 'غير نشط'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {new Date(item.created_at).toLocaleDateString('ar-EG')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(item)}
                            className="border-blue-500 text-blue-400 bg-blue-500/10"
                            disabled={actionLoading === item.id}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleActive(item.id, item.is_active)}
                            className={`border-${item.is_active ? 'yellow' : 'green'}-500 text-${item.is_active ? 'yellow' : 'green'}-400 bg-${item.is_active ? 'yellow' : 'green'}-500/10`}
                            disabled={actionLoading === item.id}
                          >
                            {item.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            className="border-red-500 text-red-400 bg-red-500/10"
                            disabled={actionLoading === item.id}
                          >
                            {actionLoading === item.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {!loading && content.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">لا يوجد محتوى</h3>
              <p className="text-gray-500">لم يتم إضافة أي محتوى بعد</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentManagement;
