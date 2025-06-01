
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Plus, Edit, Trash2, Eye, EyeOff, Gamepad2, Play, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { usePubgAccounts } from '../../hooks/usePubgAccounts';
import { CATEGORY_LABELS, PubgAccount } from '../../types/pubgAccount';
import PubgAccountForm from './PubgAccountForm';

const PubgAccountsManagement = () => {
  const { accounts, loading, addAccount, updateAccount, deleteAccount, toggleAvailability } = usePubgAccounts();
  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState<PubgAccount['category'] | 'all'>('all');

  const handleDelete = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الحساب؟')) {
      deleteAccount(id);
    }
  };

  const filteredAccounts = filterCategory === 'all' 
    ? accounts 
    : accounts.filter(account => account.category === filterCategory);

  const getCategoryStats = () => {
    const stats = {
      worldwide: accounts.filter(acc => acc.category === 'worldwide').length,
      glitch: accounts.filter(acc => acc.category === 'glitch').length,
      other: accounts.filter(acc => acc.category === 'other').length,
      total: accounts.length,
      available: accounts.filter(acc => acc.isAvailable).length
    };
    return stats;
  };

  const stats = getCategoryStats();

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
          <p className="text-gray-300">إدارة وتتبع جميع حسابات PUBG المتاحة مع التصنيفات والأسعار</p>
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
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
                <p className="text-gray-300 text-sm">عالمية</p>
                <p className="text-2xl font-bold text-blue-400">{stats.worldwide}</p>
              </div>
              <Badge className="bg-blue-900 text-blue-200">عالمية</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="gaming-card">
          <CardContent className="bg-slate-950 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">جلتش</p>
                <p className="text-2xl font-bold text-purple-400">{stats.glitch}</p>
              </div>
              <Badge className="bg-purple-900 text-purple-200">جلتش</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="gaming-card">
          <CardContent className="bg-slate-950 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">إصدارات أخرى</p>
                <p className="text-2xl font-bold text-green-400">{stats.other}</p>
              </div>
              <Badge className="bg-green-900 text-green-200">أخرى</Badge>
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

      {/* فلتر التصنيفات */}
      <Card className="gaming-card">
        <CardContent className="bg-slate-950 p-4">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <Label className="text-gray-300">فلترة حسب التصنيف:</Label>
            <Select value={filterCategory} onValueChange={(value) => setFilterCategory(value as any)}>
              <SelectTrigger className="w-48 bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all" className="text-white hover:bg-gray-700">جميع التصنيفات</SelectItem>
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key} className="text-white hover:bg-gray-700">
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                  <TableHead className="text-gray-300">الصورة</TableHead>
                  <TableHead className="text-gray-300">التصنيف</TableHead>
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
                      <div className="w-20 h-20 rounded-lg overflow-hidden">
                        <img 
                          src={account.image}
                          alt="حساب PUBG"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        account.category === 'worldwide' ? 'bg-blue-900 text-blue-200' :
                        account.category === 'glitch' ? 'bg-purple-900 text-purple-200' :
                        'bg-green-900 text-green-200'
                      }>
                        {CATEGORY_LABELS[account.category]}
                      </Badge>
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
                {filterCategory === 'all' ? 'لا توجد حسابات PUBG حالياً' : `لا توجد حسابات ${CATEGORY_LABELS[filterCategory as keyof typeof CATEGORY_LABELS]} حالياً`}
              </p>
              <p className="text-gray-500">ابدأ بإضافة حساب جديد</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PubgAccountsManagement;
