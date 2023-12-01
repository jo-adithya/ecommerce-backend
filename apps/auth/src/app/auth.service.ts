import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { jwtConfig } from "@nx-micro-ecomm/server/config";

import { CreateUserDto } from "../dtos";
import { HashingService } from "../hashing";
import { User } from "../models/user.schema";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY) private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    return this.usersService.create({
      ...createUserDto,
      password: await this.hashingService.hash(createUserDto.password),
    });
  }

  async signIn(user: User) {
    return this.generateTokens(user);
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersService.findByEmail({ email });
    const passwordIsValid = await this.hashingService.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException("Invalid email or password");
    }
    return user;
  }

  private async generateTokens(user: User) {
    const userId = user._id.toString();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(userId, this.jwtConfiguration.accessTokenTtl),
      this.signToken(userId, this.jwtConfiguration.refreshTokenTtl),
    ]);

    return { accessToken, refreshToken };
  }

  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        ...payload,
        sub: userId,
      } as T & { sub: string },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }
}
