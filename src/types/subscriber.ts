
export interface Subscriber {
  id?: string;
  email: string;
  nickname: string;
  subscription_status: 'active' | 'inactive' | 'pending';
  subscription_level: 1 | 2 | 3 | 4 | 5; // 1=برونزي, 2=فضي, 3=ذهبي, 4=بلاتيني, 5=ماسي
  subscription_date?: string;
  last_login?: string;
  duration_days?: number; // المدة بالأيام
  expires_at?: string; // تاريخ انتهاء الاشتراك
}

export interface NewSubscriber {
  email: string;
  nickname: string;
  subscription_level: 1 | 2 | 3 | 4 | 5;
  duration_days: number; // المدة بالأيام
}

export interface SubscriberLevel {
  level: number;
  name: string;
  color: string;
  description: string;
}

export const SUBSCRIPTION_LEVELS: SubscriberLevel[] = [
  {
    level: 1,
    name: 'برونزي',
    color: 'text-orange-600',
    description: 'المستوى الأساسي'
  },
  {
    level: 2,
    name: 'فضي',
    color: 'text-gray-400',
    description: 'مستوى متوسط'
  },
  {
    level: 3,
    name: 'ذهبي',
    color: 'text-yellow-500',
    description: 'مستوى متقدم'
  },
  {
    level: 4,
    name: 'بلاتيني',
    color: 'text-slate-300',
    description: 'مستوى احترافي'
  },
  {
    level: 5,
    name: 'ماسي',
    color: 'text-purple-400',
    description: 'المستوى الأعلى'
  }
];
