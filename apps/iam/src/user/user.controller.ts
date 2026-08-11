import { Controller } from '@nestjs/common';
import { UsersService } from './user.service.js';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
