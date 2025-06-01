
export interface PubgAccount {
  id: string;
  randomId: string; // الـ ID العشوائي الذي سيظهر للمستخدمين
  image: string;
  description: string;
  video?: string; // رابط فيديو اختياري
  category: 'worldwide' | 'glitch' | 'other' | 'arabic' | 'turkey' | 'korea' | 'vietnam' | 'metro' | 'conqueror' | 'ace' | 'crown' | 'diamond'; // التصنيفات الموسعة
  price: number; // السعر
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewPubgAccount {
  image: string;
  description: string;
  video?: string; // رابط فيديو اختياري
  category: 'worldwide' | 'glitch' | 'other' | 'arabic' | 'turkey' | 'korea' | 'vietnam' | 'metro' | 'conqueror' | 'ace' | 'crown' | 'diamond'; // التصنيفات الموسعة
  price: number; // السعر
}

export const CATEGORY_LABELS = {
  worldwide: 'عالمية',
  glitch: 'جلتش',
  other: 'إصدارات أخرى',
  arabic: 'عربية',
  turkey: 'تركية',
  korea: 'كورية',
  vietnam: 'فيتنامية',
  metro: 'مترو رويال',
  conqueror: 'كونكرور',
  ace: 'ايس',
  crown: 'كراون',
  diamond: 'دايموند'
} as const;
