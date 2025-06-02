
export interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: 'download' | 'update' | 'giveaway' | 'service' | 'product';
  minimum_level: 1 | 2 | 3 | 4 | 5;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  download_url?: string;
  version?: string;
  file_size?: string;
  price?: string;
  image?: string;
  rating?: number;
}

export interface NewContentItem {
  title: string;
  description: string;
  type: 'download' | 'update' | 'giveaway' | 'service' | 'product';
  minimum_level: 1 | 2 | 3 | 4 | 5;
  download_url?: string;
  version?: string;
  file_size?: string;
  price?: string;
  image?: string;
  rating?: number;
}

export const CONTENT_TYPES = [
  { value: 'download', label: 'رابط تحميل' },
  { value: 'update', label: 'تحديث' },
  { value: 'giveaway', label: 'مسابقة' },
  { value: 'service', label: 'خدمة' },
  { value: 'product', label: 'منتج' }
] as const;
