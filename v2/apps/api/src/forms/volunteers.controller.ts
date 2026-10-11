import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { Throttle } from "@nestjs/throttler";

import { Staff } from "../auth/roles.decorator";
import { pageArgs, paged, sortArgs } from "../common/pagination";
import { PrismaService } from "../prisma/prisma.service";
import { CaseQueryDto, CreateVolunteerDto, UpdateCaseDto } from "./forms.dto";

@ApiTags("volunteer applications")
@Controller()
export class VolunteersController {
  constructor(private readonly prisma: PrismaService) {}

  @Post("public/volunteers")
  @Throttle({ default: { limit: 5, ttl: 10 * 60_000 } })
  async submit(@Body() dto: CreateVolunteerDto) {
    if (dto.website) return { ok: true };
    await this.prisma.volunteerApplication.create({
      data: {
        name: dto.name.trim(),
        email: dto.email.trim().toLowerCase(),
        phone: dto.phone?.trim() || null,
        role: dto.role?.trim() || null,
        availability: dto.availability?.trim() || null,
        experience: dto.experience?.trim() || null,
        message: dto.message?.trim() || null,
      },
    });
    return { ok: true };
  }

  @Get("volunteers")
  @Staff("EDITOR")
  async list(@Query() query: CaseQueryDto) {
    const q = query.q?.trim();
    const where: Prisma.VolunteerApplicationWhereInput = {
      status: query.status ?? { not: "ARCHIVED" },
      ...(q && {
        OR: ["name", "email", "role", "availability", "experience", "message"].map((field) => ({
          [field]: { contains: q, mode: "insensitive" },
        })),
      }),
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.volunteerApplication.findMany({
        where,
        orderBy: sortArgs<Prisma.VolunteerApplicationOrderByWithRelationInput>(
          query,
          {
            name: (order) => ({ name: order }),
            role: (order) => ({ role: { sort: order, nulls: "last" } }),
            status: (order) => ({ status: order }),
            createdAt: (order) => ({ createdAt: order }),
          },
          { createdAt: "desc" },
        ),
        ...pageArgs(query),
      }),
      this.prisma.volunteerApplication.count({ where }),
    ]);
    return paged(items, total, query);
  }

  @Get("volunteers/:id")
  @Staff("EDITOR")
  get(@Param("id", ParseUUIDPipe) id: string) {
    return this.prisma.volunteerApplication.findUniqueOrThrow({ where: { id } });
  }

  @Patch("volunteers/:id")
  @Staff("EDITOR")
  update(@Param("id", ParseUUIDPipe) id: string, @Body() dto: UpdateCaseDto) {
    return this.prisma.volunteerApplication.update({
      where: { id },
      data: { status: dto.status, notes: dto.notes?.trim() },
    });
  }

  @Delete("volunteers/:id")
  @Staff("EDITOR")
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    await this.prisma.volunteerApplication.delete({ where: { id } });
    return { ok: true };
  }
}
