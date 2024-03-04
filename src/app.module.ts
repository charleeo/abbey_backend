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

import { AccountModule } from './modules/account/account.module';
import { ClientsModule } from './modules/clients/clients.module';
import { excludedRoutes } from './routes/exclude.';

import { ConfigMiddlewareHelperService } from './modules/config/services/helpers.middleware.config';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(datasourceOption),
    ScheduleModule.forRoot(),
   
    UserModule,
    AuthModule,
    CommonConfig,
    AccountModule,
    ClientsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '../public'),
    }),
  ],
  controllers: [],
  providers: [ ConfigMiddlewareHelperService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(...excludedRoutes)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
     }
}
