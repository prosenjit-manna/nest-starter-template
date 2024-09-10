import { CatService } from './cat.service';
import { CatController } from './cat.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [CatController],
  providers: [CatService],
})
export class CatModule {}
