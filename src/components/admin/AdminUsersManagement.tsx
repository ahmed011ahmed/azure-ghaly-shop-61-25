import React, { useState } from 'react';
import { UserPlus, Users, Shield, Edit, Trash2, Eye, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Checkbox } from '../ui/checkbox';
import { useAdminUsers } from '@/hooks/useAdminUsers';

const AdminUsersManagement = () => {
  const [newUsername, setNewUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();
  
  const { 
    adminUsers, 
    loading, 
    addAdminUser, 
    updateAdminUser, 
    removeAdminUser 
  } = useAdminUsers();

  // قائمة الصلاحيات المتاحة
  const availablePermissions = [
    { id: 'products', label: 'إدارة المنتجات', icon: 'Package' },
    { id: 'pubg-accounts', label: 'إدارة حسابات PUBG', icon: 'Gamepad2' },
    { id: 'giveaways', label: 'إدارة المسابقات', icon: 'Gift' },
    { id: 'subscribers', label: 'إدارة المشتركين', icon: 'Users' },
    { id: 'user-lookup', label: 'البحث عن المشتركين', icon: 'UserSearch' },
    { id: 'permissions', label: 'أذونات المشتركين', icon: 'Shield' },
    { id: 'downloads', label: 'روابط التحميل', icon: 'Download' },
    { id: 'updates', label: 'التحديثات', icon: 'Calendar' },
    { id: 'content', label: 'عرض المحتوى', icon: 'Eye' },
    { id: 'chat', label: 'شات العملاء', icon: 'MessageSquare' },
    { id: 'admin-users', label: 'إدارة مستخدمي الإدارة', icon: 'Settings' }
  ];

  // إضافة مستخدم إدارة جديد
  const handleAddAdminUser = async () => {
    if (!newUsername.trim() || !newUserPassword.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم المستخدم وكلمة المرور",
        variant: "destructive"
      });
      return;
    }

    if (selectedPermissions.length === 0) {
      toast({
        title: "خطأ",
        description: "يرجى تحديد صلاحية واحدة على الأقل",
        variant: "destructive"
      });
      return;
    }

    try {
      setActionLoading('add');
      const success = await addAdminUser(newUsername.trim(), newUserPassword, selectedPermissions);
      if (success) {
        setNewUsername('');
        setNewUserPassword('');
        setSelectedPermissions([]);
      }
    } finally {
      setActionLoading(null);
    }
  };

  // تحديث صلاحيات مستخدم
  const handleUpdateUser = async () => {
    if (!editingUser || selectedPermissions.length === 0) {
      toast({
        title: "خطأ",
        description: "يرجى تحديد صلاحية واحدة على الأقل",
        variant: "destructive"
      });
      return;
    }

    try {
      setActionLoading(editingUser.id);
      const success = await updateAdminUser(editingUser.id, selectedPermissions);
      if (success) {
        setEditingUser(null);
        setSelectedPermissions([]);
      }
    } finally {
      setActionLoading(null);
    }
  };

  // حذف مستخدم إدارة
  const handleRemoveUser = async (userId: string, username: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف مستخدم الإدارة: ${username}؟`)) {
      return;
    }

    try {
      setActionLoading(userId);
      await removeAdminUser(userId, username);
    } finally {
      setActionLoading(null);
    }
  };

  // تبديل حالة الصلاحية
  const togglePermission = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(p => p !== permissionId)
        : [...prev, permissionId]
    );
  };

  // فتح نافذة تعديل المستخدم
  const openEditDialog = (user: any) => {
    setEditingUser(user);
    setSelectedPermissions(user.permissions || []);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">إدارة مستخدمي الإدارة</h2>
          <p className="text-gray-300 mt-1">إضافة وإدارة المستخدمين الذين يمكنهم الوصول للوحة التحكم</p>
        </div>
      </div>

      {/* إضافة مستخدم جديد */}
      <Card className="gaming-card">
        <CardHeader className="bg-slate-900">
          <CardTitle className="text-xl text-white flex items-center">
            <UserPlus className="w-5 h-5 mr-3 text-green-400" />
            إضافة مستخدم إدارة جديد
          </CardTitle>
          <CardDescription className="text-gray-300">
            إنشاء حساب جديد للوصول إلى لوحة التحكم مع صلاحيات محددة
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-slate-950 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label htmlFor="username" className="text-gray-300">اسم المستخدم</Label>
              <Input
                id="username"
                type="text"
                placeholder="أدخل اسم المستخدم..."
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="bg-gray-800/50 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-300">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                placeholder="أدخل كلمة المرور..."
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                className="bg-gray-800/50 border-gray-600 text-white"
              />
            </div>
          </div>

          <div className="mb-6">
            <Label className="text-gray-300 mb-3 block">الصلاحيات المتاحة</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availablePermissions.map((permission) => (
                <div
                  key={permission.id}
                  className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedPermissions.includes(permission.id)
                      ? 'bg-purple-900/30 border-purple-500'
                      : 'bg-gray-800/30 border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => togglePermission(permission.id)}
                >
                  <Checkbox
                    checked={selectedPermissions.includes(permission.id)}
                    onChange={() => togglePermission(permission.id)}
                  />
                  <span className="text-white text-sm">{permission.label}</span>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleAddAdminUser}
            disabled={actionLoading === 'add'}
            className="bg-green-600 hover:bg-green-700 w-full"
          >
            {actionLoading === 'add' ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                إضافة مستخدم الإدارة
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* قائمة المستخدمين */}
      <Card className="gaming-card">
        <CardHeader className="bg-slate-900">
          <CardTitle className="text-slate-50 flex items-center">
            <Users className="w-5 h-5 mr-3 text-purple-400" />
            قائمة مستخدمي الإدارة ({adminUsers.length})
          </CardTitle>
          <CardDescription className="text-gray-300">
            جميع المستخدمين المخولين للوصول إلى لوحة التحكم
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
                    <TableHead className="text-gray-300">اسم المستخدم</TableHead>
                    <TableHead className="text-gray-300">الصلاحيات</TableHead>
                    <TableHead className="text-gray-300">تاريخ الإنشاء</TableHead>
                    <TableHead className="text-gray-300">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium text-white">
                        {user.username}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.permissions?.slice(0, 3).map((permission) => (
                            <Badge key={permission} variant="secondary" className="text-xs">
                              {availablePermissions.find(p => p.id === permission)?.label || permission}
                            </Badge>
                          ))}
                          {user.permissions?.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{user.permissions.length - 3} أخرى
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {new Date(user.created_at).toLocaleDateString('ar-EG')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditDialog(user)}
                                className="border-blue-500 text-blue-400 bg-blue-500/10"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-slate-900 border-gray-700">
                              <DialogHeader>
                                <DialogTitle className="text-white">تعديل صلاحيات المستخدم</DialogTitle>
                                <DialogDescription className="text-gray-300">
                                  تعديل صلاحيات المستخدم: {editingUser?.username}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <Label className="text-gray-300">الصلاحيات المتاحة</Label>
                                <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
                                  {availablePermissions.map((permission) => (
                                    <div
                                      key={permission.id}
                                      className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                                        selectedPermissions.includes(permission.id)
                                          ? 'bg-purple-900/30 border-purple-500'
                                          : 'bg-gray-800/30 border-gray-600 hover:border-gray-500'
                                      }`}
                                      onClick={() => togglePermission(permission.id)}
                                    >
                                      <Checkbox
                                        checked={selectedPermissions.includes(permission.id)}
                                        onChange={() => togglePermission(permission.id)}
                                      />
                                      <span className="text-white text-sm">{permission.label}</span>
                                    </div>
                                  ))}
                                </div>
                                <Button
                                  onClick={handleUpdateUser}
                                  disabled={actionLoading === editingUser?.id}
                                  className="bg-blue-600 hover:bg-blue-700 w-full"
                                >
                                  {actionLoading === editingUser?.id ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <>
                                      <Edit className="w-4 h-4 mr-2" />
                                      تحديث الصلاحيات
                                    </>
                                  )}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveUser(user.id, user.username)}
                            className="border-red-500 text-red-600 bg-red-500/10"
                            disabled={actionLoading === user.id}
                          >
                            {actionLoading === user.id ? (
                              <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
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

          {!loading && adminUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">لا يوجد مستخدمين</h3>
              <p className="text-gray-500">لم يتم إضافة أي مستخدمين إدارة بعد</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersManagement;
