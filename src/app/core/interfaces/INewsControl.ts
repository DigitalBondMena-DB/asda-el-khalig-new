export interface IGetAllNews {
  rows: IBlog[];
}

export interface IBlog {
  id: number;
  post_title: string;
  post_subtitle: string;
  post_date: string;
  post_content: string;
  post_image: string;
  ar_slug: string;
  meta_title: string;
  breaking_news_status: number;
  meta_description: string;
  publish_status: number;
  draft_status: any;
  blog_counder: any;
  author_name: string;
  created_at: string;
  updated_at: string;
  category: Category[];
  categorynew: Category[];
}

export interface Category {
  id: number;
  category_id: any;
  blog_id: number;
  category_name: string;
  category_slug: string;
  created_at: string;
  updated_at: string;
}

export interface INewsAddBody {
  post_title: string;
  post_subtitle: string;
  post_content: string;
  post_image: File;
  meta_title: string;
  meta_description: string;
  author_name: string;
  categoryIDS: number[]; // Corrected syntax
  post_date: string;
  publish_status: string;
}
export interface INewsAddResponse {
  success: string;
}

export interface IGetOneBlogResponse {
  row: IGetOneBlogResponseRow;
}

export interface IGetOneBlogResponseRow {
  id: number;
  post_title: string;
  post_subtitle: string;
  post_date: string;
  post_content: string;
  post_image: string;
  ar_slug: string;
  meta_title: string;
  meta_description: string;
  publish_status: number;
  draft_status: any;
  blog_counder: number;
  author_name: string;
  created_at: string;
  updated_at: string;
  category: any[];
  categorynew: any[];
}
