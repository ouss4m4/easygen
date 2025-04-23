/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';

import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { IUserRepository } from './userRepo.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  private users: User[] = [];
  private idCounter = 1;

  async findOneById(id: string): Promise<User | null> {
    return this.users.find((u) => u.id === id) ?? null;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.users.find((u) => u.email === email) ?? null;
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async create(data: CreateUserDto): Promise<User> {
    const newUser: User = {
      id: (this.idCounter++).toString(),
      ...data,
    };
    this.users.push(newUser);
    return newUser;
  }

  async update(id: string, data: UpdateUserDto): Promise<User | null> {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) return null;

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...data,
    };
    return this.users[userIndex];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }
}
