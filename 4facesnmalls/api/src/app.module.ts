import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { CustomersModule } from './customers/customers.module';
import { DeliveriesModule } from './deliveries/deliveries.module';
import { RecurrenciesModule } from './recurrencies/recurrencies.module';

@Module({
  imports: [
    // Configuração de variáveis de ambiente
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Configuração do MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/nmalls',
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
    
    // Módulos da aplicação
    UsersModule,
    AuthModule,
    CustomersModule,
    DeliveriesModule,
    RecurrenciesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Registrar o interceptor global
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
