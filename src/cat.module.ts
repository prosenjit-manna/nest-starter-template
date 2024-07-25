import { CatController } from './cat.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [CatController],
  providers: [],
})
export class CatModule {}
