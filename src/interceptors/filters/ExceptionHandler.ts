import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AxiosError } from 'axios';
import { logErrors } from 'src/common/helpers/logging';
import { QueryFailedError } from 'typeorm';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

@Catch()
export class ExceptionHandler implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Server error';
    if (exception instanceof QueryFailedError) {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Bad query implementation';
    } else if (exception instanceof EntityNotFoundError) {
      httpStatus = HttpStatus.NOT_FOUND;
      message = 'Resource not found';
    } else if (exception instanceof NotFoundException) {
      httpStatus = HttpStatus.NOT_FOUND;
      message = 'requested endpoint does not exists';
    } else if (exception instanceof BadRequestException) {
      httpStatus = exception.getStatus();
      message = exception['response']['message'];
    } else if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      message = exception.message;
    }
   
    else if (exception instanceof AxiosError ){
      httpStatus = exception.status
      message = exception.message
    }

    const responseBody = {
      statusCode: httpStatus,
      message,
      status: false,
      data: null,
    };

    logErrors(exception);
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
