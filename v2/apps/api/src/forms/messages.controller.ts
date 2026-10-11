import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { Throttle } from "@nestjs/throttler";

import { Staff } from "../auth/roles.decorator";
import { pageArgs, paged, sortArgs } from "../common/pagination";
import { PrismaService } from "../prisma/prisma.service";
import { CreateMessageDto, MessageQueryDto, UpdateMessageDto } from "./forms.dto";

@ApiTags("messages")
@Controller()
export class MessagesController {
  constructor(private readonly prisma: PrismaService) {}

  @Post("public/messages")
  @Throttle({ default: { limit: 5, ttl: 10 * 60_000 } })
  async submit(@Body() dto: CreateMessageDto) {
    // Bots fill every field; accept silently so they don't retry.
    if (dto.website) return { ok: true };
    await this.prisma.contactMessage.create({
      data: {
        name: dto.name.trim(),
        email: dto.email.trim().toLowerCase(),
        phone: dto.phone?.trim() || null,
        subject: dto.subject?.trim() || null,
        message: dto.message.trim(),
      },
    });
    return { ok: true };
  }

  @Get("messages")
  @Staff("EDITOR")
  async list(@Query() query: MessageQueryDto) {
    const q = query.q?.trim();
    const where: Prisma.ContactMessageWhereInput = {
      status: query.status ?? { not: "ARCHIVED" },
      ...(q && {
        OR: ["name", "email", "subject", "message"].map((field) => ({ [field]: { contains: q, mode: "insensitive" } })),
      }),
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.contactMessage.findMany({
        where,
        orderBy: sortArgs<Prisma.ContactMessageOrderByWithRelationInput>(
          query,
          {
            name: (order) => ({ name: order }),
            subject: (order) => ({ subject: order }),
            status: (order) => ({ status: order }),
            createdAt: (order) => ({ createdAt: order }),
          },
          { createdAt: "desc" },
        ),
        ...pageArgs(query),
      }),
      this.prisma.contactMessage.count({ where }),
    ]);
    return paged(items, total, query);
  }

  @Get("messages/:id")
  @Staff("EDITOR")
  async get(@Param("id", ParseUUIDPipe) id: string) {
    const message = await this.prisma.contactMessage.findUniqueOrThrow({ where: { id } });
    if (message.status !== "NEW") return message;
    return this.prisma.contactMessage.update({ where: { id }, data: { status: "READ", readAt: new Date() } });
  }

  @Patch("messages/:id")
  @Staff("EDITOR")
  update(@Param("id", ParseUUIDPipe) id: string, @Body() dto: UpdateMessageDto) {
    return this.prisma.contactMessage.update({ where: { id }, data: { status: dto.status } });
  }

  @Delete("messages/:id")
  @Staff("EDITOR")
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    await this.prisma.contactMessage.delete({ where: { id } });
    return { ok: true };
  }
}
