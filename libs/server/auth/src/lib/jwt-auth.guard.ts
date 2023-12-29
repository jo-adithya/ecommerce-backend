import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

import { UserDto } from "./user.dto";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const jwt = request.cookies.accessToken;
    if (!jwt) {
      throw new UnauthorizedException("You must be logged in to access this resource.");
    }

    try {
      const res = await fetch("http://auth-svc:3000/api/auth/iam", {
        headers: {
          Authorization: `bearer ${jwt}`,
        },
      });

      if (res.status !== 200) {
        throw new UnauthorizedException("You must be logged in to access this resource.");
      }

      request.user = (await res.json()) as UserDto;

      return true;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
