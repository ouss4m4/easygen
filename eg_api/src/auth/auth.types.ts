import { Request } from 'express';

// todo: replace with typeorm User model after db implementation
export type IUser = {
  userId: number;
  username: string;
  email: string;
  password: string;
};

// same as user without password. (passed as req.user by localstrategy)
export type ILoggedUser = Omit<IUser, 'password'>;

export interface ILoginResponse {
  username: string;
  jwt: string;
}

export interface RequestWithUser extends Request {
  user: ILoggedUser;
}
