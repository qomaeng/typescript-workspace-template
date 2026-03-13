import { createKeyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import {
  type MiddlewareConsumer,
  type NestModule,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AppConfig } from './app.config';
import { AuthRpcClient } from './client/auth-rpc.client';
import { UserRpcClient } from './client/user-rpc.client';
import { AuthV1Controller } from './controller/v1/auth-v1.controller';
import { MetricV1Controller } from './controller/v1/metric-v1.controller';
import { UserV1Controller } from './controller/v1/user-v1.controller';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { AuthMiddleware } from './middleware/auth.middleware';
import { LoggingMiddleware } from './middleware/logging-middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: (env: Record<string, any>) => AppConfig.parse(env),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: (configService: ConfigService<AppConfig, true>) => ({
        ttl: configService.getOrThrow<number>('REDIS_DEFAULT_TTL'),
        stores: [
          createKeyv({
            database: configService.getOrThrow<number>('REDIS_DB'),
            username: configService.getOrThrow<string>('REDIS_USERNAME'),
            password: configService.getOrThrow<string>('REDIS_PASSWORD'),
            socket: {
              host: configService.getOrThrow<string>('REDIS_HOST'),
              port: configService.getOrThrow<number>('REDIS_PORT'),
              reconnectStrategy: (retries): number => Math.min(retries * 50, 2000),
            },
          }),
        ],
      }),
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync([
      {
        name: 'UserRpcProxy',
        useFactory: (configService: ConfigService<AppConfig, true>) => ({
          transport: Transport.TCP,
          options: {
            host: configService.getOrThrow<string>('USER_RPC_HOST'),
            port: configService.getOrThrow<number>('USER_RPC_PORT'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'AuthRpcProxy',
        useFactory: (configService: ConfigService<AppConfig, true>) => ({
          transport: Transport.TCP,
          options: {
            host: configService.getOrThrow<string>('AUTH_RPC_HOST'),
            port: configService.getOrThrow<number>('AUTH_RPC_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [MetricV1Controller, UserV1Controller, AuthV1Controller],
  providers: [
    // NestJS Components
    // { provide: APP_INTERCEPTOR, useClass: AuditInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },

    // Clients
    UserRpcClient,
    AuthRpcClient,

    // Services
    { provide: 'UserService', useExisting: UserRpcClient },
    { provide: 'AuthService', useExisting: AuthRpcClient },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(LoggingMiddleware, AuthMiddleware)
      .exclude(
        { path: '*path', method: RequestMethod.OPTIONS },
        { path: '/docs', method: RequestMethod.GET },
        { path: '/docs/*path', method: RequestMethod.GET },
        { path: '/metrics/v1/health', method: RequestMethod.GET },
      )
      .forRoutes({ path: '*path', method: RequestMethod.ALL });
  }
}
