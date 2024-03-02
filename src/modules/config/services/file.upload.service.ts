import * as fs from 'fs';
import multer, { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class FileUploadService {
  async uploadFile(
    request: any,
    {
      fieldName = 'file',
      uploadPath = 'public/uploads',
      databasePath = 'uploads',
    }: FileUploadType,
  ): Promise<string> {
    const maxFileSize = 1 * 1024 * 1024; //file  size  in bytes

    const multerOptions = {
      storage: diskStorage({
        destination: uploadPath,
        filename: (req, file, cb) => {
          const uniqueSuffix = uuidv4();
          const fileExtension = file.originalname.split('.').pop();
          cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtension}`);
        },
      }),

      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|JIF|jif)$/)) {
          return cb(
            new BadRequestException(
              'Invalid file format. Only JPG, JPEG, and PNG are allowed.',
            ),
          );
        }

        cb(null, true);
      },
      limits: {
        fileSize: maxFileSize,
      },
    };

    return new Promise<string>((resolve, reject) => {
      multer(multerOptions).single(fieldName)(request, null, (err) => {
         if (err) {
          //when there is another error
          if (err instanceof multer.MulterError) {
            //when error is a multer type of error
            if (err.code === 'LIMIT_FILE_SIZE') {
              reject(
                new BadRequestException(
                  `File size exceeds the maximum limit of ${Math.floor(maxFileSize/1000000)} mb.`,
                ),
              );
            } else {
              reject(err);
            }
          } else {
            reject(err);
          }
        } else {
          const filePathToDB = `${databasePath}/${request.file.filename}`;
          resolve(filePathToDB);
        }
      });
    });
  }

  async deleteFileFromFolder(path) {
    if (fs.existsSync(path)) {
      // Delete the file
      fs.unlinkSync(path);
    }
  }
}

export interface FileUploadType {
  fieldName?: string;
  uploadPath?: string;
  databasePath?: string;
}
