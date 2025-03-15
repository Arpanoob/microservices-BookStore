import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/users/.env',
    }),
    ClientsModule.register([
      {
        name: "BOOKS_CLIENT",
        transport: Transport.TCP,
        options: {
          port: 3004
        }
      }
    ])
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule { }
