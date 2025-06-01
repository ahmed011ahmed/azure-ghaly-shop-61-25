
export interface PubgAccount {
  id: string;
  randomId: string; // الـ ID العشوائي الذي سيظهر للمستخدمين
  image: string;
  description: string;
  video?: string; // رابط فيديو اختياري
  category: 'worldwide' | 'glitch' | 'other'; // التصنيف
  price: number; // السعر
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewPubgAccount {
  image: string;
  description: string;
  video?: string; // رابط فيديو اختياري
  category: 'worldwide' | 'glitch' | 'other'; // التصنيف
  price: number; // السعر
}

export const CATEGORY_LABELS = {
  worldwide: 'عالمية',
  glitch: 'جلتش',
  other: 'إصدارات أخرى'
} as const;
