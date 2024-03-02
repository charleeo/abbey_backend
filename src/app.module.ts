import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { datasourceOption } from 'db/data-source';

import { ConfigModule } from '@nestjs/config';

import { ConfigModule as CommonConfig } from './modules/config/config.module';
import { AuthModule } from './modules/auth/auth.module';

import { AuthMiddleware } from './middleware/auth/auth.middleware';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailsModule } from './modules/mails/mails.module';

import { EventModule } from './modules/event/event.module';
import { AccountModule } from './modules/account/account.module';
import { ClientsModule } from './modules/clients/clients.module';
import { excludedRoutes } from './routes/exclude.';
import { LoanConfigMustBeSetMiddleware } from './middleware/loan/loan-config-must-be-set/loan-config-must-be-set.middleware';
import { LoanSettingService } from './modules/clients/loans/services/loan.settings.service';
import { ConfigMiddlewareHelperService } from './modules/config/services/helpers.middleware.config';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(datasourceOption),
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    EventEmitterModule.forRoot(),
    UserModule,
    AuthModule,
    CommonConfig,
    MailsModule,
    EventModule,
    AccountModule,
    ClientsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '../public'),
    }),
  ],
  controllers: [],
  providers: [MailsModule, LoanSettingService, ConfigMiddlewareHelperService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(...excludedRoutes)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
    consumer
      .apply(LoanConfigMustBeSetMiddleware)
      .forRoutes({ path: '/loans/apply', method: RequestMethod.POST });
  }
}
