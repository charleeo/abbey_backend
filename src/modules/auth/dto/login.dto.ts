
import { IsNotEmpty,  IsEmail} from 'class-validator';

export class LoginDto {
    
    @IsEmail()
    @IsNotEmpty()
    public email:string

    @IsNotEmpty()
    public password:string
    
}
