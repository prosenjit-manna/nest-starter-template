import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SentryModule } from '@sentry/nestjs/setup';

import { RoleModule } from './roles/role.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { MediaModule } from './media/media.module';
import { ThrottleTestModule } from './throttle-test/throttle-test.module';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { GqlThrottlerGuard } from './auth/throttler.guard';
import appEnv from './env';

@Module({
  imports: [
    SentryModule.forRoot(),
    PrismaModule,
    ...(appEnv.RATE_LIMIT_ENABLED ? [ThrottlerModule.forRootAsync({
      useFactory: (): ThrottlerModuleOptions => ([
        {
          ttl: appEnv.THROTTLE_TTL,
          limit: appEnv.THROTTLE_LIMIT,
        },
      ]),
    })] : []),
    AuthModule,
    ThrottleTestModule,
    WorkspaceModule,
    RoleModule,
    PostModule,
    UserModule,
    MediaModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      introspection: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false,
      csrfPrevention: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    
    // Always place to bottom
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GqlThrottlerGuard,
    },
  ],
})
export class AppModule {}
