import { CreateBookDto } from '@app/contracts/books/create-book.dto';
import { UpdateBookDto } from '@app/contracts/books/update-book.dto';
import { Inject, Injectable } from '@nestjs/common';

import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
@Injectable()
export class BooksService {
  constructor(@Inject("BOOKS_CLIENT") private booksClient: ClientProxy) { }

  create(createBookDto: CreateBookDto) {
    return firstValueFrom(this.booksClient.send("books.createBook", createBookDto));
  }

  findAll() {
    return firstValueFrom(this.booksClient.send("books.findAllBooks", {}));
  }

  findOne(id: string) {
    return firstValueFrom(this.booksClient.send("books.findOneBook", id));
  }

  update(id: string, updateBookDto: UpdateBookDto) {
    return firstValueFrom(this.booksClient.send("books.updateBook", { ...updateBookDto }));
  }

  remove(id: string) {
    return firstValueFrom(this.booksClient.send("books.removeBook", id));
  }

  // decreaseStock(id: string, quantity: number) {
  //   return this.booksClient.send('books.decreaseStock', { book: id, quantity });
  // }

  // increaseStock(id: string, quantity: number) {
  //   return this.booksClient.send('books.increaseStock', { bookId: id, quantity });
  // }
}
