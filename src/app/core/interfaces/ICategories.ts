export interface ICategories {
  status: string;
  data: Daum[];
}

export interface Daum {
  term_id: number;
  name: string;
  slug: string;
  description: string;
}
