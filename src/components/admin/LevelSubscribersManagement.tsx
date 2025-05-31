
import React, { useState } from 'react';
import { Users, UserCheck, UserX, Clock, Trash2, Search, Loader2, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { useSubscribers } from '../../hooks/useSubscribers';
import { useLevelContent } from '../../hooks/useLevelContent';
import AddSubscriberForm from './AddSubscriberForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

const LevelSubscribersManagement = () => {
  const [activeLevel, setActiveLevel] = useState<number>(1);
  const { subscribers, loading, addSubscriber, updateSubscriptionStatus, updateSubscriptionLevel, deleteSubscriber } = useSubscribers(activeLevel);
  const { getLevelName, getLevelColor } = useLevelContent();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: 'active' | 'inactive' | 'pending') => {
    try {
      setActionLoading(id);
      await updateSubscriptionStatus(id, newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleLevelChange = async (id: string, newLevel: 1 | 2 | 3 | 4 | 5) => {
    try {
      setActionLoading(id);
      await updateSubscriptionLevel(id, newLevel);
    } catch (error) {
      console.error('Error updating level:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المشترك؟')) {
      try {
        setActionLoading(id);
        await deleteSubscriber(id);
      } catch (error) {
        console.error('Error deleting subscriber:', error);
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleAddSubscriber = async (newSubscriber: {
    email: string;
    nickname: string;
    subscription_level: 1 | 2 | 3 | 4 | 5;
  }) => {
    await addSubscriber({
      ...newSubscriber,
      subscription_level: activeLevel as 1 | 2 | 3 | 4 | 5
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">نشط</Badge>;
      case 'inactive':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">غير نشط</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">في الانتظار</Badge>;
      default:
        return <Badge variant="outline">غير محدد</Badge>;
    }
  };

  const getLevelBadge = (level: number) => {
    return (
      <Badge className={`${getLevelColor(level)} bg-opacity-20 border-opacity-30`}>
        <Star className="w-3 h-3 mr-1" />
        {getLevelName(level)}
      </Badge>
    );
  };

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = 
      subscriber.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.nickname?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || subscriber.subscription_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: subscribers.length,
    active: subscribers.filter(s => s.subscription_status === 'active').length,
    inactive: subscribers.filter(s => s.subscription_status === 'inactive').length,
    pending: subscribers.filter(s => s.subscription_status === 'pending').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">إدارة المشتركين حسب المستوى</h2>
          <p className="text-gray-300 mt-1">إدارة وعرض قائمة المشتركين لكل مستوى بشكل منفصل</p>
        </div>
      </div>

      {/* Level Tabs */}
      <Tabs value={activeLevel.toString()} onValueChange={(value) => setActiveLevel(parseInt(value))}>
        <TabsList className="grid w-full grid-cols-5 bg-gray-800/50">
          {[1, 2, 3, 4, 5].map(level => (
            <TabsTrigger 
              key={level} 
              value={level.toString()}
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Star className="w-4 h-4 mr-1" />
              {getLevelName(level)}
            </TabsTrigger>
          ))}
        </TabsList>

        {[1, 2, 3, 4, 5].map(level => (
          <TabsContent key={level} value={level.toString()} className="space-y-6">
            {/* Add Subscriber Form for current level */}
            <AddSubscriberForm onAdd={handleAddSubscriber} defaultLevel={level} />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="gaming-card">
                <CardContent className="pt-6 bg-slate-950">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">إجمالي المشتركين</p>
                      <p className="text-2xl font-bold text-white">{stats.total}</p>
                    </div>
                    <Users className="w-8 h-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="gaming-card">
                <CardContent className="pt-6 bg-slate-950">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">نشط</p>
                      <p className="text-2xl font-bold text-green-400">{stats.active}</p>
                    </div>
                    <UserCheck className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="gaming-card">
                <CardContent className="pt-6 bg-slate-950">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">غير نشط</p>
                      <p className="text-2xl font-bold text-red-400">{stats.inactive}</p>
                    </div>
                    <UserX className="w-8 h-8 text-red-400" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="gaming-card">
                <CardContent className="pt-6 bg-slate-950">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">في الانتظار</p>
                      <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="gaming-card">
              <CardContent className="pt-6 bg-slate-950">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="search" className="text-gray-300">البحث</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input 
                        id="search"
                        placeholder="البحث بالإيميل أو الاسم المستعار..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mt-1 bg-gray-800/50 border-gray-600 text-white pl-10" 
                      />
                    </div>
                  </div>
                  
                  <div className="sm:w-48">
                    <Label className="text-gray-300">تصفية بالحالة</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="mt-1 bg-gray-800/50 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الحالات</SelectItem>
                        <SelectItem value="active">نشط</SelectItem>
                        <SelectItem value="inactive">غير نشط</SelectItem>
                        <SelectItem value="pending">في الانتظار</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subscribers Table */}
            <Card className="gaming-card">
              <CardHeader className="bg-slate-900">
                <CardTitle className="text-slate-50 flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  مشتركين {getLevelName(level)} ({loading ? '...' : filteredSubscribers.length})
                </CardTitle>
                <CardDescription className="text-gray-300">
                  جميع المشتركين في مستوى {getLevelName(level)}
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-slate-950">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                    <span className="text-gray-300 mr-3">جاري تحميل المشتركين...</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-gray-300">الإيميل</TableHead>
                          <TableHead className="text-gray-300">الاسم المستعار</TableHead>
                          <TableHead className="text-gray-300">حالة الاشتراك</TableHead>
                          <TableHead className="text-gray-300">المستوى</TableHead>
                          <TableHead className="text-gray-300">تاريخ الاشتراك</TableHead>
                          <TableHead className="text-gray-300">آخر دخول</TableHead>
                          <TableHead className="text-gray-300">الإجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSubscribers.map((subscriber) => (
                          <TableRow key={subscriber.id}>
                            <TableCell className="font-medium text-white">
                              {subscriber.email}
                            </TableCell>
                            <TableCell className="text-gray-300">
                              {subscriber.nickname || 'غير محدد'}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(subscriber.subscription_status)}
                            </TableCell>
                            <TableCell>
                              {getLevelBadge(subscriber.subscription_level)}
                            </TableCell>
                            <TableCell className="text-gray-300">
                              {subscriber.subscription_date 
                                ? new Date(subscriber.subscription_date).toLocaleDateString('ar-EG')
                                : 'غير محدد'
                              }
                            </TableCell>
                            <TableCell className="text-gray-300">
                              {subscriber.last_login 
                                ? new Date(subscriber.last_login).toLocaleDateString('ar-EG')
                                : 'لم يسجل دخول'
                              }
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Select 
                                  value={subscriber.subscription_status}
                                  onValueChange={(value: 'active' | 'inactive' | 'pending') => 
                                    handleStatusChange(subscriber.id!, value)
                                  }
                                  disabled={actionLoading === subscriber.id}
                                >
                                  <SelectTrigger className="w-32 bg-gray-800/50 border-gray-600 text-white">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="active">نشط</SelectItem>
                                    <SelectItem value="inactive">غير نشط</SelectItem>
                                    <SelectItem value="pending">في الانتظار</SelectItem>
                                  </SelectContent>
                                </Select>

                                <Select 
                                  value={subscriber.subscription_level.toString()}
                                  onValueChange={(value: string) => 
                                    handleLevelChange(subscriber.id!, parseInt(value) as 1 | 2 | 3 | 4 | 5)
                                  }
                                  disabled={actionLoading === subscriber.id}
                                >
                                  <SelectTrigger className="w-28 bg-gray-800/50 border-gray-600 text-white">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1">مستوى 1</SelectItem>
                                    <SelectItem value="2">مستوى 2</SelectItem>
                                    <SelectItem value="3">مستوى 3</SelectItem>
                                    <SelectItem value="4">مستوى 4</SelectItem>
                                    <SelectItem value="5">مستوى 5</SelectItem>
                                  </SelectContent>
                                </Select>
                                
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleDeleteSubscriber(subscriber.id!)}
                                  className="border-red-500 text-red-600 bg-red-500/10"
                                  disabled={actionLoading === subscriber.id}
                                >
                                  {actionLoading === subscriber.id ? (
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

                {!loading && filteredSubscribers.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-300 mb-2">لا توجد مشتركين</h3>
                    <p className="text-gray-500">
                      {searchTerm || statusFilter !== 'all'
                        ? 'لم يتم العثور على مشتركين يطابقون معايير البحث' 
                        : `لم يتم تسجيل أي مشتركين في ${getLevelName(level)} بعد`
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default LevelSubscribersManagement;
