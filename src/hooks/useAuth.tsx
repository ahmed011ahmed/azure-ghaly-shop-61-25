
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  nickname: string;
  unique_id: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch user profile when user logs in
        if (session?.user) {
          setTimeout(async () => {
            try {
              const { data: profileData } = await supabase
                .from('profiles')
                .select('id, nickname, unique_id, created_at, updated_at')
                .eq('id', session.user.id)
                .single();
              
              if (profileData) {
                // إضافة المعرف الفريد من metadata المستخدم إذا لم يكن موجود في الملف الشخصي
                if (!profileData.unique_id && session.user.user_metadata?.unique_id) {
                  // تحديث الملف الشخصي بالمعرف الفريد
                  const { data: updatedProfile } = await supabase
                    .from('profiles')
                    .update({ unique_id: session.user.user_metadata.unique_id })
                    .eq('id', session.user.id)
                    .select('id, nickname, unique_id, created_at, updated_at')
                    .single();
                  
                  setProfile(updatedProfile || { ...profileData, unique_id: session.user.user_metadata.unique_id });
                } else {
                  setProfile(profileData);
                }
              }
            } catch (error) {
              console.error('Error fetching profile:', error);
            }
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      loading,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
