import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class JwtAuthGuard implements CanActivate {
	canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
		const jwt = request.cookies.accessToken;
		if (!jwt) return false;
		return request.isAuthenticated();
	}
}
