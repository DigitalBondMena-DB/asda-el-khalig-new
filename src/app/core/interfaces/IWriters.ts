export interface IWriters {
  rows: IWriter[];
}

export interface IWriter {
  id: number;
  writer_name: string;
  writer_status: number;
  created_at: string;
  updated_at: string;
}

export interface IAddWriterBody {
  writer_name: string;
  writer_status: string;
}

export interface IAddWriterResponse {
  message: string;
  Writer: Writer;
}

export interface Writer {
  writer_name: string;
  writer_status: string;
  updated_at: string;
  created_at: string;
  id: number;
}

export interface IAddWriterResponseError {
  errors: Errors;
}

export interface Errors {
  writer_name: string[];
  writer_status: string[];
}
