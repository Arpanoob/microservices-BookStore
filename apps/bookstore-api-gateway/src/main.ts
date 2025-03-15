import { NestFactory } from '@nestjs/core';
import { BookstoreApiGatewayModule } from './bookstore-api-gateway.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(BookstoreApiGatewayModule);

  app.use(cookieParser());

  await app.listen(process.env.port ?? 3000);
}
bootstrap();
