// file.interceptor.ts

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import multer, { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const fieldName = 'file'; // Set your desired field name
    const multerOptions = {
      storage: diskStorage({
        destination: './src/public/uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = uuidv4();
          const fileExtension = file.originalname.split('.').pop();
          cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtension}`);
        },
      }),
    };

    return new Observable((observer) => {
      multer(multerOptions).single(fieldName)(request, null, async (err) => {
        if (err) {
          observer.error(`File upload error: ${err.message}`);
        } else {
          await next.handle().subscribe({
            next: (data) => observer.next(data),
            error: (error) => observer.error(error),
            complete: () => observer.complete(),
          });
        }
      });
    });
  }
}

export const FileUploadDecorator = (fieldName: string) =>
  UseInterceptors(FileInterceptor);
