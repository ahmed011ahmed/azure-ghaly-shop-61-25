
export interface Service {
  id: number;
  name: string;
  price: string;
  image: string;
  video?: string; // رابط الفيديو اختياري
  description: string;
  rating: number;
  category: string;
}
