import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { StaffRole } from "@prisma/client";

import type { AuthedRequest } from "./jwt-payload";
import { ROLES_KEY } from "./roles.constants";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<StaffRole[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    const user = context.switchToHttp().getRequest<AuthedRequest>().user;
    if (!user) throw new ForbiddenException("Authentication required");
    if (!roles?.length || user.role === "ADMIN" || roles.includes(user.role)) return true;
    throw new ForbiddenException("Your role does not have access to this section");
  }
}
