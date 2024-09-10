import { Controller, Get, Post, Put, Param, Delete, Body } from '@nestjs/common';
import { CatService } from './cat.service';

@Controller('cats')
export class CatController {

  constructor(private catsService: CatService) {}

  @Post()
  create(@Body() cat: any) {
    this.catsService.create(cat);
    return cat;
  }

  @Get()
  findAll() {
    return this.catsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} cat`;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() cat: any) {
    this.catsService.update(cat);
    return cat;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} cat`;
  }
}
