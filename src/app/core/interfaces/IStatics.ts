export interface IStatics {
  counters: number;
  comments: number;
  totalblogs: number;
  lastWeekCounters: number;
  lastTwoWeeksCounters: number;
  mostViewedBlogs: MostViewedBlog[];
  mostViewedCategoriesBlog: MostViewedCategoriesBlog[];
  latestBlogs: LatestBlog[];
  latestContact: LatestContact[];
  mostCommentedBlogs: MostCommentedBlog[];
}

export interface MostViewedBlog {
  id: number;
  post_title: string;
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
}

export interface MostViewedCategoriesBlog {
  category_name: string;
  category_slug: string;
  total_views: string;
}

export interface LatestBlog {
  id: number;
  post_title: string;
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
}

export interface LatestContact {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  created_at: string;
  updated_at: string;
}

export interface MostCommentedBlog {
  id: number;
  post_title: string;
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
  comments_count: number;
}
