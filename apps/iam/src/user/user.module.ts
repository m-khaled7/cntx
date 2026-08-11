import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./user.service.js";
import { UsersController } from "./user.controller.js";
import { User } from "./entites/users.entity.js";
import { UsersRepository } from "./repositories/users.repository.js";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository],
    exports: [UsersService],
})
export class UsersModule {}
