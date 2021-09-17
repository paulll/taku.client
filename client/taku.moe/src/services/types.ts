export interface SignupForm extends LoginForm {
  email: string;
  repeatPassword: string;
}

export interface LoginForm {
  username: string;
  password: string;
}

export interface User {
  email: string;
  password: string;
  _id: string;
  created_at: number;
  username: string;
  profileImage?: string;
  profileBanner?: string;
}

export interface AuthResponse {
  code: string;
  token?: string;
  user?: User;
}
