import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import appEnv from './env';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
      super({
        log: appEnv.PRISMA_DEBUG ? ['query', 'info', 'warn', 'error'] : undefined, // Enables logging of all queries and other log levels
      });
  }
  async onModuleInit() {
    await this.$connect();
  }
}
