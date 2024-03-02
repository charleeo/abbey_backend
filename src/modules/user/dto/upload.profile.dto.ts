import {
  IsNotEmpty,
  Length,
} from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';

import { CreateUserDto } from './create-user.dto';

export class UploadProfileDto extends PartialType(CreateUserDto) {
  

  @IsNotEmpty()
  
  @Length(2, 225)
  public profile_picture: string;
}
