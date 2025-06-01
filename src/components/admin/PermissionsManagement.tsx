import React, { useState } from 'react';
import { Shield, UserPlus, Trash2, Search, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useToast } from '@/hooks/use-toast';
import { useSubscriberPermissions } from '@/hooks/useSubscriberPermissions';
import { supabase } from '@/integrations/supabase/client';

const PermissionsManagement = () => {
  const [newEmail, setNewEmail] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  const { 
    permissions, 
    loading, 
    addPermission, 
    removePermission 
  } = useSubscriberPermissions();

  // إضافة إذن جديد مع التحقق المحسن
  const handleAddPermission = async () => {
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

    try {
      setActionLoading('add');
      console.log('Attempting to add permission for:', newEmail.trim());
      
      // التحقق من وجود الإذن في قاعدة البيانات (نشط أو غير نشط)
      const { data: existingPermission, error: checkError } = await supabase
        .from('subscriber_permissions')
        .select('email, is_active')
        .eq('email', newEmail.trim())
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing permission:', checkError);
        toast({
          title: "خطأ",
          description: "فشل في التحقق من الإذن الموجود",
          variant: "destructive"
        });
        return;
      }

      console.log('Existing permission check result:', existingPermission);

      if (existingPermission) {
        if (existingPermission.is_active) {
          toast({
            title: "خطأ",
            description: "هذا البريد الإلكتروني موجود بالفعل في القائمة النشطة",
            variant: "destructive"
          });
          return;
        } else {
          // البريد موجود لكن غير نشط، قم بتفعيله
          console.log('Reactivating existing permission for:', newEmail.trim());
          const { error: reactivateError } = await supabase
            .from('subscriber_permissions')
            .update({ is_active: true, granted_at: new Date().toISOString() })
            .eq('email', newEmail.trim());

          if (reactivateError) {
            console.error('Error reactivating permission:', reactivateError);
            toast({
              title: "خطأ",
              description: "فشل في إعادة تفعيل الإذن",
              variant: "destructive"
            });
            return;
          }

          toast({
            title: "تم بنجاح",
            description: `تم إعادة تفعيل إذن الوصول للبريد: ${newEmail.trim()}`
          });
          
          setNewEmail('');
          return;
        }
      }

      // البريد غير موجود، أضف إذن جديد
      const success = await addPermission(newEmail.trim());
      if (success) {
        setNewEmail('');
      }
    } catch (error) {
      console.error('Unexpected error in handleAddPermission:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ غير متوقع",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  // حذف إذن
  const handleRemovePermission = async (id: string, email: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف إذن الوصول للبريد: ${email}؟`)) {
      return;
    }

    try {
      setActionLoading(id);
      await removePermission(id, email);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredPermissions = permissions.filter(permission =>
    permission.is_active && permission.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                onKeyPress={(e) => e.key === 'Enter' && handleAddPermission()}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleAddPermission}
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
              <p className="text-2xl font-bold text-white">{filteredPermissions.length}</p>
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
                          onClick={() => handleRemovePermission(permission.id, permission.email)}
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
