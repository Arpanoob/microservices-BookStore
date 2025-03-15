import { Module } from '@nestjs/common';
import { BookStockService } from './bookstore.service';
import { BookStockController } from './bookstore.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule,
    ClientsModule.register([
      { name: 'BOOKSTORE_CLIENT', transport: Transport.TCP, options: { host: 'localhost', port: 3003 } },
    ]),
  ],

  controllers: [BookStockController],
  providers: [BookStockService],
})
export class BookstoreModule { }
