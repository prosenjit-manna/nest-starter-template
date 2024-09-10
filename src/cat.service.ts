import { Injectable } from '@nestjs/common';

@Injectable()
export class CatService {
  private readonly cats: Array<any> = [];

  create(cat: any) {
    this.cats.push(cat);
  }

  findAll() {
    return this.cats;
  }

  update(cat: any) {
    const index = this.cats.findIndex((c) => c.id === cat.id);
    this.cats[index] = cat;
  }
}