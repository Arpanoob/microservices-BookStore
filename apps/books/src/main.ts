import { NestFactory } from '@nestjs/core';
import { BooksModule } from './books.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(BooksModule, {
    transport: Transport.TCP,
    options: { port: 3004 },
  });
  await app.listen();
  console.log('Users Microservice is running on port 3004');
}
bootstrap();
