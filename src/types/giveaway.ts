
export interface Giveaway {
  id: string;
  title: string;
  description: string;
  image: string;
  prize: string;
  endDate: string;
  isActive: boolean;
  participantsCount: number;
  participationLink?: string; // رابط المشاركة
  createdAt: string;
  updatedAt: string;
}

export interface NewGiveaway {
  title: string;
  description: string;
  image: string;
  prize: string;
  endDate: string;
  participationLink?: string; // رابط المشاركة
}
