export interface ISpecificCategory {
  status: string;
  category: Category;
  blogs: IBlogs;
}

export interface Category {
  name: string;
  slug: string;
}

export interface IBlogs {
  current_page: number;
  data: IBlog[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: any;
  to: number;
  total: number;
}

export interface IBlog {
  post_id: number;
  old_status: string;
  post_title: string;
  post_date: string;
  post_content: string;
  post_image: string;
  author_name: string;
}
