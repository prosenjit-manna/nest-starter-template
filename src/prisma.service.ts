import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // constructor() {
  //   if (appEnv.NODE_ENV === 'development') {
  //     super({
  //       log: ['query', 'info', 'warn', 'error'], // Enables logging of all queries and other log levels
  //     });
  //   }
  // }
  async onModuleInit() {
    await this.$connect();
  }
}
