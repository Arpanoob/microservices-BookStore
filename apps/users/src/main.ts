import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(UsersModule, {
    transport: Transport.TCP,
    options: { port: 3001 },
  });
  const kafkaMicroservice = await NestFactory.createMicroservice<MicroserviceOptions>(UsersModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'user-consumer',
      },
    },
  }); await kafkaMicroservice.listen();
  await app.listen();
  console.log('Users Microservice is running on port 3001');
}
bootstrap();
