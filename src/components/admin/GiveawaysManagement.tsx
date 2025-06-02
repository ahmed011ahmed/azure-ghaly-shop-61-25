
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Plus, Trash2, Eye, EyeOff, Gift, Users, Calendar, Trophy } from 'lucide-react';
import { useGiveaways } from '../../hooks/useGiveaways';
import GiveawayForm from './GiveawayForm';
import { Giveaway } from '../../types/giveaway';

const GiveawaysManagement = () => {
  const { giveaways, loading, addGiveaway, updateGiveaway, deleteGiveaway, toggleActive } = useGiveaways();
  const [showForm, setShowForm] = useState(false);

  const handleDelete = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الـ Giveaway؟')) {
      deleteGiveaway(id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Gift className="w-12 h-12 text-purple-400 animate-pulse mx-auto mb-4" />
          <p className="text-gray-300">جاري تحميل الـ Giveaways...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">إدارة الـ Giveaways</h2>
          <p className="text-gray-300">إدارة وتتبع جميع المسابقات والجوائز</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-gaming-gradient hover:shadow-lg hover:shadow-purple-500/25"
        >
          <Plus className="w-4 h-4 mr-2" />
          إضافة Giveaway جديد
        </Button>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="gaming-card">
          <CardContent className="bg-slate-950 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">إجمالي الـ Giveaways</p>
                <p className="text-2xl font-bold text-white">{giveaways.length}</p>
              </div>
              <Gift className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="gaming-card">
          <CardContent className="bg-slate-950 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">نشط</p>
                <p className="text-2xl font-bold text-green-400">
                  {giveaways.filter(g => g.isActive && !isExpired(g.endDate)).length}
                </p>
              </div>
              <Eye className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="gaming-card">
          <CardContent className="bg-slate-950 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">منتهي الصلاحية</p>
                <p className="text-2xl font-bold text-red-400">
                  {giveaways.filter(g => isExpired(g.endDate)).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="gaming-card">
          <CardContent className="bg-slate-950 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">إجمالي المشاركين</p>
                <p className="text-2xl font-bold text-blue-400">
                  {giveaways.reduce((total, g) => total + g.participantsCount, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* نموذج إضافة/تعديل Giveaway */}
      {showForm && (
        <GiveawayForm
          onSubmit={(giveawayData) => {
            addGiveaway(giveawayData);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* جدول الـ Giveaways */}
      <Card className="gaming-card">
        <CardHeader className="bg-slate-950">
          <CardTitle className="text-white">قائمة الـ Giveaways</CardTitle>
          <CardDescription className="text-gray-300">
            إدارة جميع المسابقات والجوائز في النظام
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-slate-950 p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">الصورة</TableHead>
                  <TableHead className="text-gray-300">العنوان</TableHead>
                  <TableHead className="text-gray-300">الجائزة</TableHead>
                  <TableHead className="text-gray-300">تاريخ الانتهاء</TableHead>
                  <TableHead className="text-gray-300">المشاركين</TableHead>
                  <TableHead className="text-gray-300">الحالة</TableHead>
                  <TableHead className="text-gray-300">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {giveaways.map((giveaway) => (
                  <TableRow key={giveaway.id} className="border-gray-700">
                    <TableCell>
                      <div className="w-16 h-16 rounded-lg overflow-hidden">
                        <img 
                          src={giveaway.image}
                          alt={giveaway.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div>
                        <p className="font-semibold">{giveaway.title}</p>
                        <p className="text-sm text-gray-500 line-clamp-2">{giveaway.description}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex items-center">
                        <Trophy className="w-4 h-4 mr-2 text-yellow-400" />
                        {giveaway.prize}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className={`text-sm ${isExpired(giveaway.endDate) ? 'text-red-400' : 'text-green-400'}`}>
                        {formatDate(giveaway.endDate)}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-blue-400" />
                        {giveaway.participantsCount}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge className={giveaway.isActive ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}>
                          {giveaway.isActive ? 'نشط' : 'غير نشط'}
                        </Badge>
                        {isExpired(giveaway.endDate) && (
                          <Badge className="bg-orange-900 text-orange-200">
                            منتهي الصلاحية
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleActive(giveaway.id)}
                          className="border-gray-600 hover:bg-gray-700"
                        >
                          {giveaway.isActive ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(giveaway.id)}
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
          
          {giveaways.length === 0 && (
            <div className="text-center py-12">
              <Gift className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">لا توجد Giveaways حالياً</p>
              <p className="text-gray-500">ابدأ بإضافة Giveaway جديد</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GiveawaysManagement;
