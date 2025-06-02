
import React, { useState } from 'react';
import { Crown, Users, Star, Diamond, Shield, Settings, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useSubscribers } from '../../hooks/useSubscribers';
import { SUBSCRIPTION_LEVELS } from '../../types/subscriber';

const SubscriberLevelsManagement = () => {
  const { subscribers, loading } = useSubscribers();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const getLevelIcon = (level: number) => {
    switch (level) {
      case 1: return User;
      case 2: return Shield;
      case 3: return Star;
      case 4: return Diamond;
      case 5: return Crown;
      default: return User;
    }
  };

  const getLevelStats = () => {
    return SUBSCRIPTION_LEVELS.map(level => ({
      ...level,
      count: subscribers.filter(s => s.subscription_level === level.level).length
    }));
  };

  const getFilteredSubscribers = () => {
    if (selectedLevel === null) return subscribers;
    return subscribers.filter(s => s.subscription_level === selectedLevel);
  };

  const levelStats = getLevelStats();
  const filteredSubscribers = getFilteredSubscribers();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">إدارة مستويات الاشتراك</h2>
          <p className="text-gray-300 mt-1">عرض وإدارة المشتركين حسب المستوى</p>
        </div>
      </div>

      {/* Level Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {levelStats.map((level) => {
          const IconComponent = getLevelIcon(level.level);
          return (
            <Card 
              key={level.level} 
              className={`gaming-card cursor-pointer transition-all duration-200 ${
                selectedLevel === level.level 
                  ? 'ring-2 ring-purple-400 shadow-lg shadow-purple-500/25' 
                  : 'hover:shadow-lg hover:shadow-purple-500/10'
              }`}
              onClick={() => setSelectedLevel(selectedLevel === level.level ? null : level.level)}
            >
              <CardContent className="pt-6 bg-slate-950">
                <div className="text-center space-y-2">
                  <IconComponent className={`w-8 h-8 mx-auto ${level.color}`} />
                  <h3 className={`font-bold text-lg ${level.color}`}>
                    المستوى {level.level}
                  </h3>
                  <p className="text-sm text-gray-400">{level.name}</p>
                  <div className="text-2xl font-bold text-white">{level.count}</div>
                  <p className="text-xs text-gray-500">مشترك</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Active Filter */}
      {selectedLevel !== null && (
        <Card className="gaming-card">
          <CardContent className="pt-4 bg-slate-950">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge className={`${SUBSCRIPTION_LEVELS[selectedLevel - 1].color} border-current`}>
                  المستوى {selectedLevel} - {SUBSCRIPTION_LEVELS[selectedLevel - 1].name}
                </Badge>
                <span className="text-gray-300">
                  ({filteredSubscribers.length} مشترك)
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedLevel(null)}
                className="border-gray-600 text-gray-300"
              >
                إظهار الكل
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subscribers List */}
      <Card className="gaming-card">
        <CardHeader className="bg-slate-900">
          <CardTitle className="text-slate-50 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            قائمة المشتركين {selectedLevel ? `- المستوى ${selectedLevel}` : ''}
            <span className="text-purple-400 mr-2">({filteredSubscribers.length})</span>
          </CardTitle>
          <CardDescription className="text-gray-300">
            {selectedLevel 
              ? `المشتركين في المستوى ${selectedLevel} - ${SUBSCRIPTION_LEVELS[selectedLevel - 1].name}`
              : 'جميع المشتركين مع مستوياتهم'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-slate-950">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-300">جاري التحميل...</div>
            </div>
          ) : filteredSubscribers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">لا توجد مشتركين</h3>
              <p className="text-gray-500">
                {selectedLevel 
                  ? `لا توجد مشتركين في المستوى ${selectedLevel}`
                  : 'لم يتم تسجيل أي مشتركين بعد'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSubscribers.map((subscriber) => {
                const level = SUBSCRIPTION_LEVELS[subscriber.subscription_level - 1];
                const IconComponent = getLevelIcon(subscriber.subscription_level);
                
                return (
                  <div 
                    key={subscriber.id} 
                    className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                  >
                    <div className="flex items-center space-x-4">
                      <IconComponent className={`w-6 h-6 ${level.color}`} />
                      <div>
                        <div className="text-white font-medium">{subscriber.nickname}</div>
                        <div className="text-gray-400 text-sm">{subscriber.email}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Badge className={`${level.color} border-current`}>
                        المستوى {subscriber.subscription_level} - {level.name}
                      </Badge>
                      
                      <Badge variant={subscriber.subscription_status === 'active' ? 'default' : 'secondary'}>
                        {subscriber.subscription_status === 'active' ? 'نشط' : 
                         subscriber.subscription_status === 'inactive' ? 'غير نشط' : 'في الانتظار'}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriberLevelsManagement;
