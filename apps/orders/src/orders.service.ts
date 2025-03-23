import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ClientKafka, ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { CreateOrderDto } from '@app/contracts/orders/create-order.dto';
import { UpdateOrderDto } from '@app/contracts/orders/update-order.dto';
import { Order } from './entities/order.entity';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @Inject('BOOKSTOCK_CLIENT') private readonly bookStockClient: ClientProxy,
    @Inject('USERS_CLIENT') private readonly userClient: ClientProxy,
    @Inject('BOOKSTORE_KAFKA_CLIENT') private BookStoreKafkaClient: ClientKafka,
    @Inject('USERS_KAFKA_CLIENT') private UserKafkaClient: ClientKafka
  ) { }

  async create(createOrderDto: CreateOrderDto) {
    const { userId, orders } = createOrderDto;

    const stockCheckResults = await Promise.all(
      orders.map(order =>
        firstValueFrom(this.bookStockClient.send('bookStock.checkStock', { book: order.book, quantity: order.quantity }))
      )
    );
    console.log("opopopoolololpoppo", createOrderDto)

    if (stockCheckResults.some(result => !result.available)) {
      throw new BadRequestException(`Insufficient stock for one or more books`);
    }

    await Promise.all(
      orders.map(order =>
        this.bookStockClient.emit('bookStock.decreaseStock', { book: order.book, quantity: order.quantity })
      )
    );

    const newOrder = new this.orderModel(createOrderDto);
    await newOrder.save();

    // const or = await firstValueFrom(this.userClient.send('user.update', {
    //   userId,
    //   updateUserDto: { OwnBooks: orders.map(o => ({ book: o.book, quantity: o.quantity })) }
    // }));
    this.UserKafkaClient.emit('user.update', {
      userId,
      updateUserDto: { OwnBooks: orders.map(o => ({ book: o.book, quantity: o.quantity })) }
    });

    return newOrder;
  }

  async findAll() {
    return this.orderModel.find().populate('orders.book')
  }

  async findOne(id: string) {
    const order = await this.orderModel.findById(id)//.populate('orders.book')//.populate('userId');
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const updatedOrder = await this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true });
    if (!updatedOrder) throw new NotFoundException('Order not found');
    return updatedOrder;
  }

  async remove(id: string) {
    const order = await this.orderModel.findByIdAndDelete(id);
    if (!order) throw new NotFoundException('Order not found');
    return { message: 'Order deleted successfully' };
  }
}
