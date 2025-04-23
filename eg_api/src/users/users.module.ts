import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { MongoDBUserRepository } from './repository/mongodb.repository';
import { UsersController } from './users.controller';
import { IUserRepositoryToken } from './repository/userRepo.interface';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UsersService,
    {
      provide: IUserRepositoryToken,
      useClass: MongoDBUserRepository,
    },
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
