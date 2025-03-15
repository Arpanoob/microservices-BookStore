import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateBookStockDto } from '@app/contracts/bookStore/create-bookstore.dto';
import { UpdateBookStockDto } from '@app/contracts/bookStore/update-bookstore.dto';

@Injectable()
export class BookStockService {
  constructor(@Inject('BOOKSTORE_CLIENT') private readonly bookStockClient: ClientProxy) { }

  async create(createBookStockDto: CreateBookStockDto) {
    return firstValueFrom(this.bookStockClient.send('bookStock.create', createBookStockDto));
  }

  async findAll() {
    return firstValueFrom(this.bookStockClient.send('bookStock.findAll', {}));
  }

  async findOne(id: string) {
    return firstValueFrom(this.bookStockClient.send('bookStock.findOne', { id }));
  }
  findStock(id: string) {
    console.log("opopopopopopoopopopopopopoop", id)
    return firstValueFrom(this.bookStockClient.send('bookStock.findStock', { id }));
  }

  async update(id: string, updateBookStockDto: UpdateBookStockDto) {
    return firstValueFrom(this.bookStockClient.send('bookStock.update', { updateBookStockDto }));
  }

  async remove(id: string) {
    return firstValueFrom(this.bookStockClient.send('bookStock.remove', { id }));
  }

  async checkStock(book: string, quantity: number) {
    return firstValueFrom(this.bookStockClient.send('bookStock.checkStock', { book, quantity }));
  }

  async decreaseStock(bookId: string, quantity: number) {
    return firstValueFrom(this.bookStockClient.send('bookStock.decreaseStock', { book: bookId, quantity }));
  }

  async increaseStock(bookId: string, quantity: number) {
    console.log("inside : ")
    return await firstValueFrom(this.bookStockClient.send('bookStock.increaseStock', { bookId, quantity }));
  }
}
