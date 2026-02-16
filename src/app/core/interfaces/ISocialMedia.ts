export interface ISocialMedia {
  contact: Contact;
}

export interface Contact {
  id?: number;
  tweet_url?: string;
  snapchat_url?: string;
  instgram_url?: string;
  watus_number?: string;
  face_url?: any;
  youtube_url?: any;
  tiktok_url?: any;
  phone_number?: any;
  location?: any;
  youtube_embedded?: any;
  main_email?: any;
  telegram_url?: any;
  created_at?: string;
  updated_at?: string;
}

export interface IUpdateSocialLinks {
  tweet_url: string | null;
  snapchat_url: string | null;
  instgram_url: string | null;
  watus_number: string | null;
  face_url: string | null;
  youtube_url: string | null;
  youtube_embedded: any;
  tiktok_url: string | null;
  phone_number: string | null;
  location: string | null;
  main_email: string | null;
  telegram_url: string | null;
}

export interface IUpdateSocialLinksResponse {
  success: string;
}
