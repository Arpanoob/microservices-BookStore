import { CreateUserDto } from '@app/contracts/users/create-user.dto';
import { LoginUserDto } from '@app/contracts/users/login-user.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UsersService {
    constructor(@Inject('USERS_CLIENT') private userClient: ClientProxy) { }

    create(createUser: CreateUserDto) {
        return firstValueFrom(this.userClient.send('user.create', createUser))
    }
    async login(loginDto: LoginUserDto) {
        return await firstValueFrom(this.userClient.send('user.login', loginDto))
    }

    findAll() {
        return firstValueFrom(this.userClient.send('user.findAll', {}))
    }

    findOne(userId: string) {
        return firstValueFrom(this.userClient.send('user.findOne', { userId }))
    }

    update(userId: string, updateUserDto: Partial<CreateUserDto>) {
        console.log(userId, updateUserDto, "okok")
        return firstValueFrom(this.userClient.send('user.update', { userId, updateUserDto }))
    }

    delete(userId: string) {
        return firstValueFrom(this.userClient.send('user.delete', { userId }))
    }

    logout() {
        return { message: 'User logged out successfully' };
    }
}
