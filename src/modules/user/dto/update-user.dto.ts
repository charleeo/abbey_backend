import { IsOptional, IsString, Length } from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';

import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  @Length(2, 225)
  public firstname: string;

  @IsOptional()
  @IsString()
  @Length(2, 225)
  public lastname: string;

  @IsOptional()
  @IsString()
  @Length(2, 225)
  public usernam: string;

  @IsOptional()
  @IsString()
  @Length(2, 225)
  public phone: string;

  @IsOptional()
  @IsString()
  @Length(2, 225)
  public address: string;
}
