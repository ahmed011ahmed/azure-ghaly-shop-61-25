
export interface PubgAccount {
  id: string;
  randomId: string; // الـ ID العشوائي الذي سيظهر للمستخدمين
  image: string;
  description: string;
  video?: string; // رابط فيديو اختياري
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewPubgAccount {
  image: string;
  description: string;
  video?: string; // رابط فيديو اختياري
}
