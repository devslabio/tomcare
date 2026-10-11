import { createParamDecorator, ExecutionContext } from "@nestjs/common";

import type { AuthedRequest, StaffJwtPayload } from "./jwt-payload";

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): StaffJwtPayload => ctx.switchToHttp().getRequest<AuthedRequest>().user!,
);
