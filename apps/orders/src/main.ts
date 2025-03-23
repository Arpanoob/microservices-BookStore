import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { OrdersModule } from './orders.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(OrdersModule, {
    transport: Transport.TCP,
    options: { port: 3002 },
  });


  await app.listen();

  console.log('Users Microservice is running on port 3002');
}
bootstrap();
