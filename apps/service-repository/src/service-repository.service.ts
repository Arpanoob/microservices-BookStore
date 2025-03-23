import { Injectable } from "@nestjs/common";


export interface ServiceInfo {
  name: string;
  ip: string;
  port: number;
}

@Injectable()
export class ServiceRegistryService {
  private services: Record<string, ServiceInfo> = {
    "user-service": {
      name: "user-service",
      ip: "localhost",
      port: 3001
    }, "order-service": {
      name: "order-service",
      ip: "localhost",
      port: 3002
    },
    "bookstore-service": {
      name: "bookstore-service",
      ip: "localhost",
      port: 3003
    },
    "book-service": {
      name: "book-service",
      ip: "localhost",
      port: 3004
    }
  };

  registerService(service: ServiceInfo) {
    this.services[service.name] = service;
    console.log(`Service registered: ${service.name} at ${service.ip}:${service.port}`);
  }

  deregisterService(name: string) {
    delete this.services[name];
    console.log(`Service deregistered: ${name}`);
  }

  getService(name: string): ServiceInfo | null {
    return this.services[name] || null;
  }

  getAllServices(): Record<string, ServiceInfo> {
    return this.services;
  }
}
