import { CreateBookStockDto } from '@app/contracts/bookStore/create-bookstore.dto';
import { UpdateBookStockDto } from '@app/contracts/bookStore/update-bookstore.dto';
import { Controller, BadRequestException, UnauthorizedException, NotFoundException, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { BookStockService } from './app.service';

@Controller()
export class BookStockController {

    constructor(private readonly bookStockService: BookStockService) { }

    @EventPattern('bookStock.create')
    async create(@Payload() createBookStockDto: CreateBookStockDto) {
        try {
            console.log(`Creating book stock: ${JSON.stringify(createBookStockDto)}`);
            return await this.bookStockService.create(createBookStockDto);
        } catch (error) {
            return this.handleException(error);
        }
    }

    @MessagePattern('bookStock.findAll')
    async findAll() {
        try {
            return await this.bookStockService.findAll();
        } catch (error) {
            return this.handleException(error);
        }
    }

    @MessagePattern('bookStock.findOne')
    async findOne(@Payload() { id }: { id: string }) {
        try {
            return await this.bookStockService.findOne(id);
        } catch (error) {
            return this.handleException(error);
        }
    }

    @MessagePattern('bookStock.findStock')
    async findStock(@Payload() { id }: { id: string }) {
        try {
            return await this.bookStockService.findStock(id);
        } catch (error) {
            return this.handleException(error);
        }
    }

    @MessagePattern('bookStock.update')
    async update(@Payload() updateBookStockDto: UpdateBookStockDto) {
        try {
            return await this.bookStockService.update(updateBookStockDto);
        } catch (error) {
            return this.handleException(error);
        }
    }

    @MessagePattern('bookStock.remove')
    async remove(@Payload() { id }: { id: string }) {
        try {
            return await this.bookStockService.remove(id);
        } catch (error) {
            return this.handleException(error);
        }
    }

    @MessagePattern('bookStock.checkStock')
    async checkStock(@Payload() { book, quantity }: { book: string; quantity: number }) {
        try {
            console.log("inside bookStock : ", book, quantity)
            return await this.bookStockService.checkStock(book, quantity);
        } catch (error) {
            return this.handleException(error);
        }
    }

    @MessagePattern('bookStock.decreaseStock')
    async decreaseStock(@Payload() { book, quantity }: { book: string; quantity: number }) {
        try {
            console.log("hitten", book, quantity)
            return await this.bookStockService.decreaseStock(book, quantity);
        } catch (error) {
            return this.handleException(error);
        }
    }

    @MessagePattern('bookStock.increaseStock')
    async increaseStock(@Payload() { bookId, quantity }: { bookId: string; quantity: number }) {
        try {
            return await this.bookStockService.increaseStock(bookId, quantity);
        } catch (error) {
            return this.handleException(error);
        }
    }

    private handleException(error: any) {
        console.error("Error:", error);

        if (error instanceof BadRequestException) {
            return { status: 400, message: error.message };
        } else if (error instanceof UnauthorizedException) {
            return { status: 401, message: error.message };
        } else if (error instanceof NotFoundException) {
            return { status: 404, message: error.message };
        } else {
            return { status: 500, message: 'Internal Server Error' };
        }
    }
}
