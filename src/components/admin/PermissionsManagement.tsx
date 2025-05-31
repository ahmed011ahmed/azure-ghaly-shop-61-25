
import React, { useState, useEffect } from 'react';
import { Shield, UserPlus, Trash2, Search, Users, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Permission {
  id: string;
  email: string;
  granted_at: string;
  granted_by: string;
}

const PermissionsManagement = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // جلب قائمة الأذونات
  const fetchPermissions = async () => {
    try {
      setLoading(true);
      
      // محاولة جلب البيانات من localStorage أولاً
      const storedPermissions = localStorage.getItem('subscriberPermissions');
      if (storedPermissions) {
        setPermissions(JSON.parse(storedPermissions));
      } else {
        // إذا لم توجد بيانات، نبدأ بقائمة فارغة
        setPermissions([]);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل قائمة الأذونات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // حفظ الأذونات في localStorage
  const savePermissions = (newPermissions: Permission[]) => {
    localStorage.setItem('subscriberPermissions', JSON.stringify(newPermissions));
    setPermissions(newPermissions);
  };

  // إضافة إذن جديد
  const addPermission = async () => {
    if (!newEmail.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال البريد الإلكتروني",
        variant: "destructive"
      });
      return;
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail.trim())) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال بريد إلكتروني صحيح",
        variant: "destructive"
      });
      return;
    }

    // التحقق من عدم وجود البريد مسبقاً
    if (permissions.some(p => p.email === newEmail.trim())) {
      toast({
        title: "خطأ",
        description: "هذا البريد الإلكتروني موجود بالفعل في القائمة",
        variant: "destructive"
      });
      return;
    }

    try {
      setActionLoading('add');
      
      const newPermission: Permission = {
        id: Date.now().toString(),
        email: newEmail.trim(),
        granted_at: new Date().toISOString(),
        granted_by: 'admin'
      };

      const updatedPermissions = [...permissions, newPermission];
      savePermissions(updatedPermissions);
      
      setNewEmail('');
      toast({
        title: "تم بنجاح",
        description: `تم إضافة إذن الوصول للبريد: ${newPermission.email}`
      });
    } catch (error) {
      console.error('Error adding permission:', error);
      toast({
        title: "خطأ",
        description: "فشل في إضافة الإذن",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  // حذف إذن
  const removePermission = async (id: string, email: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف إذن الوصول للبريد: ${email}؟`)) {
      return;
    }

    try {
      setActionLoading(id);
      
      const updatedPermissions = permissions.filter(p => p.id !== id);
      savePermissions(updatedPermissions);
      
      toast({
        title: "تم الحذف",
        description: `تم حذف إذن الوصول للبريد: ${email}`
      });
    } catch (error) {
      console.error('Error removing permission:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف الإذن",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const filteredPermissions = permissions.filter(permission =>
    permission.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchPermissions();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">إدارة أذونات المشتركين</h2>
          <p className="text-gray-300 mt-1">تحديد من يمكنه الوصول إلى صفحة المشتركين</p>
        </div>
      </div>

      {/* إضافة إذن جديد */}
      <Card className="gaming-card">
        <CardHeader className="bg-slate-900">
          <CardTitle className="text-xl text-white flex items-center">
            <UserPlus className="w-5 h-5 mr-3 text-green-400" />
            إضافة إذن وصول جديد
          </CardTitle>
          <CardDescription className="text-gray-300">
            إضافة بريد إلكتروني جديد لإعطائه صلاحية الوصول لصفحة المشتركين
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-slate-950 pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="email" className="text-gray-300">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="أدخل البريد الإلكتروني..."
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="bg-gray-800/50 border-gray-600 text-white"
                onKeyPress={(e) => e.key === 'Enter' && addPermission()}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={addPermission}
                disabled={actionLoading === 'add'}
                className="bg-green-600 hover:bg-green-700"
              >
                {actionLoading === 'add' ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    إضافة
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* إحصائيات */}
      <Card className="gaming-card">
        <CardContent className="pt-6 bg-slate-950">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">إجمالي الأذونات الممنوحة</p>
              <p className="text-2xl font-bold text-white">{permissions.length}</p>
            </div>
            <Shield className="w-8 h-8 text-purple-400" />
          </div>
        </CardContent>
      </Card>

      {/* البحث والقائمة */}
      <Card className="gaming-card">
        <CardHeader className="bg-slate-900">
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-50">
              قائمة الأذونات ({filteredPermissions.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="البحث بالبريد الإلكتروني..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 bg-gray-800/50 border-gray-600 text-white"
              />
            </div>
          </div>
          <CardDescription className="text-gray-300">
            جميع المستخدمين المخولين للوصول إلى صفحة المشتركين
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-slate-950">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-300 mr-3">جاري التحميل...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-300">البريد الإلكتروني</TableHead>
                    <TableHead className="text-gray-300">تاريخ الإضافة</TableHead>
                    <TableHead className="text-gray-300">تم الإضافة بواسطة</TableHead>
                    <TableHead className="text-gray-300">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPermissions.map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell className="font-medium text-white">
                        {permission.email}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {new Date(permission.granted_at).toLocaleDateString('ar-EG')}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {permission.granted_by}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removePermission(permission.id, permission.email)}
                          className="border-red-500 text-red-600 bg-red-500/10"
                          disabled={actionLoading === permission.id}
                        >
                          {actionLoading === permission.id ? (
                            <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {!loading && filteredPermissions.length === 0 && (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">لا توجد أذونات</h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? 'لم يتم العثور على أذونات تطابق البحث' 
                  : 'لم يتم إضافة أي أذونات وصول بعد'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PermissionsManagement;
