export interface AuthModel {
  token: string | null;
  username: string | null;
  loading: boolean;
  error: string | null;
}

export interface UserFormModel {
  username: string;
  password: string;
}
