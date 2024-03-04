
import { IsNotEmpty, IsNumber,IsArray, IsOptional, IsString, Validate} from 'class-validator';


export class RoleDto {
 
    @IsNumber()
    public id:number

    @IsNotEmpty()
    public role_name:string

    @IsNotEmpty()
    public role:string
}

export class MorgageDTO
{
    
}




