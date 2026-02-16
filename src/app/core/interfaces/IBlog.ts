export interface IBlog {
  status: string;
  blog: Blog;
  comments?: comments[];
}

export interface Blog {
  post_id: number;
  post_title: string;
  post_subtitle: string;
  post_date: string;
  post_content: string;
  post_image: string;
  category_name: string;
  category_slug: string;
  author_name: string;
}

export interface comments {
  id: number;
  blog_id: string;
  blog_title: string;
  comment_name: string;
  comment_email: string;
  comment_text: string;
  comment_status: number;
  comment_date: string;
  comment_time: string;
  created_at: string;
  updated_at: string;
}
