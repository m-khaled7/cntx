import { Injectable } from '@nestjs/common';
import { User } from './entites/users.entity.js';
import { CreateUserFields, UsersRepository } from './repositories/users.repository.js';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}

    async findByEmail(email: string, withCredentials = false): Promise<User | null> {
        return this.usersRepository.findByEmail(email, withCredentials);
    }

    async findById(id: string, withCredentials = false): Promise<User | null> {
        return this.usersRepository.findById(id, withCredentials);
    }

    async create(user: CreateUserFields): Promise<User> {
        return this.usersRepository.create(user);
    }

    async setRefreshToken(userId: string, refreshTokenHash: string | null): Promise<void> {
        await this.usersRepository.setRefreshToken(userId, refreshTokenHash);
    }
}
