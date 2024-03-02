import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Users } from '../user/entities/user.entity';
import { logErrors } from 'src/common/helpers/logging';

@Injectable()
export class MailsService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(mailObject: any) {
    
    try{
        await this.mailerService.sendMail({
          to: mailObject.receipient.email,
          from: `"${process.env.APP_NAME}" ${process.env.MAIL_FROM_ADDRESS}`, // override default from
          subject: mailObject.extraData.subject,
          template:mailObject.template.name,
          replyTo:`"No Reply" ${process.env.MAIL_REPLY_TO}`,
          context: { 
            name: mailObject.receipient.name,
            url:mailObject.extraData.url,
          },
        });

    }catch(e){
        logErrors(e)
    }
  }
}
