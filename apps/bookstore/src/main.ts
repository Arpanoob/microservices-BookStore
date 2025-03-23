import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { BookStoreModule } from './app.module';

async function bootstrap() {

  const tcpMicroservice = await NestFactory.createMicroservice<MicroserviceOptions>(BookStoreModule, {
    transport: Transport.TCP,
    options: { port: 3003 },
  });

  const kafkaMicroservice = await NestFactory.createMicroservice<MicroserviceOptions>(BookStoreModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'book-store-consumer',
      },
    },
  });

  await tcpMicroservice.listen();
  await kafkaMicroservice.listen();

  console.log('📡 BookStore Microservice is running on:');
  console.log('🚀 TCP transport on port 3003');
  console.log('🔥 Kafka consumer listening to events');

}
bootstrap();
