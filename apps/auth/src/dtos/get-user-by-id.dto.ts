import { IsNotEmpty, IsString } from "class-validator";

export class GetUserByIdDto {
	@IsString()
	@IsNotEmpty()
	_id: string;
}
