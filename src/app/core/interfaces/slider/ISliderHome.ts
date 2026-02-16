export interface ISliderHome {
  status: string;
  category: string;
  blogs: Blog[];
}

export interface Blog {
  post_id: number;
  post_title: string;
  post_date: string;
  post_content: string;
  featured_image: string;
  old_status: string;
}
