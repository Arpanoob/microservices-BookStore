import {
    Body, Controller, Get, Post, Patch, Delete, Param, Res, UseGuards, Req, BadRequestException, UnauthorizedException, NotFoundException, Logger
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '@app/contracts/users/create-user.dto';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/auth-guards';
import { LoginUserDto } from '@app/contracts/users/login-user.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/role.gaurds';

@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) { }

    @Post()
    async create(@Body() createUser: CreateUserDto) {
        try {
            return await this.userService.create(createUser);
        } catch (error) {
            return this.handleException(error);
        }
    }

    @Post('login')
    async login(@Body() loginDto: LoginUserDto, @Res() res: Response) {
        try {
            const { token } = await this.userService.login(loginDto);

            if (!token) {
                return res.status(401).send({ message: 'Invalid credentials' });
            }

            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            });

            return res.send({ message: 'Login successful', accessToken: token });
        } catch (error) {
            return res.status(500).send(this.handleException(error));
        }
    }
    @Roles("admin", "user")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    async findAll() {
        try {
            return await this.userService.findAll();
        } catch (error) {
            return this.handleException(error);
        }
    }
    //rate limmiter
    @Roles("admin", "user")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':id')
    async findOne(@Param('id') userId: string) {
        try {
            return await this.userService.findOne(userId);
        } catch (error) {
            return this.handleException(error);
        }
    }

    @Roles("admin", "user")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch(':id')
    async update(@Param('id') userId: string, @Body() updateUserDto: Partial<CreateUserDto>) {
        try {
            return await this.userService.update(userId, updateUserDto);
        } catch (error) {
            return this.handleException(error);
        }
    }

    @Roles("admin")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async delete(@Param('id') userId: string) {
        try {
            return await this.userService.delete(userId);
        } catch (error) {
            return this.handleException(error);
        }
    }

    @Roles("admin", "user")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('logout')
    async logout(@Res() res: Response) {
        try {
            res.cookie('Authentication', '', { expires: new Date(0) });
            return res.send({ message: 'Logged out successfully' });
        } catch (error) {
            return res.status(500).send(this.handleException(error));
        }
    }

    private handleException(error: any) {
        console.error("Error:", error);

        if (error instanceof BadRequestException) {
            return { status: 400, message: error.message };
        } else if (error instanceof UnauthorizedException) {
            return { status: 401, message: error.message };
        } else if (error instanceof NotFoundException) {
            return { status: 404, message: error.message };
        } else {
            return { status: 500, message: 'Internal Server Error' };
        }
    }
}
