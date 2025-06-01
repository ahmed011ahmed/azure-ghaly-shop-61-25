
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Download, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { useDownloads } from '../../hooks/useDownloads';

interface DownloadLink {
  id?: number;
  name: string;
  description: string;
  download_url: string;
  version: string;
  file_size?: string;
  target_level?: number;
  created_at?: string;
}

const DownloadsManagement = () => {
  const { downloads, loading, addDownload, updateDownload, deleteDownload } = useDownloads();
  const [showForm, setShowForm] = useState(false);
  const [editingDownload, setEditingDownload] = useState<DownloadLink | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    download_url: '',
    version: '',
    file_size: ''
  });
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.download_url || !formData.version) {
      return;
    }

    try {
      if (editingDownload) {
        await updateDownload(editingDownload.id!, formData);
      } else {
        await addDownload(formData);
      }
      
      setFormData({ name: '', description: '', download_url: '', version: '', file_size: '' });
      setShowForm(false);
      setEditingDownload(null);
    } catch (error) {
      console.error('Error saving download:', error);
    }
  };

  const handleEdit = (download: DownloadLink) => {
    setEditingDownload(download);
    setFormData({
      name: download.name,
      description: download.description,
      download_url: download.download_url,
      version: download.version,
      file_size: download.file_size || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('هل أنت متأكد من حذف رابط التحميل؟')) return;

    try {
      setActionLoading(id);
      await deleteDownload(id);
    } catch (error) {
      console.error('Error deleting download:', error);
    } finally {
      setActionLoading(null);
    }
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {editingDownload ? 'تعديل رابط التحميل' : 'إضافة رابط تحميل جديد'}
          </h2>
          <Button
            onClick={() => {
              setShowForm(false);
              setEditingDownload(null);
              setFormData({ name: '', description: '', download_url: '', version: '', file_size: '' });
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
                <Label htmlFor="name" className="text-gray-300">اسم البرنامج *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-gray-800/50 border-gray-600 text-white"
                  placeholder="مثال: GHALY BYPASS TOOL"
                  required
                />
              </div>

              <div>
                <Label htmlFor="version" className="text-gray-300">رقم الإصدار *</Label>
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
                <Label htmlFor="download_url" className="text-gray-300">رابط التحميل *</Label>
                <Input
                  id="download_url"
                  type="url"
                  value={formData.download_url}
                  onChange={(e) => setFormData({ ...formData, download_url: e.target.value })}
                  className="bg-gray-800/50 border-gray-600 text-white"
                  placeholder="https://example.com/download"
                  required
                />
              </div>

              <div>
                <Label htmlFor="file_size" className="text-gray-300">حجم الملف</Label>
                <Input
                  id="file_size"
                  value={formData.file_size}
                  onChange={(e) => setFormData({ ...formData, file_size: e.target.value })}
                  className="bg-gray-800/50 border-gray-600 text-white"
                  placeholder="مثال: 45 MB"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-gray-300">وصف البرنامج *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-gray-800/50 border-gray-600 text-white"
                  placeholder="اكتب وصف مفصل للبرنامج..."
                  rows={3}
                  required
                />
              </div>

              <Button type="submit" className="bg-gaming-gradient">
                {editingDownload ? 'حفظ التعديلات' : 'إضافة رابط التحميل'}
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
        <h2 className="text-2xl font-bold text-white">إدارة روابط التحميل</h2>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gaming-gradient"
        >
          <Plus className="w-4 h-4 mr-2" />
          إضافة رابط جديد
        </Button>
      </div>

      <Card className="gaming-card">
        <CardHeader className="bg-slate-900">
          <CardTitle className="text-white">روابط التحميل</CardTitle>
          <CardDescription className="text-gray-300">
            جميع روابط تحميل البرامج المتاحة للمشتركين
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-slate-950">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
              <span className="text-gray-300 mr-3">جاري تحميل روابط التحميل...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-300">اسم البرنامج</TableHead>
                    <TableHead className="text-gray-300">الإصدار</TableHead>
                    <TableHead className="text-gray-300">الحجم</TableHead>
                    <TableHead className="text-gray-300">الوصف</TableHead>
                    <TableHead className="text-gray-300">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {downloads.map((download) => (
                    <TableRow key={download.id}>
                      <TableCell className="font-medium text-white">
                        {download.name}
                      </TableCell>
                      <TableCell className="text-purple-400">
                        {download.version}
                      </TableCell>
                      <TableCell className="text-green-400">
                        {download.file_size || 'غير محدد'}
                      </TableCell>
                      <TableCell className="text-gray-300 max-w-md">
                        <div className="truncate">{download.description}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(download)}
                            className="border-blue-500 text-blue-400 bg-blue-500/10"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(download.id!)}
                            className="border-red-500 text-red-400 bg-red-500/10"
                            disabled={actionLoading === download.id}
                          >
                            {actionLoading === download.id ? (
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

          {!loading && downloads.length === 0 && (
            <div className="text-center py-12">
              <Download className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">لا توجد روابط تحميل</h3>
              <p className="text-gray-500 mb-4">لم يتم إضافة أي روابط تحميل بعد</p>
              <Button onClick={() => setShowForm(true)} className="bg-gaming-gradient">
                <Plus className="w-4 h-4 mr-2" />
                إضافة أول رابط
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DownloadsManagement;
