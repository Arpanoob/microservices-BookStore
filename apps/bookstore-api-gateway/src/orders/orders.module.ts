import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule, ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: 'apps/orders/.env',
  }),
    ClientsModule.register([
      { name: 'ORDERS_CLIENT', transport: Transport.TCP, options: { port: 3002 } }
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule { }
