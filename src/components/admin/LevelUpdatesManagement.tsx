
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, Loader2, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useUpdates } from '../../hooks/useUpdates';

interface LevelUpdatesManagementProps {
  level: number;
}

const LevelUpdatesManagement = ({ level }: LevelUpdatesManagementProps) => {
  const { updates, loading, addUpdate, updateUpdate, deleteUpdate } = useUpdates(level);
  const [showForm, setShowForm] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<any>(null);
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    version: ''
  });
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const getLevelName = (level: number) => {
    const names = { 1: 'برونزي', 2: 'فضي', 3: 'ذهبي', 4: 'بلاتيني', 5: 'ماسي' };
    return names[level as keyof typeof names] || `المستوى ${level}`;
  };

  const getLevelColor = (level: number) => {
    const colors = { 1: 'text-orange-400', 2: 'text-gray-400', 3: 'text-yellow-400', 4: 'text-purple-400', 5: 'text-blue-400' };
    return colors[level as keyof typeof colors] || 'text-gray-400';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.version) return;

    try {
      const updateData = { ...formData, target_level: level };
      
      if (editingUpdate) {
        await updateUpdate(editingUpdate.id!, updateData);
      } else {
        await addUpdate(updateData);
      }
      
      setFormData({ title: '', description: '', version: '' });
      setShowForm(false);
      setEditingUpdate(null);
    } catch (error) {
      console.error('Error saving update:', error);
    }
  };

  const handleEdit = (update: any) => {
    setEditingUpdate(update);
    setFormData({
      title: update.title,
      description: update.description,
      version: update.version
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا التحديث؟')) return;

    try {
      setActionLoading(id);
      await deleteUpdate(id);
    } catch (error) {
      console.error('Error deleting update:', error);
    } finally {
      setActionLoading(null);
    }
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Star className={`w-6 h-6 ${getLevelColor(level)}`} />
            <h2 className="text-2xl font-bold text-white">
              {editingUpdate ? 'تعديل تحديث' : 'إضافة تحديث جديد'} - {getLevelName(level)}
            </h2>
          </div>
          <Button
            onClick={() => {
              setShowForm(false);
              setEditingUpdate(null);
              setFormData({ title: '', description: '', version: '' });
            }}
            variant="outline"
            className="border-gray-500 text-gray-300"
          >
            إلغاء
          </Button>
        </div>

        <Card className="gaming-card">
          <CardContent className="bg-slate-950 pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-gray-300">عنوان التحديث</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-gray-800/50 border-gray-600 text-white"
                  placeholder="مثال: تحديث البايباس الجديد"
                  required
                />
              </div>

              <div>
                <Label htmlFor="version" className="text-gray-300">رقم الإصدار</Label>
                <Input
                  id="version"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  className="bg-gray-800/50 border-gray-600 text-white"
                  placeholder="مثال: v2.1.4"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-gray-300">وصف التحديث</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-gray-800/50 border-gray-600 text-white"
                  placeholder="اكتب وصف مفصل للتحديث..."
                  rows={4}
                  required
                />
              </div>

              <Button type="submit" className="bg-gaming-gradient">
                {editingUpdate ? 'حفظ التعديلات' : 'إضافة التحديث'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Star className={`w-6 h-6 ${getLevelColor(level)}`} />
          <h2 className="text-2xl font-bold text-white">
            تحديثات {getLevelName(level)} ({updates.length})
          </h2>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gaming-gradient"
        >
          <Plus className="w-4 h-4 mr-2" />
          إضافة تحديث
        </Button>
      </div>

      <Card className="gaming-card">
        <CardHeader className="bg-slate-900">
          <CardTitle className="text-white">التحديثات المخصصة للمستوى {getLevelName(level)}</CardTitle>
          <CardDescription className="text-gray-300">
            جميع التحديثات المتاحة لمشتركي المستوى {getLevelName(level)}
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-slate-950">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
              <span className="text-gray-300 mr-3">جاري تحميل التحديثات...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-300">العنوان</TableHead>
                    <TableHead className="text-gray-300">الإصدار</TableHead>
                    <TableHead className="text-gray-300">الوصف</TableHead>
                    <TableHead className="text-gray-300">التاريخ</TableHead>
                    <TableHead className="text-gray-300">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {updates.map((update) => (
                    <TableRow key={update.id}>
                      <TableCell className="font-medium text-white">
                        {update.title}
                      </TableCell>
                      <TableCell className="text-purple-400">
                        {update.version}
                      </TableCell>
                      <TableCell className="text-gray-300 max-w-md">
                        <div className="truncate">{update.description}</div>
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {new Date(update.created_at || '').toLocaleDateString('ar-EG')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(update)}
                            className="border-blue-500 text-blue-400 bg-blue-500/10"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(update.id!)}
                            className="border-red-500 text-red-400 bg-red-500/10"
                            disabled={actionLoading === update.id}
                          >
                            {actionLoading === update.id ? (
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

          {!loading && updates.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">لا توجد تحديثات</h3>
              <p className="text-gray-500 mb-4">لم يتم إضافة أي تحديثات لهذا المستوى بعد</p>
              <Button onClick={() => setShowForm(true)} className="bg-gaming-gradient">
                <Plus className="w-4 h-4 mr-2" />
                إضافة أول تحديث
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LevelUpdatesManagement;
