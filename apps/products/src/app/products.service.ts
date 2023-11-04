import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductsService {
	getData(): { message: string } {
		return { message: "Hello API" };
	}
}
