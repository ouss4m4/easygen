import { Injectable } from '@nestjs/common';
import { IUser } from 'src/auth/auth.types';

// This should be a real class/interface representing a user entity

@Injectable()
export class UsersService {
  private readonly users: IUser[] = [
    {
      userId: 1,
      username: 'john',
      email: 'john@gmail.com',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      email: 'maria@gmail.com',
      password: 'guess',
    },
  ];

  async findOne(email: string): Promise<IUser | null> {
    await new Promise((res) => setTimeout(res, 1000));
    return this.users.find((user) => user.email === email) ?? null;
  }
}
