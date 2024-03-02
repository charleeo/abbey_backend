import { Module,Global } from '@nestjs/common';
import { MailsService } from './mails.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import  { join, sep} from 'path'

@Global()
@Module({
    imports: [
        MailerModule.forRoot({
          transport: {
            host: process.env.MAIL_HOST,
            secure: true,
            port:process.env.MAIL_PORT as any,
            auth: {
              user: process.env.MAIL_USERNAME,
              pass: process.env.MAIL_PASSWORD,
            },
          },
          defaults: {
            from: process.env.MAIL_REPLY_TO,
          },
          template: {
            dir: join(__dirname,'..', sep, "..",sep, "..", `views${sep}mail${sep}templates`),
            adapter: new HandlebarsAdapter(), 
            options: {
              strict: true,
            },
          },
        }),
      ],
  providers: [MailsService],
  exports:[MailsService]
})
export class MailsModule {
}
