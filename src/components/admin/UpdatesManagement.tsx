
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Update {
  id?: number;
  title: string;
  description: string;
  version: string;
  created_at?: string;
}

const UpdatesManagement = () => {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<Update | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '', version: '' });
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const { data, error } = await supabase
        .from('updates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUpdates(data || []);
    } catch (error) {
      console.error('Error fetching updates:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل التحديثات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.version) {
      toast({
        title: "خطأ",
        description: "يجب ملء جميع الحقول",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingUpdate) {
        const { error } = await supabase
          .from('updates')
          .update(formData)
          .eq('id', editingUpdate.id);
        if (error) throw error;
        toast({
          title: "نجح",
          description: "تم تحديث الإصدار بنجاح"
        });
      } else {
        const { error } = await supabase
          .from('updates')
          .insert([formData]);
        if (error) throw error;
        toast({
          title: "نجح",
          description: "تم إضافة التحديث بنجاح"
        });
      }
      
      setFormData({ title: '', description: '', version: '' });
      setShowForm(false);
      setEditingUpdate(null);
      fetchUpdates();
    } catch (error) {
      console.error('Error saving update:', error);
      toast({
        title: "خطأ",
        description: "فشل في حفظ التحديث",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (update: Update) => {
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
      const { error } = await supabase
        .from('updates')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "نجح",
        description: "تم حذف التحديث بنجاح"
      });
      fetchUpdates();
    } catch (error) {
      console.error('Error deleting update:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف التحديث",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {editingUpdate ? 'تعديل التحديث' : 'إضافة تحديث جديد'}
          </h2>
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
        <h2 className="text-2xl font-bold text-white">إدارة التحديثات</h2>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gaming-gradient"
        >
          <Plus className="w-4 h-4 mr-2" />
          إضافة تحديث جديد
        </Button>
      </div>

      <Card className="gaming-card">
        <CardHeader className="bg-slate-900">
          <CardTitle className="text-white">قائمة التحديثات</CardTitle>
          <CardDescription className="text-gray-300">
            جميع تحديثات البرامج المنشورة للمشتركين
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
              <p className="text-gray-500 mb-4">لم يتم إضافة أي تحديثات بعد</p>
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

export default UpdatesManagement;
