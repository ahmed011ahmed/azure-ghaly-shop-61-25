
import { useState, useEffect } from 'react';
import { PubgAccount, NewPubgAccount } from '../types/pubgAccount';

export const usePubgAccounts = () => {
  const [accounts, setAccounts] = useState<PubgAccount[]>([]);
  const [loading, setLoading] = useState(true);

  // بيانات وهمية للاختبار
  const mockAccounts: PubgAccount[] = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
      description: 'حساب محترف مع إحصائيات ممتازة - جاهز للاستخدام الفوري',
      isAvailable: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop',
      description: 'حساب سيرف أوروبي بإحصائيات قوية - مناسب للاعبين المتقدمين',
      isAvailable: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  useEffect(() => {
    // محاكاة تحميل البيانات
    const loadAccounts = () => {
      setLoading(true);
      setTimeout(() => {
        const savedAccounts = localStorage.getItem('pubgAccounts');
        if (savedAccounts) {
          setAccounts(JSON.parse(savedAccounts));
        } else {
          setAccounts(mockAccounts);
          localStorage.setItem('pubgAccounts', JSON.stringify(mockAccounts));
        }
        setLoading(false);
      }, 1000);
    };

    loadAccounts();
  }, []);

  const addAccount = (newAccount: NewPubgAccount): void => {
    const account: PubgAccount = {
      ...newAccount,
      id: Date.now().toString(),
      isAvailable: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedAccounts = [...accounts, account];
    setAccounts(updatedAccounts);
    localStorage.setItem('pubgAccounts', JSON.stringify(updatedAccounts));
    console.log('تم إضافة حساب PUBG جديد:', account);
  };

  const updateAccount = (id: string, updates: Partial<PubgAccount>): void => {
    const updatedAccounts = accounts.map(account =>
      account.id === id
        ? { ...account, ...updates, updatedAt: new Date().toISOString() }
        : account
    );
    setAccounts(updatedAccounts);
    localStorage.setItem('pubgAccounts', JSON.stringify(updatedAccounts));
    console.log('تم تحديث حساب PUBG:', id);
  };

  const deleteAccount = (id: string): void => {
    const updatedAccounts = accounts.filter(account => account.id !== id);
    setAccounts(updatedAccounts);
    localStorage.setItem('pubgAccounts', JSON.stringify(updatedAccounts));
    console.log('تم حذف حساب PUBG:', id);
  };

  const toggleAvailability = (id: string): void => {
    const account = accounts.find(acc => acc.id === id);
    if (account) {
      updateAccount(id, { isAvailable: !account.isAvailable });
    }
  };

  return {
    accounts,
    loading,
    addAccount,
    updateAccount,
    deleteAccount,
    toggleAvailability
  };
};
