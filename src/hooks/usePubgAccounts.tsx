
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { PubgAccount, NewPubgAccount } from '../types/pubgAccount';
import { useToast } from './use-toast';

export const usePubgAccounts = () => {
  const [accounts, setAccounts] = useState<PubgAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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
      const formattedAccounts: PubgAccount[] = (data || []).map((account: any) => {
        // توليد ID ثابت من معرف الحساب في قاعدة البيانات
        const randomId = account.id.replace(/-/g, '').slice(0, 8).toUpperCase();

        return {
          id: account.id,
          randomId: randomId,
          image: account.image,
          description: account.description,
          video: account.video || undefined,
          notes: account.notes || undefined,
          isAvailable: account.is_available,
          createdAt: account.created_at,
          updatedAt: account.updated_at
        };
      });

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
      
      // إرسال البيانات الأساسية
      const accountData: any = {
        image: newAccount.image,
        description: newAccount.description,
        is_available: true
      };

      // إضافة الفيديو فقط إذا كان متوفراً
      if (newAccount.video && newAccount.video.trim()) {
        accountData.video = newAccount.video;
      }

      // إضافة الملاحظات فقط إذا كانت متوفرة
      if (newAccount.notes && newAccount.notes.trim()) {
        accountData.notes = newAccount.notes;
      }

      console.log('البيانات التي سيتم إرسالها:', accountData);

      const { data, error } = await supabase
        .from('pubg_accounts')
        .insert(accountData)
        .select();

      if (error) {
        console.error('خطأ في إضافة حساب PUBG:', error);
        toast({
          title: "خطأ في إضافة الحساب",
          description: "حدث خطأ أثناء إضافة الحساب. حاول مرة أخرى.",
          variant: "destructive",
        });
        throw error;
      }

      console.log('تم إضافة حساب PUBG جديد بنجاح:', data);
      toast({
        title: "تم إضافة الحساب بنجاح",
        description: "تم إضافة حساب PUBG جديد بنجاح.",
      });
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
      
      // تحديث فقط الحقول الموجودة في قاعدة البيانات
      const dbUpdates: any = {};
      if (updates.image !== undefined) dbUpdates.image = updates.image;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.video !== undefined) dbUpdates.video = updates.video;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
      if (updates.isAvailable !== undefined) dbUpdates.is_available = updates.isAvailable;
      dbUpdates.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('pubg_accounts')
        .update(dbUpdates)
        .eq('id', id);

      if (error) {
        console.error('خطأ في تحديث حساب PUBG:', error);
        toast({
          title: "خطأ في تحديث الحساب",
          description: "حدث خطأ أثناء تحديث الحساب. حاول مرة أخرى.",
          variant: "destructive",
        });
        throw error;
      }

      console.log('تم تحديث حساب PUBG:', id);
      toast({
        title: "تم تحديث الحساب بنجاح",
        description: "تم تحديث حساب PUBG بنجاح.",
      });
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
        toast({
          title: "خطأ في حذف الحساب",
          description: "حدث خطأ أثناء حذف الحساب. حاول مرة أخرى.",
          variant: "destructive",
        });
        throw error;
      }

      console.log('تم حذف حساب PUBG:', id);
      toast({
        title: "تم حذف الحساب بنجاح",
        description: "تم حذف حساب PUBG بنجاح.",
      });
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

  return {
    accounts,
    loading,
    addAccount,
    updateAccount,
    deleteAccount,
    toggleAvailability
  };
};
