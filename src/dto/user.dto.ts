// user.dto.ts
import {
  Length,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from "class-validator";

export class UserDto {
  @IsString()
  fullname: string;

  @Length(4, 100)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8) // Minimum password length of 8 characters
  password: string;
}
