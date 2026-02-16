export interface ICategoriesControl {
  rows: Row[];
}

export interface Row {
  term_id: number;
  name: string;
  slug: string;
  term_group: number;
  active_status: number;
}
