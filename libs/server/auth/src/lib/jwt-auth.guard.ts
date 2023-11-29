import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtAuthGuard implements CanActivate {
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		console.log("COOKIES: ", JSON.stringify(request.cookies));
		const jwt = request.cookies.accessToken;
		if (!jwt) {
			throw new UnauthorizedException("You must be logged in to access this resource.");
		}

		const res = await fetch("http://localhost:3001/api/auth/iam", {
			headers: {
				Authorization: `bearer ${jwt}`,
			},
		});

		if (res.status !== 200) {
			throw new UnauthorizedException("You must be logged in to access this resource.");
		}

		return true;
	}
}
