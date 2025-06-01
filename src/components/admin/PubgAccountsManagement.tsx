
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Plus, Trash2, Eye, EyeOff, Gamepad2, Play, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { usePubgAccounts } from '../../hooks/usePubgAccounts';
import PubgAccountForm from './PubgAccountForm';

const PubgAccountsManagement = () => {
  const { accounts, loading, addAccount, deleteAccount, toggleAvailability } = usePubgAccounts();
  const [showForm, setShowForm] = useState(false);
  const [searchId, setSearchId] = useState('');

  const handleDelete = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الحساب؟')) {
      deleteAccount(id);
    }
  };

  // فلترة الحسابات حسب البحث بالـ random ID
  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = searchId === '' || account.randomId.toLowerCase().includes(searchId.toLowerCase());
    return matchesSearch;
  });

  const getAccountStats = () => {
    const stats = {
      total: accounts.length,
      available: accounts.filter(acc => acc.isAvailable).length
    };
    return stats;
  };

  const stats = getAccountStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Gamepad2 className="w-12 h-12 text-purple-400 animate-pulse mx-auto mb-4" />
          <p className="text-gray-300">جاري تحميل حسابات PUBG...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">إدارة حسابات PUBG</h2>
          <p className="text-gray-300">إدارة وتتبع جميع حسابات PUBG المتاحة مع الأسعار</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-gaming-gradient hover:shadow-lg hover:shadow-purple-500/25"
        >
          <Plus className="w-4 h-4 mr-2" />
          إضافة حساب جديد
        </Button>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="gaming-card">
          <CardContent className="bg-slate-950 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">إجمالي الحسابات</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <Gamepad2 className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="gaming-card">
          <CardContent className="bg-slate-950 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">متاح للبيع</p>
                <p className="text-2xl font-bold text-green-400">{stats.available}</p>
              </div>
              <Eye className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="gaming-card">
          <CardContent className="bg-slate-950 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">غير متاح</p>
                <p className="text-2xl font-bold text-red-400">{stats.total - stats.available}</p>
              </div>
              <EyeOff className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* نموذج إضافة/تعديل حساب */}
      {showForm && (
        <PubgAccountForm
          onSubmit={(accountData) => {
            addAccount(accountData);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* البحث */}
      <Card className="gaming-card">
        <CardContent className="bg-slate-950 p-4">
          <div className="flex items-center space-x-4">
            <Search className="w-5 h-5 text-gray-400" />
            <Label className="text-gray-300">البحث بـ ID الحساب:</Label>
            <Input
              type="text"
              placeholder="أدخل ID الحساب..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-64 bg-gray-800 border-gray-600 text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* جدول الحسابات */}
      <Card className="gaming-card">
        <CardHeader className="bg-slate-950">
          <CardTitle className="text-white">قائمة حسابات PUBG</CardTitle>
          <CardDescription className="text-gray-300">
            إدارة جميع حسابات PUBG المتاحة في النظام ({filteredAccounts.length} حساب)
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-slate-950 p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">ID الحساب</TableHead>
                  <TableHead className="text-gray-300">الصورة</TableHead>
                  <TableHead className="text-gray-300">السعر</TableHead>
                  <TableHead className="text-gray-300">الوصف</TableHead>
                  <TableHead className="text-gray-300">الفيديو</TableHead>
                  <TableHead className="text-gray-300">الحالة</TableHead>
                  <TableHead className="text-gray-300">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.map((account) => (
                  <TableRow key={account.id} className="border-gray-700">
                    <TableCell>
                      <div className="font-mono text-sm font-bold text-yellow-400 bg-gray-800 p-3 rounded-lg max-w-32 text-center">
                        {account.randomId}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-20 h-20 rounded-lg overflow-hidden">
                        <img 
                          src={account.image}
                          alt="حساب PUBG"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-yellow-400 text-lg">
                        ${account.price}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300 max-w-md">
                      <p className="line-clamp-3">{account.description}</p>
                    </TableCell>
                    <TableCell>
                      {account.video ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
                            >
                              <Play className="w-4 h-4 mr-2" />
                              مشاهدة
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl w-full bg-black border-gray-800">
                            <div className="aspect-video">
                              <video
                                controls
                                className="w-full h-full rounded-lg"
                                src={account.video}
                              >
                                متصفحك لا يدعم تشغيل الفيديو
                              </video>
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <span className="text-gray-500 text-sm">لا يوجد فيديو</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={account.isAvailable ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}>
                        {account.isAvailable ? 'متاح' : 'غير متاح'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleAvailability(account.id)}
                          className="border-gray-600 hover:bg-gray-700"
                        >
                          {account.isAvailable ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(account.id)}
                          className="border-red-600 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredAccounts.length === 0 && (
            <div className="text-center py-12">
              <Gamepad2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">
                {searchId ? `لم يتم العثور على حساب بـ ID: ${searchId}` :
                'لا توجد حسابات PUBG حالياً'}
              </p>
              {!searchId && <p className="text-gray-500">ابدأ بإضافة حساب جديد</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PubgAccountsManagement;
