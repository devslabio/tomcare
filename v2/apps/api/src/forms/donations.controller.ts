import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { Throttle } from "@nestjs/throttler";

import { Staff } from "../auth/roles.decorator";
import { pageArgs, paged, sortArgs } from "../common/pagination";
import { PrismaService } from "../prisma/prisma.service";
import { CaseQueryDto, CreateDonationDto, UpdateCaseDto } from "./forms.dto";

@ApiTags("donations")
@Controller()
export class DonationsController {
  constructor(private readonly prisma: PrismaService) {}

  @Post("public/donations")
  @Throttle({ default: { limit: 5, ttl: 10 * 60_000 } })
  async submit(@Body() dto: CreateDonationDto) {
    if (dto.website) return { ok: true };
    const program = dto.program?.trim()
      ? await this.prisma.program.findUnique({ where: { slug: dto.program.trim() }, select: { title: true } })
      : null;
    await this.prisma.donationPledge.create({
      data: {
        name: dto.name.trim(),
        email: dto.email.trim().toLowerCase(),
        phone: dto.phone?.trim() || null,
        amountCents: Math.round(dto.amount * 100),
        frequency: dto.frequency,
        method: dto.method,
        cause: program?.title ?? null,
        message: dto.message?.trim() || null,
        anonymous: dto.anonymous ?? false,
      },
    });
    return { ok: true };
  }

  @Get("donations")
  @Staff("EDITOR")
  async list(@Query() query: CaseQueryDto) {
    const q = query.q?.trim();
    const where: Prisma.DonationPledgeWhereInput = {
      status: query.status ?? { not: "ARCHIVED" },
      ...(q && {
        OR: ["name", "email", "cause", "message"].map((field) => ({
          [field]: { contains: q, mode: "insensitive" },
        })),
      }),
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.donationPledge.findMany({
        where,
        orderBy: sortArgs<Prisma.DonationPledgeOrderByWithRelationInput>(
          query,
          {
            name: (order) => ({ name: order }),
            amount: (order) => ({ amountCents: order }),
            status: (order) => ({ status: order }),
            createdAt: (order) => ({ createdAt: order }),
          },
          { createdAt: "desc" },
        ),
        ...pageArgs(query),
      }),
      this.prisma.donationPledge.count({ where }),
    ]);
    return paged(items, total, query);
  }

  @Get("donations/:id")
  @Staff("EDITOR")
  get(@Param("id", ParseUUIDPipe) id: string) {
    return this.prisma.donationPledge.findUniqueOrThrow({ where: { id } });
  }

  @Patch("donations/:id")
  @Staff("EDITOR")
  update(@Param("id", ParseUUIDPipe) id: string, @Body() dto: UpdateCaseDto) {
    return this.prisma.donationPledge.update({
      where: { id },
      data: { status: dto.status, notes: dto.notes?.trim() },
    });
  }

  @Delete("donations/:id")
  @Staff("EDITOR")
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    await this.prisma.donationPledge.delete({ where: { id } });
    return { ok: true };
  }
}
