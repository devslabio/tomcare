import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, ParseUUIDPipe, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { Staff } from "../auth/roles.decorator";
import { uniqueSlug } from "../common/slug";
import { PrismaService } from "../prisma/prisma.service";
import { EventDto } from "./content.dto";
import { TRANSLATIONS, withTranslation } from "./translation";

function data(dto: EventDto) {
  if (dto.endsAt && dto.endsAt < dto.startsAt) throw new BadRequestException("The event can't end before it starts");
  return {
    title: dto.title.trim(),
    summary: dto.summary.trim(),
    body: dto.body?.trim() ?? "",
    image: dto.image || null,
    startsAt: dto.startsAt,
    endsAt: dto.endsAt ?? null,
    location: dto.location.trim(),
    registerUrl: dto.registerUrl || null,
    visible: dto.visible,
    ...withTranslation(dto.fr, TRANSLATIONS.event),
  };
}

@ApiTags("events")
@Controller()
export class EventsController {
  constructor(private readonly prisma: PrismaService) {}

  /** Upcoming events first (soonest at the top), then past ones (most recent first). */
  @Get("public/events")
  async listPublic() {
    const now = new Date();
    const [upcoming, past] = await Promise.all([
      this.prisma.event.findMany({
        where: { visible: true, OR: [{ endsAt: { gte: now } }, { endsAt: null, startsAt: { gte: now } }] },
        orderBy: { startsAt: "asc" },
      }),
      this.prisma.event.findMany({
        where: { visible: true, OR: [{ endsAt: { lt: now } }, { endsAt: null, startsAt: { lt: now } }] },
        orderBy: { startsAt: "desc" },
        take: 12,
      }),
    ]);
    return { upcoming, past };
  }

  @Get("public/events/:slug")
  async getPublic(@Param("slug") slug: string) {
    const event = await this.prisma.event.findFirst({ where: { slug, visible: true } });
    if (!event) throw new NotFoundException("Event not found");
    return event;
  }

  @Get("events")
  @Staff("EDITOR")
  list() {
    return this.prisma.event.findMany({ orderBy: { startsAt: "desc" } });
  }

  @Get("events/:id")
  @Staff("EDITOR")
  get(@Param("id", ParseUUIDPipe) id: string) {
    return this.prisma.event.findUniqueOrThrow({ where: { id } });
  }

  @Post("events")
  @Staff("EDITOR")
  async create(@Body() dto: EventDto) {
    const slug = await uniqueSlug(dto.title, async (s) => !!(await this.prisma.event.findUnique({ where: { slug: s } })));
    return this.prisma.event.create({ data: { ...data(dto), slug } });
  }

  @Patch("events/:id")
  @Staff("EDITOR")
  update(@Param("id", ParseUUIDPipe) id: string, @Body() dto: EventDto) {
    return this.prisma.event.update({ where: { id }, data: data(dto) });
  }

  @Delete("events/:id")
  @Staff("EDITOR")
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    await this.prisma.event.delete({ where: { id } });
    return { ok: true };
  }
}
