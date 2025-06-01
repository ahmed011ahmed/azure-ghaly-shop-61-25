
export interface PubgAccount {
  id: string;
  image: string;
  description: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewPubgAccount {
  image: string;
  description: string;
}
