
import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useLanguage } from '../../contexts/LanguageContext';

interface AdminLoginProps {
  onLogin: (user: any) => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t, language } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // محاكاة تأخير تسجيل الدخول
    setTimeout(() => {
      console.log('Attempting login with:', { username: username.trim(), password: password.trim() });
      
      // التحقق من اليوزر الافتراضي
      if (username.trim() === 'GHALY' && password.trim() === 'Admin Team') {
        const defaultUser = {
          id: 'default',
          username: 'GHALY',
          permissions: [] // صلاحيات كاملة (فارغة تعني الكل)
        };
        console.log('Default user login successful:', defaultUser);
        onLogin(defaultUser);
        setIsLoading(false);
        return;
      }

      // التحقق من المستخدمين المضافين من localStorage
      const storedData = localStorage.getItem('admin_users_data');
      const adminUsers = storedData ? JSON.parse(storedData) : [];
      
      console.log('Checking login for:', username.trim());
      console.log('Available users:', adminUsers);
      
      const validUser = adminUsers.find((user: any) => {
        console.log('Checking user:', user);
        console.log('Username match:', user.username === username.trim());
        console.log('Password match:', user.password === password.trim());
        console.log('Is active:', user.is_active);
        
        // التحقق من البيانات الجديدة التي تحتوي على username و password
        if (user.username && user.password) {
          return user.username === username.trim() && 
                 user.password === password.trim() && 
                 user.is_active;
        }
        
        return false;
      });

      console.log('Found valid user:', validUser);

      if (validUser) {
        // إنشاء كائن المستخدم المسجل للدخول
        const loggedInUser = {
          id: validUser.id,
          username: validUser.username,
          permissions: validUser.permissions || []
        };
        console.log('Login successful for user:', loggedInUser);
        onLogin(loggedInUser);
      } else {
        console.log('Login failed - no matching user found');
        setError('اسم المستخدم أو كلمة المرور غير صحيحة');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 flex items-center justify-center px-4 ${language === 'en' ? 'ltr' : ''}`}>
      <Card className="w-full max-w-md gaming-card">
        <CardHeader className="text-center bg-slate-900">
          <CardTitle className="text-2xl font-bold bg-gaming-gradient bg-clip-text text-transparent">
            تسجيل دخول الإدارة
          </CardTitle>
          <CardDescription className="text-gray-300">
            أدخل بيانات تسجيل الدخول للوصول إلى لوحة التحكم
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 bg-slate-950">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-300 flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>اسم المستخدم</span>
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="أدخل اسم المستخدم..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-800/50 border-gray-600 text-white"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300 flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>كلمة المرور</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="أدخل كلمة المرور..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`bg-gray-800/50 border-gray-600 text-white ${language === 'ar' ? 'pr-12' : 'pl-12'}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute ${language === 'ar' ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200`}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-md p-3">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-gaming-gradient hover:shadow-lg hover:shadow-purple-500/25"
              disabled={isLoading}
            >
              {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </Button>
          </form>

          {/* Hint */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-xs text-gray-500 text-center">
              اسم المستخدم الافتراضي: GHALY | كلمة المرور: Admin Team
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
