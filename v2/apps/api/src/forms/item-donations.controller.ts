import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { Throttle } from "@nestjs/throttler";

import { Staff } from "../auth/roles.decorator";
import { pageArgs, paged, sortArgs } from "../common/pagination";
import { PrismaService } from "../prisma/prisma.service";
import { CaseQueryDto, CreateItemDonationDto, UpdateCaseDto } from "./forms.dto";

@ApiTags("item-donations")
@Controller()
export class ItemDonationsController {
  constructor(private readonly prisma: PrismaService) {}

  @Post("public/item-donations")
  @Throttle({ default: { limit: 5, ttl: 10 * 60_000 } })
  async submit(@Body() dto: CreateItemDonationDto) {
    if (dto.website) return { ok: true };
    const pickUp = dto.handoff === "PICK_UP";
    const vehicle = dto.categories.includes("VEHICLE");
    await this.prisma.itemDonation.create({
      data: {
        name: dto.name.trim(),
        email: dto.email.trim().toLowerCase(),
        phone: dto.phone?.trim() || null,
        categories: [...new Set(dto.categories)],
        description: dto.description.trim(),
        handoff: dto.handoff,
        address: pickUp ? dto.address?.trim() || null : null,
        postalCode: pickUp ? dto.postalCode?.trim().toUpperCase() || null : null,
        vehicle: vehicle ? dto.vehicle?.trim() || null : null,
        vehicleYear: vehicle ? (dto.vehicleYear ?? null) : null,
        vehicleRuns: vehicle ? (dto.vehicleRuns ?? null) : null,
        hasOwnership: vehicle ? (dto.hasOwnership ?? null) : null,
      },
    });
    return { ok: true };
  }

  @Get("item-donations")
  @Staff("EDITOR")
  async list(@Query() query: CaseQueryDto) {
    const q = query.q?.trim();
    const where: Prisma.ItemDonationWhereInput = {
      status: query.status ?? { not: "ARCHIVED" },
      ...(q && {
        OR: ["name", "email", "description", "address", "postalCode", "vehicle"].map((field) => ({
          [field]: { contains: q, mode: "insensitive" },
        })),
      }),
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.itemDonation.findMany({
        where,
        orderBy: sortArgs<Prisma.ItemDonationOrderByWithRelationInput>(
          query,
          {
            name: (order) => ({ name: order }),
            handoff: (order) => ({ handoff: order }),
            status: (order) => ({ status: order }),
            createdAt: (order) => ({ createdAt: order }),
          },
          { createdAt: "desc" },
        ),
        ...pageArgs(query),
      }),
      this.prisma.itemDonation.count({ where }),
    ]);
    return paged(items, total, query);
  }

  @Get("item-donations/:id")
  @Staff("EDITOR")
  get(@Param("id", ParseUUIDPipe) id: string) {
    return this.prisma.itemDonation.findUniqueOrThrow({ where: { id } });
  }

  @Patch("item-donations/:id")
  @Staff("EDITOR")
  update(@Param("id", ParseUUIDPipe) id: string, @Body() dto: UpdateCaseDto) {
    return this.prisma.itemDonation.update({
      where: { id },
      data: { status: dto.status, notes: dto.notes?.trim() },
    });
  }

  @Delete("item-donations/:id")
  @Staff("EDITOR")
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    await this.prisma.itemDonation.delete({ where: { id } });
    return { ok: true };
  }
}
