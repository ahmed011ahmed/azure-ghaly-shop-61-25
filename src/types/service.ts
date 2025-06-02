
export interface Service {
  id: string; // تغيير من number إلى string للـ ID العشوائي
  name: string;
  price: string;
  image: string;
  video?: string; // رابط الفيديو اختياري
  description: string;
  rating: number;
  category: string;
}
