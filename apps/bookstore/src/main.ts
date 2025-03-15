import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { BookStoreModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(BookStoreModule, {
    transport: Transport.TCP,
    options: { port: 3003 },
  });
  await app.listen();
  console.log('Users Microservice is running on port 3003');
}
bootstrap();
