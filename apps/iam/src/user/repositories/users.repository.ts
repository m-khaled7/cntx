import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { FindOptionsWhere, UpdateResult } from 'typeorm';
import { Repository } from 'typeorm';
import { User } from '../entites/users.entity.js';

export type CreateUserFields = Pick<User, 'firstName' | 'lastName' | 'email' | 'passwordHash'>;

@Injectable()
export class UsersRepository {
    constructor(@InjectRepository(User) private readonly repository: Repository<User>) {}

    findByEmail(email: string, withCredentials = false): Promise<User | null> {
        return this.findByWithCredentials({ email }, withCredentials);
    }

    findById(id: string, withCredentials = false): Promise<User | null> {
        return this.findByWithCredentials({ id }, withCredentials);
    }

    create(fields: CreateUserFields): Promise<User> {
        return this.repository.save(this.repository.create(fields));
    }

    setRefreshToken(userId: string, refreshTokenHash: string | null): Promise<UpdateResult> {
        return this.repository.update(userId, { refreshTokenHash });
    }

    private async findByWithCredentials(
        where: FindOptionsWhere<User>,
        withCredentials = false,
    ): Promise<User | null> {
        const result = await this.repository.findOne({ where });

        if (result && !withCredentials) {
            return this.withoutCredentials(result);
        }

        return result;
    }

    private withoutCredentials(user: User): User {
        return {
            ...user,
            passwordHash: '',
            refreshTokenHash: '',
        };
    }
}
