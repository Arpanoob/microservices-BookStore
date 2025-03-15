import {
  Controller, Get, Post, Patch, Delete, Param, Body, BadRequestException, NotFoundException, InternalServerErrorException, Logger,
  UseGuards
} from '@nestjs/common';
import { CreateBookStockDto } from '@app/contracts/bookStore/create-bookstore.dto';
import { UpdateBookStockDto } from '@app/contracts/bookStore/update-bookstore.dto';
import { BookStockService } from './bookstore.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/auth-guards';
import { RolesGuard } from '../auth/guards/role.gaurds';

@Controller('bookstock')
export class BookStockController {
  private readonly logger = new Logger(BookStockController.name);

  constructor(private readonly bookStockService: BookStockService) { }

  @Roles("admin", "user")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() createBookStockDto: CreateBookStockDto) {
    try {
      this.logger.log(`Creating book stock: ${JSON.stringify(createBookStockDto)}`);
      return await this.bookStockService.create(createBookStockDto);
    } catch (error) {
      return this.handleException(error);
    }
  }

  @Roles("admin","user")
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Get()
  async findAll() {
    try {
      return await this.bookStockService.findAll();
    } catch (error) {
      return this.handleException(error);
    }
  }

  @Roles("admin","user")
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.bookStockService.findOne(id);
    } catch (error) {
      return this.handleException(error);
    }
  }

  @Roles("admin","user")
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Get('stock/:id')
  async findStock(@Param('id') id: string) {
    try {
      return await this.bookStockService.findStock(id);
    } catch (error) {
      return this.handleException(error);
    }
  }

  @Roles("admin","user")
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBookStockDto: UpdateBookStockDto) {
    try {
      return await this.bookStockService.update(id, updateBookStockDto);
    } catch (error) {
      return this.handleException(error);
    }
  }

  @Roles("user")
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      this.logger.log(`Deleting book stock with ID: ${id}`);
      return await this.bookStockService.remove(id);
    } catch (error) {
      return this.handleException(error);
    }
  }
  @Roles("admin")
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Get(':id/check-stock/:quantity')
  async checkStock(@Param('id') book: string, @Param('quantity') quantity: number) {
    try {
      return await this.bookStockService.checkStock(book, quantity);
    } catch (error) {
      return this.handleException(error);
    }
  }

  @Roles("admin")
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Patch(':id/decrease/:quantity')
  async decreaseStock(@Param('id') bookId: string, @Param('quantity') quantity: number) {
    try {
      return await this.bookStockService.decreaseStock(bookId, quantity);
    } catch (error) {
      return this.handleException(error);
    }
  }
  @Roles("admin")
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Patch(':id/increase/:quantity')
  async increaseStock(@Param('id') bookId: string, @Param('quantity') quantity: number) {
    try {
      return await this.bookStockService.increaseStock(bookId, quantity);
    } catch (error) {
      return this.handleException(error);
    }
  }

  private handleException(error: any) {
    this.logger.error("Error:", error);

    if (error instanceof BadRequestException) {
      return { status: 400, message: error.message };
    } else if (error instanceof NotFoundException) {
      return { status: 404, message: error.message };
    } else {
      return { status: 500, message: 'Internal Server Error' };
    }
  }
}
