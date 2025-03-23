import { Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from './entities/book.entity';
import { CreateBookDto } from '@app/contracts/books/create-book.dto';
import { UpdateBookDto } from '@app/contracts/books/update-book.dto';
import { ClientKafka, ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BooksService implements OnModuleInit {
  constructor(@InjectModel(Book.name) private bookModel: Model<Book>,
    @Inject('BOOKSTORE_CLIENT') private readonly bookstoreClient: ClientProxy,
    @Inject('BOOKSTORE_KAFKA_CLIENT') private kafkaClient: ClientKafka) { }
  async onModuleInit() {
    await this.kafkaClient.connect();
  }
  async create(createBookDto: CreateBookDto): Promise<Book> {
    console.log("loooooooo", createBookDto)
    const book = new this.bookModel(createBookDto);
    this.kafkaClient.emit('bookStock.create', { book: book._id, stock: 0 });

    return await book.save();
  }

  async findAll(): Promise<Book[]> {
    return this.bookModel.find().exec();
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.bookModel.findById(id);
    if (!book) throw new NotFoundException(`Book with ID ${id} not found`);
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.bookModel.findByIdAndUpdate(id, updateBookDto, { new: true });
    if (!book) throw new NotFoundException(`Book with ID ${id} not found`);
    return book;
  }

  async remove(id: string): Promise<{ message: string }> {
    const book = await this.bookModel.findByIdAndDelete(id);
    if (!book) throw new NotFoundException(`Book with ID ${id} not found`);
    return { message: `Book with ID ${id} deleted successfully` };
  }
}
