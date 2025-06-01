
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { PubgAccount, NewPubgAccount } from '../types/pubgAccount';

export const usePubgAccounts = () => {
  const [accounts, setAccounts] = useState<PubgAccount[]>([]);
  const [loading, setLoading] = useState(true);

  // تحميل البيانات من Supabase
  const loadAccounts = async () => {
    try {
      setLoading(true);
      console.log('جاري تحميل حسابات PUBG...');
      
      const { data, error } = await supabase
        .from('pubg_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('خطأ في تحميل حسابات PUBG:', error);
        return;
      }

      console.log('البيانات المحملة من قاعدة البيانات:', data);

      // تحويل البيانات للتوافق مع النوع المطلوب
      const formattedAccounts: PubgAccount[] = (data || []).map(account => ({
        id: account.id,
        image: account.image,
        description: account.description,
        video: account.video || undefined,
        category: 'other' as const, // قيمة افتراضية مؤقتة
        price: 0, // قيمة افتراضية مؤقتة
        isAvailable: account.is_available,
        createdAt: account.created_at,
        updatedAt: account.updated_at
      }));

      console.log('الحسابات بعد التنسيق:', formattedAccounts);
      setAccounts(formattedAccounts);
    } catch (error) {
      console.error('خطأ في تحميل البيانات:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();

    // إعداد Real-time subscription
    const channel = supabase
      .channel('pubg_accounts_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pubg_accounts'
        },
        (payload) => {
          console.log('تم تحديث بيانات حسابات PUBG:', payload);
          loadAccounts(); // إعادة تحميل البيانات عند حدوث تغيير
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addAccount = async (newAccount: NewPubgAccount): Promise<void> => {
    try {
      console.log('محاولة إضافة حساب جديد:', newAccount);
      
      // إرسال البيانات الأساسية فقط (بدون category و price مؤقتاً)
      const accountData: any = {
        image: newAccount.image,
        description: newAccount.description,
        is_available: true
      };

      // إضافة الفيديو فقط إذا كان متوفراً
      if (newAccount.video && newAccount.video.trim()) {
        accountData.video = newAccount.video;
      }

      console.log('البيانات التي سيتم إرسالها:', accountData);

      const { data, error } = await supabase
        .from('pubg_accounts')
        .insert(accountData)
        .select();

      if (error) {
        console.error('خطأ في إضافة حساب PUBG:', error);
        throw error;
      }

      console.log('تم إضافة حساب PUBG جديد بنجاح:', data);
      // إعادة تحميل البيانات بعد الإضافة
      await loadAccounts();
    } catch (error) {
      console.error('خطأ في إضافة الحساب:', error);
      throw error;
    }
  };

  const updateAccount = async (id: string, updates: Partial<PubgAccount>): Promise<void> => {
    try {
      console.log('محاولة تحديث الحساب:', id, updates);
      
      // تحويل البيانات للتوافق مع قاعدة البيانات (بدون category و price مؤقتاً)
      const dbUpdates: any = {};
      if (updates.image !== undefined) dbUpdates.image = updates.image;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.video !== undefined) dbUpdates.video = updates.video;
      if (updates.isAvailable !== undefined) dbUpdates.is_available = updates.isAvailable;
      dbUpdates.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('pubg_accounts')
        .update(dbUpdates)
        .eq('id', id);

      if (error) {
        console.error('خطأ في تحديث حساب PUBG:', error);
        throw error;
      }

      console.log('تم تحديث حساب PUBG:', id);
      // إعادة تحميل البيانات بعد التحديث
      await loadAccounts();
    } catch (error) {
      console.error('خطأ في تحديث الحساب:', error);
      throw error;
    }
  };

  const deleteAccount = async (id: string): Promise<void> => {
    try {
      console.log('محاولة حذف الحساب:', id);
      
      const { error } = await supabase
        .from('pubg_accounts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('خطأ في حذف حساب PUBG:', error);
        throw error;
      }

      console.log('تم حذف حساب PUBG:', id);
      // إعادة تحميل البيانات بعد الحذف
      await loadAccounts();
    } catch (error) {
      console.error('خطأ في حذف الحساب:', error);
      throw error;
    }
  };

  const toggleAvailability = async (id: string): Promise<void> => {
    const account = accounts.find(acc => acc.id === id);
    if (account) {
      await updateAccount(id, { isAvailable: !account.isAvailable });
    }
  };

  // فلترة الحسابات حسب التصنيف (مؤقتاً ترجع جميع الحسابات)
  const getAccountsByCategory = (category: PubgAccount['category']) => {
    return accounts.filter(account => account.isAvailable);
  };

  return {
    accounts,
    loading,
    addAccount,
    updateAccount,
    deleteAccount,
    toggleAvailability,
    getAccountsByCategory
  };
};
