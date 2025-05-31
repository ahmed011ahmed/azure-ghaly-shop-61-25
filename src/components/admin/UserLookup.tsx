
import React, { useState } from 'react';
import { Search, User, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const UserLookup = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [userFound, setUserFound] = useState<any>(null);
  const { toast } = useToast();

  const handleSearchUser = async () => {
    if (!username.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم المستخدم",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      console.log('Searching for user:', username);

      // البحث في جدول profiles عن المستخدم
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('nickname', username.trim())
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error searching user:', error);
        throw error;
      }

      if (profileData) {
        setUserFound(profileData);
        toast({
          title: "تم العثور على المستخدم",
          description: `تم العثور على المستخدم: ${profileData.nickname}`
        });
      } else {
        setUserFound(null);
        toast({
          title: "لم يتم العثور على المستخدم",
          description: "لا يوجد مستخدم بهذا الاسم المستعار",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error in handleSearchUser:', error);
      toast({
        title: "خطأ في البحث",
        description: "فشل في البحث عن المستخدم",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewUserDetails = () => {
    if (userFound) {
      // إعادة تعيين النموذج
      setUsername('');
      setUserFound(null);
      
      toast({
        title: "عرض تفاصيل المستخدم",
        description: `عرض تفاصيل المستخدم: ${userFound.nickname}`
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="gaming-card">
        <CardHeader className="bg-slate-900">
          <CardTitle className="text-xl text-white flex items-center">
            <Search className="w-5 h-5 mr-3 text-purple-400" />
            البحث عن مشترك
          </CardTitle>
          <CardDescription className="text-gray-300">
            أدخل اسم المستخدم للبحث عن مشترك معين
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-slate-950 pt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-gray-300">اسم المستخدم</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="username"
                  type="text"
                  placeholder="أدخل اسم المستخدم..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-800/50 border-gray-600 text-white"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchUser()}
                />
                <Button
                  onClick={handleSearchUser}
                  disabled={loading}
                  className="bg-gaming-gradient hover:shadow-lg hover:shadow-purple-500/25"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {userFound && (
              <div className="mt-6 p-4 bg-gray-800/30 rounded-lg border border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <User className="w-8 h-8 text-green-400" />
                    <div>
                      <h3 className="text-lg font-semibold text-white">{userFound.nickname}</h3>
                      <p className="text-sm text-gray-400">ID: {userFound.id}</p>
                      <p className="text-sm text-gray-400">
                        تاريخ التسجيل: {new Date(userFound.created_at).toLocaleDateString('ar-EG')}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleViewUserDetails}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    عرض التفاصيل
                    <ArrowRight className="w-4 h-4 mr-2" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserLookup;
