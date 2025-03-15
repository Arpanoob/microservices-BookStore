import { Module } from '@nestjs/common';
import { BookstoreApiGatewayController } from './bookstore-api-gateway.controller';
import { BookstoreApiGatewayService } from './bookstore-api-gateway.service';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { BookstoreModule } from './bookstore/bookstore.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UsersModule,
    BooksModule,
    AuthModule,
    OrdersModule,
    BookstoreModule],
  controllers: [BookstoreApiGatewayController],
  providers: [BookstoreApiGatewayService],
})
export class BookstoreApiGatewayModule { }
