import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { IUserRepository } from './repository/userRepo.interface';
import { User } from './entities/user.entity';
import { IUser } from 'src/auth/auth.types';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUserRepository')
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

  private toSafeUser(user: User): IUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
