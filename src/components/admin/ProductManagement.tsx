
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Star, Package, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import ProductForm from './ProductForm';
import { useProducts, Product } from '../../contexts/ProductsContext';

const ProductManagement = () => {
  const { products, addProduct, updateProduct, deleteProduct, loading } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      try {
        setActionLoading(id);
        await deleteProduct(id);
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('حدث خطأ أثناء حذف المنتج');
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleSaveProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await addProduct(productData);
      }
      setShowForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('حدث خطأ أثناء حفظ المنتج');
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showForm) {
    return (
      <ProductForm 
        product={editingProduct} 
        onSave={handleSaveProduct} 
        onCancel={() => {
          setShowForm(false);
          setEditingProduct(null);
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
          <p className="text-gray-300 mt-1">إضافة وتعديل وحذف المنتجات</p>
        </div>
        <Button 
          onClick={handleAddProduct} 
          className="bg-gaming-gradient hover:shadow-lg hover:shadow-purple-500/25"
          disabled={loading}
        >
          <Plus className="w-4 h-4 mr-2" />
          إضافة منتج جديد
        </Button>
      </div>

      {/* Search */}
      <Card className="gaming-card">
        <CardContent className="pt-6 bg-slate-950">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Label htmlFor="search" className="text-gray-300">البحث في المنتجات</Label>
              <Input 
                id="search"
                placeholder="ابحث باسم المنتج أو الوصف..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1 bg-gray-800/50 border-gray-600 text-white" 
                disabled={loading}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="gaming-card">
        <CardHeader className="bg-slate-900">
          <CardTitle className="text-slate-50">
            قائمة المنتجات ({loading ? '...' : filteredProducts.length})
          </CardTitle>
          <CardDescription className="text-gray-300">
            جميع المنتجات المتاحة في المتجر
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-slate-950">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
              <span className="text-gray-300 mr-3">جاري تحميل المنتجات...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-300">الصورة</TableHead>
                    <TableHead className="text-gray-300">اسم المنتج</TableHead>
                    <TableHead className="text-gray-300">السعر</TableHead>
                    <TableHead className="text-gray-300">التقييم</TableHead>
                    <TableHead className="text-gray-300">الوصف</TableHead>
                    <TableHead className="text-gray-300">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-700">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-white max-w-xs">
                        {product.name}
                      </TableCell>
                      <TableCell className="text-pink-400 font-bold">
                        {product.price}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                            />
                          ))}
                          <span className="text-gray-300 text-sm ml-2">({product.rating})</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300 max-w-md">
                        <div className="truncate">
                          {product.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditProduct(product)}
                            className="border-blue-500 text-green-200 px-[13px] py-[16px] my-[10px] mx-[12px] bg-[#4bf41f]/10"
                            disabled={actionLoading === product.id}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="border-red-500 font-normal text-red-600 bg-[#e11b1b]/10"
                            disabled={actionLoading === product.id}
                          >
                            {actionLoading === product.id ? (
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

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">لا توجد منتجات</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'لم يتم العثور على منتجات تطابق البحث' : 'لم يتم إضافة أي منتجات بعد'}
              </p>
              {!searchTerm && (
                <Button onClick={handleAddProduct} className="bg-gaming-gradient">
                  <Plus className="w-4 h-4 mr-2" />
                  إضافة أول منتج
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductManagement;
