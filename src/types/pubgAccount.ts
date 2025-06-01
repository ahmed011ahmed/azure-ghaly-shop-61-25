
export interface PubgAccount {
  id: string;
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
