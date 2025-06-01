
export interface PubgAccount {
  id: string;
  randomId: string; // الـ ID العشوائي الذي سيظهر للمستخدمين
  productName: string; // اسم المنتج
  price: number; // السعر
  image: string;
  description: string;
  video?: string; // رابط فيديو اختياري
  rating: number; // التقييم من 1 إلى 5
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewPubgAccount {
  productName: string; // اسم المنتج
  price: number; // السعر
  image: string;
  description: string;
  video?: string; // رابط فيديو اختياري
  rating: number; // التقييم من 1 إلى 5
}
