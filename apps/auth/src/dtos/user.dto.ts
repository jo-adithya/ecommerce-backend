import { Expose } from "class-transformer";

export class UserDto {
  @Expose({ name: "_id" })
  id: string;

  @Expose()
  email: string;
}
