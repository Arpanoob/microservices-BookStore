import { Module } from '@nestjs/common';
import { ServiceRegistryController } from './service-repository.controller';
import { ServiceRegistryService } from './service-repository.service';

@Module({
  imports: [],
  controllers: [ServiceRegistryController],
  providers: [ServiceRegistryService],
})
export class ServiceRepositoryModule {}
