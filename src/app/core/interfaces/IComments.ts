export interface IComments {
  comments: Comment[];
}

export interface Comment {
  id: number;
  blog_id: number;
  blog_title: string;
  comment_name: string;
  comment_text: string;
  comment_status: number;
  comment_date: string;
  comment_time: any;
  created_at: string;
  updated_at: string;
}
