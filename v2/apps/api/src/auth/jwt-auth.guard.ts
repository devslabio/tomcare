import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { PrismaService } from "../prisma/prisma.service";
import type { AuthedRequest, StaffJwtPayload } from "./jwt-payload";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthedRequest>();
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) throw new UnauthorizedException("Missing bearer token");

    let payload: StaffJwtPayload;
    try {
      payload = this.jwt.verify<StaffJwtPayload>(header.slice(7));
    } catch {
      throw new UnauthorizedException("Invalid or expired token");
    }

    // Re-read the account so deactivation and role changes take effect immediately.
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true, active: true },
    });
    if (!user?.active) throw new UnauthorizedException("Account is inactive");
    req.user = { sub: user.id, email: user.email, role: user.role };
    return true;
  }
}
