import {
  IsEmail,
  IsString,
  IsNumber,
  IsInt,
  Min,
  Max,
  MinLength,
  IsNotEmpty,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
import { PasswordUtil } from '@utils/util.password';
import { UserRole } from '@user/role/role.enum';

export class UserDto {
  private _email: string;
  private _password: string;
  private _name: string;
  private _phone: string;
  private _age: number;
  private _auth: string;

  // Email
  @IsEmail()
  @IsNotEmpty()
  get email(): string {
    return this._email;
  }
  set email(value: string) {
    this._email = value;
  }

  // Password
  @IsString()
  @IsNotEmpty()
  get password(): string {
    return this._password;
  }
  async setPassword(value: string) {
    this._password = await PasswordUtil.hash(value);
  }

  // Name
  @IsString()
  @IsNotEmpty()
  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }

  // Phone
  @IsString()
  get phone(): string {
    return this._phone;
  }
  set phone(value: string) {
    this._phone = value;
  }

  // Age
  @IsNumber()
  @IsInt()
  @Min(0)
  get age(): number {
    return this._age;
  }
  set age(value: number) {
    this._age = value;
  }

  // Role
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
