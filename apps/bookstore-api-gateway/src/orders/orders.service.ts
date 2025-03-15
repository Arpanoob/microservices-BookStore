import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(@Inject('ORDERS_CLIENT') private readonly ordersClient: ClientProxy) { }

  async create(createOrderDto: CreateOrderDto) {
      console.log("opopopopoppo", createOrderDto)
    return firstValueFrom(this.ordersClient.send('orders.create', createOrderDto));
  }

  async findAll() {
    return firstValueFrom(this.ordersClient.send('orders.findAll', {}));
  }

  async findOne(id: string) {
    return firstValueFrom(this.ordersClient.send('orders.findOne', id));
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    return firstValueFrom(this.ordersClient.send('orders.update', { id, ...updateOrderDto }));
  }

  async remove(id: string) {
    return firstValueFrom(this.ordersClient.send('orders.remove', id));
  }
}
