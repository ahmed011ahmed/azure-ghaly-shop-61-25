
import React, { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';

interface PriceFilterProps {
  onPriceChange: (minPrice: number | null, maxPrice: number | null) => void;
}

const PriceFilter = ({ onPriceChange }: PriceFilterProps) => {
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  useEffect(() => {
    const min = minPrice ? parseFloat(minPrice) : null;
    const max = maxPrice ? parseFloat(maxPrice) : null;
    onPriceChange(min, max);
  }, [minPrice, maxPrice, onPriceChange]);

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setMinPrice(value);
    }
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setMaxPrice(value);
    }
  };

  return (
    <Card className="gaming-card mb-6">
      <CardContent className="pt-6 bg-slate-950">
        <div className="space-y-4">
          <Label className="text-white text-lg font-semibold">فلترة حسب السعر</Label>
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Label htmlFor="min-price" className="text-gray-300 text-sm">الحد الأدنى</Label>
              <Input
                id="min-price"
                type="text"
                placeholder="Min"
                value={minPrice}
                onChange={handleMinPriceChange}
                className="mt-1 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="text-gray-400 mt-6">-</div>
            <div className="flex-1">
              <Label htmlFor="max-price" className="text-gray-300 text-sm">الحد الأقصى</Label>
              <Input
                id="max-price"
                type="text"
                placeholder="Max"
                value={maxPrice}
                onChange={handleMaxPriceChange}
                className="mt-1 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
          </div>
          {(minPrice || maxPrice) && (
            <div className="text-sm text-purple-300">
              {minPrice && maxPrice ? 
                `عرض الحسابات من $${minPrice} إلى $${maxPrice}` :
                minPrice ? 
                  `عرض الحسابات من $${minPrice} فأكثر` :
                  `عرض الحسابات حتى $${maxPrice}`
              }
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceFilter;
