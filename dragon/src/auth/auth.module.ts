import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  Provider,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from './auth.middleware';
import { SupertokensService } from './supertokens/supertokens.service';
import { AuthModuleAsyncOptions, CONFIG_INJECTION_TOKEN } from './types';

@Module({
  imports: [ConfigModule],
  providers: [SupertokensService],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }

  private static createAsyncProvider(
    options: AuthModuleAsyncOptions,
  ): Provider {
    return {
      provide: CONFIG_INJECTION_TOKEN,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
  }

  static forRootAsync(options: AuthModuleAsyncOptions): DynamicModule {
    return {
      module: AuthModule,
      imports: options.imports,
      providers: [this.createAsyncProvider(options)],
    };
  }
}
