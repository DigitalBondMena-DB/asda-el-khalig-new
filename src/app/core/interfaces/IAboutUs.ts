export interface IAboutUs {
  row: IAboutUsRow;
}

export interface IAboutUsRow {
  id: number;
  about_title: string;
  about_text: string;
  about_image: any;
  about_second_title: string;
  about_second_text: string;
  about_third_title: string;
  about_third_text: string;
  about_fourth_title: string;
  about_fourth_text: string;
  created_at: string;
  updated_at: string;
}
