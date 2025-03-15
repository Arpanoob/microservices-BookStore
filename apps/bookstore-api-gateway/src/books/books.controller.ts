import {
  Controller, Get, Post, Patch, Delete, Param, Body, Logger, BadRequestException, NotFoundException,
  UseGuards
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from '@app/contracts/books/create-book.dto';
import { UpdateBookDto } from '@app/contracts/books/update-book.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/auth-guards';
import { RolesGuard } from '../auth/guards/role.gaurds';

@Controller('books')
export class BooksController {
  private readonly logger = new Logger(BooksController.name);

  constructor(private readonly booksService: BooksService) { }
  @Roles("admin", "user")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    try {
      this.logger.log(`Creating book: ${JSON.stringify(createBookDto)}`);
      return await this.booksService.create(createBookDto);
    } catch (error) {
      return this.handleException(error);
    }
  }
  @Roles("admin","user")
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Get()
  async findAll() {
    try {
      return await this.booksService.findAll();
    } catch (error) {
      return this.handleException(error);
    }
  }
  @Roles("admin","user")
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.booksService.findOne(id);
    } catch (error) {
      return this.handleException(error);
    }
  }
  @Roles("admin","user")
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    try {
      return await this.booksService.update(id, updateBookDto);
    } catch (error) {
      return this.handleException(error);
    }
  }
  @Roles("admin")
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      this.logger.log(`Deleting book with ID: ${id}`);
      return await this.booksService.remove(id);
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
