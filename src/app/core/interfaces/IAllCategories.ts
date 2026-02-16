export interface IAllBlogsResponse {
  status: string;
  data: categories[];
}

export interface categories {
  term_id: number;
  name: string;
  slug: string;
  term_group: number;
  active_status: number;
  imagedate: Imagedate | null;
}

export interface Imagedate {
  id: number;
  category_id: string;
  category_image: string;
  created_at: string;
  updated_at: string;
}
