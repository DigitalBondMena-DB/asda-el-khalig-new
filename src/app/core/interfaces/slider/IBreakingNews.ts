export interface IAllBreakingNews {
  blogs: IBreakingNewsBlog[];
}

export interface IBreakingNewsBlog {
  id: number;
  post_title: string;
  post_date: string;
  ar_slug: string;
  old_status: string;
  breaking_news_status: number;
}
