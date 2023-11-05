import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
	getData(): { message: string } {
		return { message: "Hello API" };
	}
}
