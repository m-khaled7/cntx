import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { FindOptionsWhere, Repository } from "typeorm";
import { User } from "../entites/users.entity.js";

@Injectable()
export class UsersRepository {
    constructor(
        @InjectRepository(User) private readonly repository: Repository<User>
    ) {}

    findByEmail(email: string, withCredentials = false): Promise<User | null> {
        return this.findByWithCredentials({ email }, withCredentials);
    }

    findById(id: string, withCredentials = false) {
        return this.findByWithCredentials({ id }, withCredentials);
    }

    create(fields: Partial<User>): Promise<User> {
        return this.repository.save(this.repository.create(fields));
    }

    setRefreshToken(userId: string, refreshTokenHash: string | null) {
        return this.repository.update(userId, { refreshTokenHash });
    }

    private async findByWithCredentials(
        where: FindOptionsWhere<User>,
        withCredentials = false
    ) {
        const result = await this.repository.findOne({ where },);
        if (result && !withCredentials) {
            result.passwordHash = "";
            result.refreshTokenHash = "";
            return result;
        }
        return result;
    }
}
