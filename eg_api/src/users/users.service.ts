import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import {
  IUserRepository,
  IUserRepositoryToken,
} from './repository/userRepo.interface';
import { User } from './entities/user.entity';
import { IUser } from 'src/auth/auth.types';
import { ACCOUNT_LOCK_TIME_MS, MAX_LOGIN_ATTEMPTS } from 'src/auth/constants';

@Injectable()
export class UsersService {
  constructor(
    @Inject(IUserRepositoryToken)
    private readonly usersRepo: IUserRepository,
  ) {}

  /**
   *
   * @param email
   * @returns the User object with the PASSWORD
   */
  async findRawByEmail(email: string): Promise<User | null> {
    return await this.usersRepo.findOneByEmail(email);
  }

  async findById(id: string): Promise<IUser | null> {
    const result = await this.usersRepo.findOneById(id);
    if (!result) return null;

    return this.toSafeUser(result);
  }

  async findAll(): Promise<IUser[]> {
    const users = await this.usersRepo.findAll();
    return users.map((user) => this.toSafeUser(user));
  }

  // Create a new user with hashed password
  async create(createUserDto: CreateUserDto): Promise<IUser> {
    const existingUser = await this.usersRepo.findOneByEmail(
      createUserDto.email,
    );
    if (existingUser) throw new ConflictException('Email already in use');

    const hashedPass = await hash(createUserDto.password, 10);
    const newUser = await this.usersRepo.create({
      ...createUserDto,
      password: hashedPass,
    });
    return this.toSafeUser(newUser);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<IUser | null> {
    const updatedUser = await this.usersRepo.update(id, updateUserDto);
    if (!updatedUser) return null;

    return this.toSafeUser(updatedUser);
  }

  async delete(id: string): Promise<boolean> {
    return this.usersRepo.delete(id);
  }

  async incrementLoginAttempts(userId: string): Promise<void> {
    const user = await this.usersRepo.findOneById(userId);
    if (!user) return;

    const attempts = (user.loginAttempts || 0) + 1;

    if (attempts >= MAX_LOGIN_ATTEMPTS) {
      const lockUntil = new Date(Date.now() + ACCOUNT_LOCK_TIME_MS);
      await this.usersRepo.lockUser(userId, lockUntil);
    } else {
      await this.usersRepo.incrementLoginAttempts(userId);
    }
  }

  async resetLoginAttempts(userId: string): Promise<void> {
    await this.usersRepo.resetLoginAttempts(userId);
  }

  private toSafeUser(user: User): IUser {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
    };
  }
}
