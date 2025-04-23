import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRepository } from './repository/user.repo';
import { UsersController } from './users.controller';
import { IUserRepositoryToken } from './repository/userRepo.interface';

@Module({
  providers: [
    UsersService,
    {
      provide: IUserRepositoryToken,
      useClass: UserRepository,
    },
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
