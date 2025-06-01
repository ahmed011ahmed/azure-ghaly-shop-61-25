
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { NewPubgAccount } from '../../types/pubgAccount';

interface PubgAccountFormProps {
  onSubmit: (account: NewPubgAccount) => void;
  onCancel: () => void;
}

const PubgAccountForm: React.FC<PubgAccountFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<NewPubgAccount>({
    playerName: '',
    playerId: '',
    tier: '',
    kd: 0,
    winRate: 0,
    matches: 0,
    price: 0,
    serverRegion: '',
    accountType: 'main',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // إعادة تعيين النموذج
    setFormData({
      playerName: '',
      playerId: '',
      tier: '',
      kd: 0,
      winRate: 0,
      matches: 0,
      price: 0,
      serverRegion: '',
      accountType: 'main',
      description: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'kd' || name === 'winRate' || name === 'matches' || name === 'price' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  return (
    <Card className="gaming-card max-w-2xl mx-auto">
      <CardHeader className="bg-slate-950">
        <CardTitle className="text-white text-xl">إضافة حساب PUBG جديد</CardTitle>
        <CardDescription className="text-gray-300">
          أدخل تفاصيل حساب PUBG الجديد
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-slate-950 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="playerName" className="text-white">اسم اللاعب</Label>
              <Input
                id="playerName"
                name="playerName"
                value={formData.playerName}
                onChange={handleChange}
                className="bg-gray-800 border-gray-600 text-white"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="playerId" className="text-white">معرف اللاعب</Label>
              <Input
                id="playerId"
                name="playerId"
                value={formData.playerId}
                onChange={handleChange}
                className="bg-gray-800 border-gray-600 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tier" className="text-white">الرتبة</Label>
              <select
                id="tier"
                name="tier"
                value={formData.tier}
                onChange={handleChange}
                className="w-full h-10 px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                required
              >
                <option value="">اختر الرتبة</option>
                <option value="Bronze">برونزي</option>
                <option value="Silver">فضي</option>
                <option value="Gold">ذهبي</option>
                <option value="Platinum">بلاتيني</option>
                <option value="Diamond">ماسي</option>
                <option value="Crown">تاج</option>
                <option value="Ace">آس</option>
                <option value="Conqueror">غازي</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountType" className="text-white">نوع الحساب</Label>
              <select
                id="accountType"
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
                className="w-full h-10 px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                required
              >
                <option value="main">رئيسي</option>
                <option value="smurf">سمرف</option>
                <option value="guest">ضيف</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="kd" className="text-white">نسبة K/D</Label>
              <Input
                id="kd"
                name="kd"
                type="number"
                step="0.01"
                value={formData.kd}
                onChange={handleChange}
                className="bg-gray-800 border-gray-600 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="winRate" className="text-white">نسبة الفوز (%)</Label>
              <Input
                id="winRate"
                name="winRate"
                type="number"
                value={formData.winRate}
                onChange={handleChange}
                className="bg-gray-800 border-gray-600 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="matches" className="text-white">عدد المباريات</Label>
              <Input
                id="matches"
                name="matches"
                type="number"
                value={formData.matches}
                onChange={handleChange}
                className="bg-gray-800 border-gray-600 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-white">السعر ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                className="bg-gray-800 border-gray-600 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serverRegion" className="text-white">المنطقة/السيرفر</Label>
              <Input
                id="serverRegion"
                name="serverRegion"
                value={formData.serverRegion}
                onChange={handleChange}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="مثال: Middle East, Europe"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">الوصف</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full h-20 px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white resize-none"
              placeholder="وصف مختصر عن الحساب..."
            />
          </div>

          <div className="flex space-x-3 justify-end pt-4">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              className="bg-gaming-gradient hover:shadow-lg hover:shadow-purple-500/25"
            >
              إضافة الحساب
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PubgAccountForm;
