import { Injectable, ArgumentMetadata, BadRequestException, ValidationPipe, UnprocessableEntityException } from '@nestjs/common';

@Injectable()
export class ValidateInputPipe extends ValidationPipe {
   public async transform(value, metadata: ArgumentMetadata) {
      try {
        return await super.transform(value, metadata);
      } catch (e) {
         if (e instanceof BadRequestException) {
            throw new BadRequestException(this.handleError(e));
         }
      }
   }

   private handleError(errors) {
        
        const response = errors.response
        const statusCode = response.statusCode
        const error = response.error
        const status = false

        let message = response.message.map(error => error);
        return {
            message,
            status,
            error ,
            response:null,
            statusCode
        }
   }
}