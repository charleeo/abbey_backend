import {
  IsNotEmpty,
  Length,
  IsEmail,
  IsEnum,
  IsNumber,
  Validate,
  Matches,
} from 'class-validator';
import { UniqueEmailValidator } from 'src/config/pipes/unique.user.validator';
import { Users } from '../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @Validate(UniqueEmailValidator, [Users, 'email'])
  public email: string;

  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&^<>])[A-Za-z\d@$!%*?#&^<>]{7,}$/,
    {
      message: `$property must have a lower case, an upper case, a number, a special character and a minimum of 10 characters`,
    },
  )
  public password: string;
}
