export interface ILoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  message: string;
  user: User;
}

export interface User {
  id: number;
  name: string;
  phone: string;
  email: string;
  role: string;
  active_status: number;
  created_at: string;
  updated_at: string;
}

export interface ILogInError {
  error: string;
}
export interface IUserData {
  email: string;
  password: string;
}
