export interface IEmployee {
  rows: IEmployeeRow[];
}

export interface IEmployeeRow {
  id: number;
  name: string;
  title: string;
  main_image: string;
  day_date: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface IEmployeeAddBody {
  name: string;
  title: string;
  main_image: File;
  status: number;
}
export interface IEmployeeAddResponse {
  success: string;
}

export interface IEmployeeUpdateBody {
  name: string;
  title: string;
}
