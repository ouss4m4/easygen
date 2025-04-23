import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';

import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { IUserRepository } from './userRepo.interface';

@Injectable()
export class MongoDBUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: MongoRepository<User>,
  ) {}

  async findOneById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { _id: new ObjectId(id) } });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findAll(options?: { page: number; limit: number }): Promise<User[]> {
    const { page = 1, limit = 10 } = options || {};
    const skip = (page - 1) * limit;
    return this.repository.find({
      skip,
      take: limit,
    });
  }

  async create(data: CreateUserDto): Promise<User> {
    const user = this.repository.create(data);
    return this.repository.save(user);
  }

  async update(id: string, data: UpdateUserDto): Promise<User | null> {
    const user = await this.findOneById(id);
    if (!user) return null;

    Object.assign(user, data);
    return this.repository.save(user);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(new ObjectId(id));
    return (result.affected ?? 0) > 0;
  }
}
