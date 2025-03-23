import { Controller, Post, Body, Delete, Param, Get } from "@nestjs/common";
import { ServiceInfo, ServiceRegistryService } from "./service-repository.service";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller()
export class ServiceRegistryController {
  constructor(private readonly registryService: ServiceRegistryService) {}

  @Post('register')
  register(@Body() service: ServiceInfo) {
    this.registryService.registerService(service);
    return { message: `Service ${service.name} registered successfully.` };
  }

  @Delete('deregister/:name')
  deregister(@Param('name') name: string) {
    this.registryService.deregisterService(name);
    return { message: `Service ${name} deregistered successfully.` };
  }

  @MessagePattern('registry.discover')
  async discover(@Payload() name: string) {
    console.log("opopopop", name);
    const service = this.registryService.getService(name);
    if (!service) {
      return { error: `Service ${name} not found.` };
    }
    return service;
  }

  @Get('services')
  getAll() {
    return this.registryService.getAllServices();
  }
}