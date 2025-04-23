import { Request } from 'express';

// todo: replace with typeorm User model after db implementation
export type IUser = {
  id: string;
  name: string;
  email: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export interface RequestWithUser extends Request {
  user: IUser;
}

export type JwtPayload = {
  sub: string;
  name: string;
  email: string;
};
