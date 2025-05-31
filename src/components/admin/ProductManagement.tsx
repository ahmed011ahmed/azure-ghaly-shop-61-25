import React, { useState } from 'react';
import { Plus, Edit, Trash2, Star, Image, Package } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import ProductForm from './ProductForm';
interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string;
  rating: number;
}
const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([{
    id: 1,
    name: "🎯 Bypass GHALY + HAK RNG",
    price: "$60",
    description: "أداة متقدمة للبايباس والهاكينج - تجربة جيمنج لا تُضاهى مع حماية 100%",
    image: "https://i.imgur.com/ogU7D3c.jpeg",
    rating: 5
  }, {
    id: 2,
    name: "🔥 RNG Tool",
    price: "$35",
    description: "أداة RNG متطورة - امان مضمون 100% مع أداء فائق",
    image: "https://i.imgur.com/SJJK1ZQ.jpeg",
    rating: 4
  }, {
    id: 3,
    name: "⚡ Bypass GHALY+ HAK GHALY",
    price: "$50",
    description: "طريقك المضمون للكونكر - أداة شاملة للجيمرز المحترفين",
    image: "https://i.imgur.com/TzAjRA0.jpeg",
    rating: 5
  }, {
    id: 4,
    name: "🛡️ Bypass GHALY",
    price: "$40",
    description: "بايباس غالي المتخصص - حل مثالي للعبة آمنة ومتقدمة",
    image: "https://i.imgur.com/viiCVaD.jpeg",
    rating: 4
  }]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };
  const handleDeleteProduct = (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      setProducts(products.filter(p => p.id !== id));
      console.log(`Deleted product with id: ${id}`);
    }
  };
  const handleSaveProduct = (productData: Omit<Product, 'id'>) => {
    if (editingProduct) {
      // تعديل منتج موجود
      setProducts(products.map(p => p.id === editingProduct.id ? {
        ...productData,
        id: editingProduct.id
      } : p));
      console.log('Updated product:', productData);
    } else {
      // إضافة منتج جديد
      const newProduct: Product = {
        ...productData,
        id: Math.max(...products.map(p => p.id)) + 1
      };
      setProducts([...products, newProduct]);
      console.log('Added new product:', newProduct);
    }
    setShowForm(false);
    setEditingProduct(null);
  };
  const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.description.toLowerCase().includes(searchTerm.toLowerCase()));
  if (showForm) {
    return <ProductForm product={editingProduct} onSave={handleSaveProduct} onCancel={() => {
      setShowForm(false);
      setEditingProduct(null);
    }} />;
  }
  return <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">إدارة المنتجات</h2>
          <p className="text-gray-300 mt-1">إضافة وتعديل وحذف المنتجات</p>
        </div>
        <Button onClick={handleAddProduct} className="bg-gaming-gradient hover:shadow-lg hover:shadow-purple-500/25">
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
              <Input id="search" placeholder="ابحث باسم المنتج أو الوصف..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="mt-1 bg-gray-800/50 border-gray-600 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="gaming-card">
        <CardHeader className="bg-slate-900">
          <CardTitle className="text-slate-50">قائمة المنتجات ({filteredProducts.length})</CardTitle>
          <CardDescription className="text-gray-300">
            جميع المنتجات المتاحة في المتجر
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-slate-950">
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
                {filteredProducts.map(product => <TableRow key={product.id}>
                    <TableCell>
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-700">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
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
                        {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} />)}
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
                        <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)} className="border-blue-500 text-green-200 px-[13px] py-[16px] my-[10px] mx-[12px] bg-[#4bf41f]/10">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteProduct(product.id)} className="border-red-500 font-normal text-red-600 bg-[#e11b1b]/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>)}
              </TableBody>
            </Table>
          </div>

          {filteredProducts.length === 0 && <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">لا توجد منتجات</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'لم يتم العثور على منتجات تطابق البحث' : 'لم يتم إضافة أي منتجات بعد'}
              </p>
              {!searchTerm && <Button onClick={handleAddProduct} className="bg-gaming-gradient">
                  <Plus className="w-4 h-4 mr-2" />
                  إضافة أول منتج
                </Button>}
            </div>}
        </CardContent>
      </Card>
    </div>;
};
export default ProductManagement;
