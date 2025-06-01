
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
      const { data, error } = await supabase
        .from('pubg_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('خطأ في تحميل حسابات PUBG:', error);
        return;
      }

      // تحويل البيانات للتوافق مع النوع المطلوب
      const formattedAccounts: PubgAccount[] = data.map(account => ({
        id: account.id,
        image: account.image,
        description: account.description,
        video: account.video || undefined, // إضافة دعم للفيديو
        isAvailable: account.is_available,
        createdAt: account.created_at,
        updatedAt: account.updated_at
      }));

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
        () => {
          console.log('تم تحديث بيانات حسابات PUBG');
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
      const accountData: any = {
        image: newAccount.image,
        description: newAccount.description,
        is_available: true
      };

      // إضافة الفيديو فقط إذا كان متوفراً
      if (newAccount.video && newAccount.video.trim()) {
        accountData.video = newAccount.video;
      }

      const { error } = await supabase
        .from('pubg_accounts')
        .insert(accountData);

      if (error) {
        console.error('خطأ في إضافة حساب PUBG:', error);
        throw error;
      }

      console.log('تم إضافة حساب PUBG جديد بنجاح');
    } catch (error) {
      console.error('خطأ في إضافة الحساب:', error);
      throw error;
    }
  };

  const updateAccount = async (id: string, updates: Partial<PubgAccount>): Promise<void> => {
    try {
      // تحويل البيانات للتوافق مع قاعدة البيانات
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
    } catch (error) {
      console.error('خطأ في تحديث الحساب:', error);
      throw error;
    }
  };

  const deleteAccount = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('pubg_accounts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('خطأ في حذف حساب PUBG:', error);
        throw error;
      }

      console.log('تم حذف حساب PUBG:', id);
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

  return {
    accounts,
    loading,
    addAccount,
    updateAccount,
    deleteAccount,
    toggleAvailability
  };
};
