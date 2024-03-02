import {
  IsEmail,
  IsNotEmpty,
} from 'class-validator';

export class RefreshTokenDto {
  @IsEmail()
  @IsNotEmpty()
  public refresh: string;
}
