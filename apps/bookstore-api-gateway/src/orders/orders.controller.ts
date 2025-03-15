import {
  Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, NotFoundException, InternalServerErrorException, Logger,
  UseGuards
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from '@app/contracts/orders/create-order.dto';
import { UpdateOrderDto } from '@app/contracts/orders/update-order.dto';
import { JwtAuthGuard } from '../auth/guards/auth-guards';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/role.gaurds';

@Controller('orders')
export class OrdersController {

  constructor(private readonly ordersService: OrdersService) { }

  @Roles("admin", "user")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      return await this.ordersService.create(createOrderDto);
    } catch (error) {
      return this.handleException(error);
    }
  }
  @Roles("admin","user")
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Get()
  async findAll() {
    try {
      return await this.ordersService.findAll();
    } catch (error) {
      return this.handleException(error);
    }
  }
  @Roles("admin","user")
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.ordersService.findOne(id);
    } catch (error) {
      return this.handleException(error);
    }
  }
  @Roles("admin","user")
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    try {
      return await this.ordersService.update(id, updateOrderDto);
    } catch (error) {
      return this.handleException(error);
    }
  }

  @Roles("admin")
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.ordersService.remove(id);
    } catch (error) {
      return this.handleException(error);
    }
  }

  private handleException(error: any) {

    if (error instanceof BadRequestException) {
      return { status: 400, message: error.message };
    } else if (error instanceof NotFoundException) {
      return { status: 404, message: error.message };
    } else {
      return { status: 500, message: 'Internal Server Error' };
    }
  }
}
