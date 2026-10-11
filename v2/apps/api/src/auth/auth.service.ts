import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcrypt";

import { PrismaService } from "../prisma/prisma.service";
import type { StaffJwtPayload } from "./jwt-payload";

export const PASSWORD_ROUNDS = 12;

const publicUser = { id: true, name: true, email: true, role: true, active: true, lastLoginAt: true } as const;

@Injectable()
export class AuthService {
  // Compared against when the account is missing, so timing doesn't reveal which emails exist.
  private readonly dummyHash = bcrypt.hashSync("tomcare-no-such-user", PASSWORD_ROUNDS);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    const valid = await bcrypt.compare(password, user?.passwordHash ?? this.dummyHash);
    if (!user || !valid || !user.active) throw new UnauthorizedException("Incorrect email or password");

    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    const payload: StaffJwtPayload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwt.sign(payload),
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }

  me(userId: string) {
    return this.prisma.user.findUniqueOrThrow({ where: { id: userId }, select: publicUser });
  }

  updateProfile(userId: string, name: string) {
    return this.prisma.user.update({ where: { id: userId }, data: { name: name.trim() }, select: publicUser });
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (!(await bcrypt.compare(currentPassword, user.passwordHash))) {
      throw new BadRequestException("Current password is incorrect");
    }
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: await bcrypt.hash(newPassword, PASSWORD_ROUNDS) },
    });
    return { ok: true };
  }
}
