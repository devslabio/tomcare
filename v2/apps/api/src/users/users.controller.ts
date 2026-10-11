import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import bcrypt from "bcrypt";

import { PASSWORD_ROUNDS } from "../auth/auth.service";
import { CurrentUser } from "../auth/current-user.decorator";
import type { StaffJwtPayload } from "../auth/jwt-payload";
import { Staff } from "../auth/roles.decorator";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto, UpdateUserDto } from "./users.dto";

const select = { id: true, name: true, email: true, role: true, active: true, lastLoginAt: true, createdAt: true };

@ApiTags("users")
@Staff("ADMIN")
@Controller("users")
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  list() {
    return this.prisma.user.findMany({ select, orderBy: [{ active: "desc" }, { name: "asc" }] });
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const email = dto.email.toLowerCase().trim();
    if (await this.prisma.user.findUnique({ where: { email } })) {
      throw new ConflictException("A staff account with this email already exists");
    }
    return this.prisma.user.create({
      data: {
        name: dto.name.trim(),
        email,
        role: dto.role,
        passwordHash: await bcrypt.hash(dto.password, PASSWORD_ROUNDS),
      },
      select,
    });
  }

  @Patch(":id")
  async update(@Param("id", ParseUUIDPipe) id: string, @Body() dto: UpdateUserDto, @CurrentUser() me: StaffJwtPayload) {
    if (id === me.sub && (dto.active === false || (dto.role && dto.role !== "ADMIN"))) {
      throw new BadRequestException("You can't deactivate or demote your own account");
    }
    return this.prisma.user.update({
      where: { id },
      data: {
        name: dto.name?.trim(),
        role: dto.role,
        active: dto.active,
        passwordHash: dto.password ? await bcrypt.hash(dto.password, PASSWORD_ROUNDS) : undefined,
      },
      select,
    });
  }

  @Delete(":id")
  async remove(@Param("id", ParseUUIDPipe) id: string, @CurrentUser() me: StaffJwtPayload) {
    if (id === me.sub) throw new BadRequestException("You can't delete your own account");
    await this.prisma.user.delete({ where: { id } });
    return { ok: true };
  }
}
