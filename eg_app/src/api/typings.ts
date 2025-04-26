export interface IUser {
  id: string;
  email: string;
  name: string;
}
export interface LoginResponse {
  user: IUser;
  accessToken: string;
  expiresIn: number;
}

export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
}
