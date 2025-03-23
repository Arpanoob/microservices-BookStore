import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { Book, BookSchema } from './entities/book.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { redisStore } from 'cache-manager-ioredis-yet';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: 'apps/users/.env',
  })    ,
  CacheModule.register({
    store: redisStore,
    host: 'localhost',
    port: 6379,
    ttl: 600,
  }),
  ClientsModule.register([
    {
      name: 'BOOKSTORE_CLIENT',
      transport: Transport.TCP,
      options: { port: 3003 },
    },
  ]),
  ClientsModule.register([
    {
      name: 'BOOKSTORE_KAFKA_CLIENT',
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092'],
        },
        consumer: {
          groupId: 'bookstore-group',
        },
      },
    },
  ])
    ,
  JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: '1h' },
    }),
  }),
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const mongoUri = configService.get<string>('MONGODB_URI');
      console.log('🚀 MONGODB_URI:', mongoUri); // ✅ Debug log
      if (!mongoUri) throw new Error('❌ MONGODB_URI is undefined!' + process.env.MONGODB_URI);
      return { uri: mongoUri };
    }

  }),
  MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),

  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule { }
