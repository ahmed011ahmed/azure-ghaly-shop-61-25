
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Giveaway, NewGiveaway } from '../types/giveaway';

export const useGiveaways = () => {
  const [giveaways, setGiveaways] = useState<Giveaway[]>([]);
  const [loading, setLoading] = useState(true);

  // تحميل البيانات من Supabase
  const loadGiveaways = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('giveaways')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('خطأ في تحميل الـ Giveaways:', error);
        return;
      }

      // تحويل البيانات للتوافق مع النوع المطلوب
      const formattedGiveaways: Giveaway[] = data?.map((giveaway: any) => ({
        id: giveaway.id,
        title: giveaway.title,
        description: giveaway.description,
        image: giveaway.image,
        prize: giveaway.prize,
        endDate: giveaway.end_date,
        isActive: giveaway.is_active,
        participantsCount: giveaway.participants_count || 0,
        participationLink: giveaway.participation_link,
        createdAt: giveaway.created_at,
        updatedAt: giveaway.updated_at
      })) || [];

      setGiveaways(formattedGiveaways);
    } catch (error) {
      console.error('خطأ في تحميل البيانات:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGiveaways();

    // إعداد Real-time subscription
    const channel = supabase
      .channel('giveaways_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'giveaways'
        },
        () => {
          console.log('تم تحديث بيانات الـ Giveaways');
          loadGiveaways();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addGiveaway = async (newGiveaway: NewGiveaway): Promise<void> => {
    try {
      console.log('Adding giveaway with data:', newGiveaway);
      
      const { error } = await supabase
        .from('giveaways')
        .insert({
          title: newGiveaway.title,
          description: newGiveaway.description,
          image: newGiveaway.image,
          prize: newGiveaway.prize,
          end_date: newGiveaway.endDate,
          participation_link: newGiveaway.participationLink || null,
          is_active: true,
          participants_count: 0
        });

      if (error) {
        console.error('خطأ في إضافة Giveaway:', error);
        throw error;
      }

      console.log('تم إضافة Giveaway جديد بنجاح');
    } catch (error) {
      console.error('خطأ في إضافة الـ Giveaway:', error);
      throw error;
    }
  };

  const updateGiveaway = async (id: string, updates: Partial<Giveaway>): Promise<void> => {
    try {
      const dbUpdates: any = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.image !== undefined) dbUpdates.image = updates.image;
      if (updates.prize !== undefined) dbUpdates.prize = updates.prize;
      if (updates.endDate !== undefined) dbUpdates.end_date = updates.endDate;
      if (updates.participationLink !== undefined) dbUpdates.participation_link = updates.participationLink;
      if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
      if (updates.participantsCount !== undefined) dbUpdates.participants_count = updates.participantsCount;
      dbUpdates.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('giveaways')
        .update(dbUpdates)
        .eq('id', id);

      if (error) {
        console.error('خطأ في تحديث Giveaway:', error);
        throw error;
      }

      console.log('تم تحديث Giveaway:', id);
    } catch (error) {
      console.error('خطأ في تحديث الـ Giveaway:', error);
      throw error;
    }
  };

  const deleteGiveaway = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('giveaways')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('خطأ في حذف Giveaway:', error);
        throw error;
      }

      console.log('تم حذف Giveaway:', id);
    } catch (error) {
      console.error('خطأ في حذف الـ Giveaway:', error);
      throw error;
    }
  };

  const toggleActive = async (id: string): Promise<void> => {
    const giveaway = giveaways.find(g => g.id === id);
    if (giveaway) {
      await updateGiveaway(id, { isActive: !giveaway.isActive });
    }
  };

  return {
    giveaways,
    loading,
    addGiveaway,
    updateGiveaway,
    deleteGiveaway,
    toggleActive
  };
};
