
export interface PubgAccount {
  id: string;
  playerName: string;
  playerId: string;
  tier: string;
  kd: number;
  winRate: number;
  matches: number;
  price: number;
  serverRegion: string;
  accountType: 'main' | 'smurf' | 'guest';
  isAvailable: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewPubgAccount {
  playerName: string;
  playerId: string;
  tier: string;
  kd: number;
  winRate: number;
  matches: number;
  price: number;
  serverRegion: string;
  accountType: 'main' | 'smurf' | 'guest';
  description: string;
}
