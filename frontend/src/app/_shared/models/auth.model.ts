import { User } from "./user.model";

export interface AuthModel {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface UserFormModel {
  username: string;
  password: string;
}
