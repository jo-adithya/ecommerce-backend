import { IsEmail } from 'class-validator';

export class GetUserByEmailDto {
  @IsEmail()
  email: string;
}
