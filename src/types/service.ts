
export interface Service {
  id: number;
  uniqueId: string; // المعرف الفريد المكون من 6 أرقام وحروف
  name: string;
  price: string;
  image: string;
  video?: string; // رابط الفيديو اختياري
  description: string;
  rating: number;
  category: string;
}
