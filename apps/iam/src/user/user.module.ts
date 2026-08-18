import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entites/users.entity.js';
import { UsersRepository } from './repositories/users.repository.js';
import { UsersController } from './user.controller.js';
import { UsersService } from './user.service.js';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository],
    exports: [UsersService],
})
export class UsersModule {}
