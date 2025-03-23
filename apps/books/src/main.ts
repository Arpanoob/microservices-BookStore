import { NestFactory } from '@nestjs/core';
import { BooksModule } from './books.module';
import { MicroserviceOptions, Transport, ClientProxyFactory, ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

const SERVICE_NAME = 'book-service';
const SERVICE_IP = 'localhost';
const SERVICE_PORT = 3004;
const SERVICE_REGISTRY_TCP_PORT = 4000;

const registryClient: ClientProxy = ClientProxyFactory.create({
  transport: Transport.TCP,
  options: { host: 'localhost', port: SERVICE_REGISTRY_TCP_PORT },
});

async function registerService() {
  try {
    console.log("🔗 Registering with Service Registry...");
    const response = await firstValueFrom(registryClient.send('register', {
      name: SERVICE_NAME,
      ip: SERVICE_IP,
      port: SERVICE_PORT,
    }));
    console.log(`✅ Registered: ${response.message}`);
  } catch (error) {
    console.error(`❌ Failed to register: ${error.message}`);
  }
}

async function sendHeartbeat() {
  try {
    console.log("💓 Sending heartbeat...");
    const response = await firstValueFrom(registryClient.send('heartbeat', { name: SERVICE_NAME }));
    console.log(response.message);
  } catch (error) {
    console.error(`❌ Heartbeat failed: ${error.message}`);
  }
}

async function deregisterService() {
  try {
    console.log("❌ Deregistering from Service Registry...");
    await firstValueFrom(registryClient.send('deregister', { name: SERVICE_NAME }));
    console.log(`✅ ${SERVICE_NAME} deregistered.`);
  } catch (error) {
    console.error(`⚠️ Deregistration failed: ${error.message}`);
  }
}

async function bootstrap() {
  try {
    // Create TCP Microservice
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(BooksModule, {
      transport: Transport.TCP,
      options: { port: SERVICE_PORT },
    });

    await registerService();
    await app.listen();
    console.log(`📚 Books Microservice is running on port ${SERVICE_PORT}`);

    // Send heartbeats every 15 seconds
    setInterval(sendHeartbeat, 15000);

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      await deregisterService();
      process.exit();
    });

    process.on('SIGTERM', async () => {
      await deregisterService();
      process.exit();
    });

  } catch (error) {
    console.error(`❌ Failed to start Books Microservice: ${error.message}`);
  }
}

bootstrap();
