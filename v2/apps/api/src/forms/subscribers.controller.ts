import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { Throttle } from "@nestjs/throttler";

import { Staff } from "../auth/roles.decorator";
import { pageArgs, paged, PageQueryDto, sortArgs } from "../common/pagination";
import { PrismaService } from "../prisma/prisma.service";
import { SubscribeDto } from "./forms.dto";

@ApiTags("subscribers")
@Controller()
export class SubscribersController {
  constructor(private readonly prisma: PrismaService) {}

  /** Always answers the same way so the form can't be used to probe who is subscribed. */
  @Post("public/subscribe")
  @Throttle({ default: { limit: 5, ttl: 10 * 60_000 } })
  async subscribe(@Body() dto: SubscribeDto) {
    if (dto.website) return { ok: true };
    const email = dto.email.trim().toLowerCase();
    await this.prisma.subscriber.upsert({ where: { email }, create: { email }, update: {} });
    return { ok: true };
  }

  @Get("subscribers")
  @Staff("EDITOR")
  async list(@Query() query: PageQueryDto) {
    const q = query.q?.trim();
    const where: Prisma.SubscriberWhereInput = q ? { email: { contains: q, mode: "insensitive" } } : {};
    const [items, total] = await this.prisma.$transaction([
      this.prisma.subscriber.findMany({
        where,
        orderBy: sortArgs<Prisma.SubscriberOrderByWithRelationInput>(
          query,
          { email: (order) => ({ email: order }), createdAt: (order) => ({ createdAt: order }) },
          { createdAt: "desc" },
        ),
        ...pageArgs(query),
      }),
      this.prisma.subscriber.count({ where }),
    ]);
    return paged(items, total, query);
  }

  @Delete("subscribers/:id")
  @Staff("EDITOR")
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    await this.prisma.subscriber.delete({ where: { id } });
    return { ok: true };
  }
}
