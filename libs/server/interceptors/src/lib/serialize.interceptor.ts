import { plainToInstance } from "class-transformer";
import { Observable, map } from "rxjs";

import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";

interface ClassConstructor {
  new (...args: any[]): object;
}

export const Serialize = (dto: ClassConstructor) => {
  return UseInterceptors(new SerializeInterceptor(dto));
};

class SerializeInterceptor implements NestInterceptor {
  constructor(private readonly dto: ClassConstructor) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // Intercept incoming requests

    // Intercept outgoing responses
    return next.handle().pipe(
      map((data) => {
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
