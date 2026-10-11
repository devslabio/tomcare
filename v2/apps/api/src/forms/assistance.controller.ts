import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { Throttle } from "@nestjs/throttler";

import { Staff } from "../auth/roles.decorator";
import { pageArgs, paged, sortArgs } from "../common/pagination";
import { PrismaService } from "../prisma/prisma.service";
import { CaseQueryDto, CreateAssistanceDto, UpdateCaseDto } from "./forms.dto";

@ApiTags("assistance requests")
@Controller()
export class AssistanceController {
  constructor(private readonly prisma: PrismaService) {}

  @Post("public/assistance")
  @Throttle({ default: { limit: 5, ttl: 10 * 60_000 } })
  async submit(@Body() dto: CreateAssistanceDto) {
    if (dto.website) return { ok: true };
    await this.prisma.assistanceRequest.create({
      data: {
        name: dto.name.trim(),
        email: dto.email.trim().toLowerCase(),
        phone: dto.phone?.trim() || null,
        language: dto.language?.trim() || null,
        city: dto.city?.trim() || null,
        needs: [...new Set((dto.needs ?? []).map((need) => need.trim()).filter(Boolean))],
        story: dto.story.trim(),
      },
    });
    return { ok: true };
  }

  @Get("assistance")
  @Staff("EDITOR")
  async list(@Query() query: CaseQueryDto) {
    const q = query.q?.trim();
    const where: Prisma.AssistanceRequestWhereInput = {
      status: query.status ?? { not: "ARCHIVED" },
      ...(q && {
        OR: [
          ...["name", "email", "city", "language", "story"].map((field) => ({
            [field]: { contains: q, mode: "insensitive" as const },
          })),
          { needs: { has: q } },
        ],
      }),
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.assistanceRequest.findMany({
        where,
        orderBy: sortArgs<Prisma.AssistanceRequestOrderByWithRelationInput>(
          query,
          {
            name: (order) => ({ name: order }),
            city: (order) => ({ city: { sort: order, nulls: "last" } }),
            status: (order) => ({ status: order }),
            createdAt: (order) => ({ createdAt: order }),
          },
          { createdAt: "desc" },
        ),
        ...pageArgs(query),
      }),
      this.prisma.assistanceRequest.count({ where }),
    ]);
    return paged(items, total, query);
  }

  @Get("assistance/:id")
  @Staff("EDITOR")
  get(@Param("id", ParseUUIDPipe) id: string) {
    return this.prisma.assistanceRequest.findUniqueOrThrow({ where: { id } });
  }

  @Patch("assistance/:id")
  @Staff("EDITOR")
  update(@Param("id", ParseUUIDPipe) id: string, @Body() dto: UpdateCaseDto) {
    return this.prisma.assistanceRequest.update({
      where: { id },
      data: { status: dto.status, notes: dto.notes?.trim() },
    });
  }

  @Delete("assistance/:id")
  @Staff("EDITOR")
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    await this.prisma.assistanceRequest.delete({ where: { id } });
    return { ok: true };
  }
}
