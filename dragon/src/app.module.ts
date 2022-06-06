import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModuleConfig } from './auth/types';

@Module({
  imports: [
    AuthModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const config: AuthModuleConfig = {
          connectionURI: configService.get('SUPERTOKENS_CONNECTION_URI'),
          apiKey: configService.get('SUPERTOKENS_API_KEY'),
          appInfo: {
            appName: configService.get('APP_NAME'),
            apiDomain: configService.get('API_DOMAIN'),
            websiteDomain: configService.get('WEBSITE_DOMAIN'),
            apiBasePath: configService.get('API_BASE_PATH'),
            websiteBasePath: configService.get('WEBSITE_BASE_PATH'),
          },
        };

        return config;
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
