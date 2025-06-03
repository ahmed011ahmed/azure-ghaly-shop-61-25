
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Star, Package, Loader2, Hash } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import ServiceForm from './ServiceForm';
import { useServices } from '../../contexts/ServicesContext';
import { Service } from '../../types/service';

const ServicesManagement = () => {
  const { services, addService, updateService, deleteService, loading } = useServices();
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const handleAddService = () => {
    setEditingService(null);
    setShowForm(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleDeleteService = async (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الحساب؟')) {
      try {
        setActionLoading(id);
        await deleteService(id);
      } catch (error) {
        console.error('Error deleting service:', error);
        alert('حدث خطأ أثناء حذف الحساب');
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleSaveService = async (serviceData: Omit<Service, 'id' | 'uniqueId'>) => {
    try {
      if (editingService) {
        await updateService(editingService.id, serviceData);
      } else {
        await addService(serviceData);
      }
      setShowForm(false);
      setEditingService(null);
    } catch (error) {
      console.error('Error saving service:', error);
      alert('حدث خطأ أثناء حفظ الحساب');
    }
  };

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.uniqueId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showForm) {
    return (
      <ServiceForm 
        service={editingService} 
        onSave={handleSaveService} 
        onCancel={() => {
          setShowForm(false);
          setEditingService(null);
        }} 
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">إدارة الحسابات</h2>
          <p className="text-gray-300 mt-1">إضافة وتعديل وحذف الحسابات</p>
        </div>
        <Button 
          onClick={handleAddService} 
          className="bg-gaming-gradient hover:shadow-lg hover:shadow-purple-500/25"
          disabled={loading}
        >
          <Plus className="w-4 h-4 mr-2" />
          إضافة حساب جديد
        </Button>
      </div>

      {/* Search */}
      <Card className="gaming-card">
        <CardContent className="pt-6 bg-slate-950">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Label htmlFor="search" className="text-gray-300">البحث في الحسابات</Label>
              <Input 
                id="search"
                placeholder="ابحث باسم الحساب أو الوصف أو الفئة أو المعرف..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1 bg-gray-800/50 border-gray-600 text-white" 
                disabled={loading}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Table */}
      <Card className="gaming-card">
        <CardHeader className="bg-slate-900">
          <CardTitle className="text-slate-50">
            قائمة الحسابات ({loading ? '...' : filteredServices.length})
          </CardTitle>
          <CardDescription className="text-gray-300">
            جميع الحسابات المتاحة في الموقع
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-slate-950">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
              <span className="text-gray-300 mr-3">جاري تحميل الحسابات...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-300">المعرف</TableHead>
                    <TableHead className="text-gray-300">الصورة</TableHead>
                    <TableHead className="text-gray-300">اسم الحساب</TableHead>
                    <TableHead className="text-gray-300">الفئة</TableHead>
                    <TableHead className="text-gray-300">السعر</TableHead>
                    <TableHead className="text-gray-300">التقييم</TableHead>
                    <TableHead className="text-gray-300">الوصف</TableHead>
                    <TableHead className="text-gray-300">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Hash className="w-4 h-4 text-purple-400" />
                          <span className="font-mono text-purple-300 bg-purple-900/20 px-2 py-1 rounded text-sm">
                            {service.uniqueId}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-700">
                          <img 
                            src={service.image} 
                            alt={service.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-white max-w-xs">
                        {service.name}
                      </TableCell>
                      <TableCell>
                        <span className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded-full text-sm">
                          {service.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-pink-400 font-bold">
                        {service.price}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < service.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                            />
                          ))}
                          <span className="text-gray-300 text-sm ml-2">({service.rating})</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300 max-w-md">
                        <div className="truncate">
                          {service.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditService(service)}
                            className="border-blue-500 text-green-200 px-[13px] py-[16px] my-[10px] mx-[12px] bg-[#4bf41f]/10"
                            disabled={actionLoading === service.id}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteService(service.id)}
                            className="border-red-500 font-normal text-red-600 bg-[#e11b1b]/10"
                            disabled={actionLoading === service.id}
                          >
                            {actionLoading === service.id ? (
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

          {!loading && filteredServices.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">لا توجد حسابات</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'لم يتم العثور على حسابات تطابق البحث' : 'لم يتم إضافة أي حسابات بعد'}
              </p>
              {!searchTerm && (
                <Button onClick={handleAddService} className="bg-gaming-gradient">
                  <Plus className="w-4 h-4 mr-2" />
                  إضافة أول حساب
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicesManagement;
